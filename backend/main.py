from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import tomllib

with open("config.toml", "rb") as f:
    config = tomllib.load(f)
API_KEY = config["api"]["api_key"]

# Sử dụng unitGroup=metric để lấy đơn vị độ C và mm
url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]?unitGroup=metric&key={API_KEY}"

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
    res = requests.get(url.replace("[location]", city))
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail="Không tìm thấy thành phố hoặc lỗi từ nhà cung cấp thời tiết.")
    
    data = res.json()
    current = data.get("currentConditions", {})
    
    return {
        "city": data.get("resolvedAddress", city),
        "current": {
            "temp": current.get("temp"),
            "condition": current.get("conditions", "N/A"),
            "humidity": current.get("humidity"),
            "precip": current.get("precip") if current.get("precip") is not None else 0,
            "uv": current.get("uvindex"),
            "aqi": current.get("aqi") if current.get("aqi") is not None else "N/A"
        }
    }
