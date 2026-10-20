from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import tomllib

with open("config.toml", "rb") as f:
    config = tomllib.load(f)
API_KEY = config["api"]["api_key"]

# URL gốc không chỉ định elements → lấy toàn bộ dữ liệu (bao gồm days + hours)
# Sau đó backend sẽ dùng List Comprehension để làm sạch và chỉ gửi những trường cần thiết
BASE_URL = (
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]"
    f"?unitGroup=metric&key={API_KEY}"
)

# URL riêng để lấy thêm aqius (cần chỉ định elements)
AQI_URL = (
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]"
    f"?unitGroup=metric&elements=datetime,aqius&key={API_KEY}"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hello, World!"}

@app.get("/weather/{city}")
def get_weather(city: str):
    # Gọi API chính (lấy toàn bộ dữ liệu thời tiết bao gồm days & hours)
    res = requests.get(BASE_URL.replace("[location]", city))
    if res.status_code != 200:
        raise HTTPException(
            status_code=res.status_code,
            detail="Không tìm thấy thành phố hoặc lỗi từ nhà cung cấp thời tiết."
        )

    data = res.json()
    current = data.get("currentConditions", {})

    # Gọi API riêng để lấy AQI (aqius cần elements riêng)
    aqi_value = "N/A"
    try:
        aqi_res = requests.get(AQI_URL.replace("[location]", city))
        if aqi_res.status_code == 200:
            aqi_current = aqi_res.json().get("currentConditions", {})
            aqi_value = aqi_current.get("aqius") if aqi_current.get("aqius") is not None else "N/A"
    except Exception:
        pass

    # --- Bóc tách mảng hours (24 phần tử của ngày hôm nay) ---
    # Dùng List Comprehension để làm sạch: chỉ giữ datetime và temp
    today_hours_raw = data.get("days", [{}])[0].get("hours", [])
    hours = [
        {"time": h["datetime"][:5], "temp": h.get("temp")}   # "00:00:00" → "00:00"
        for h in today_hours_raw
    ]

    # --- Bóc tách mảng days (lấy 7 ngày tới) ---
    # List Comprehension lọc chỉ giữ các trường cần thiết cho dự báo
    all_days = data.get("days", [])
    days = [
        {
            "date": d["datetime"],              # "2026-10-20"
            "tempmax": d.get("tempmax"),
            "tempmin": d.get("tempmin"),
            "condition": d.get("conditions", "N/A"),
            "icon": d.get("icon", "")
        }
        for d in all_days[:7]                   # Chỉ lấy 7 ngày đầu tiên
    ]

    return {
        "city": data.get("resolvedAddress", city),
        "current": {
            "temp": current.get("temp"),
            "condition": current.get("conditions", "N/A"),
            "humidity": current.get("humidity"),
            "precip": current.get("precip") if current.get("precip") is not None else 0,
            "uv": current.get("uvindex"),
            "aqi": aqi_value
        },
        "hours": hours,
        "days": days
    }
