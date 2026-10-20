# 🌤️ Weather Dashboard App

Ứng dụng tra cứu thời tiết thời gian thực được xây dựng với **FastAPI** (Backend) và **HTML/CSS/JavaScript thuần** (Frontend), tích hợp dữ liệu từ dịch vụ **Visual Crossing Weather API**.

---

## 🚀 Tính năng nổi bật

- 🔍 **Tìm kiếm thời tiết nhanh:** Tra cứu thông tin thời tiết theo tên thành phố (hỗ trợ cả phím Enter).
- 💾 **Lưu trạng thái & Tự động tải lại (Sprint 4):**
  - Tự động ghi nhớ thành phố tìm kiếm gần nhất bằng `localStorage`.
  - Tự động gọi API và hiển thị thời tiết ngay khi mở trang web (`window.onload`) mà không cần thao tác gõ lại.
- 🛡️ **Xử lý ngoại lệ chuẩn RESTful (Sprint 4):**
  - Backend sử dụng `try/except` bắt mọi lỗi từ API đối tác hoặc lỗi tên thành phố không tồn tại (như "Abcdxyz"), trả về mã **HTTP 404 (Not Found)** thay vì làm sập server.
  - Frontend bắt lỗi 404 và hiển thị thông báo màu đỏ mờ trang nhã: *"Không tìm thấy dữ liệu cho thành phố này"*, đồng thời tự động **xóa sạch bảng dữ liệu cũ** và biểu đồ để tránh gây nhầm lẫn.
- 📊 **Giao diện Dashboard chuyên nghiệp:**
  - Bố cục kết hợp **Flexbox & CSS Grid** hiện đại, responsive trên nhiều kích cỡ màn hình.
  - **Phần tổng quan:** Tên địa điểm, nhiệt độ lớn (°C), trạng thái thời tiết.
  - **Lưới 4 chỉ số chi tiết:**
    - 💧 **Độ ẩm** (`%`)
    - 🌧️ **Lượng mưa** (`mm`)
    - ☀️ **Chỉ số UV** (UV Index)
    - 🍃 **Chất lượng không khí** (AQI theo chuẩn US EPA - `aqius`)
- 📈 **Biểu đồ nhiệt độ 24 giờ (Sprint 3):** Tích hợp thư viện Chart.js vẽ biểu đồ đường (Line Chart) mượt mà (`tension: 0.4`) thể hiện xu hướng nhiệt độ trong ngày.
- 📅 **Dự báo 7 ngày tới (Sprint 3):** Hiển thị danh sách động 7 ngày tiếp theo với thứ trong tuần, icon emoji thời tiết và nhiệt độ cao nhất / thấp nhất (max/min).
- ⏳ **Trải nghiệm mượt mà:** Trạng thái đang tải (Loading state) nhấp nháy khi đang fetch dữ liệu.
- 🌐 **Bảo mật & Cấu hình CORS:** API Backend hỗ trợ CORS cho phép frontend gọi mượt mà từ bất kỳ origin nào.

---

## 📁 Cấu trúc dự án

```text
Weather-App/
├── backend/
│   └── main.py          # Server FastAPI xử lý API, làm sạch dữ liệu & bắt lỗi 404
├── frontend/
│   ├── index.html       # Khung cấu trúc HTML của Dashboard
│   ├── style.css        # Toàn bộ định dạng CSS (Flexbox, Grid, hiệu ứng, responsive)
│   └── app.js           # Logic gọi API, Chart.js, LocalStorage & render động
├── config.toml          # File lưu cấu hình & API key (không commit lên git)
├── requirements.txt     # Danh sách thư viện Python cần thiết
└── README.md            # Tài liệu hướng dẫn sử dụng
```

---

## ⚙️ Yêu cầu & Cài đặt

### 1. Yêu cầu môi trường
- **Python 3.10+**
- Tài khoản và API Key từ [Visual Crossing Weather](https://www.visualcrossing.com/weather-api)

### 2. Cài đặt các thư viện phụ thuộc
Mở terminal tại thư mục gốc của dự án và cài đặt:

```bash
pip install -r requirements.txt
```

### 3. Cấu hình API Key
Tạo file `config.toml` tại thư mục gốc (ngang hàng với `requirements.txt`):

```toml
[api]
api_key = "YOUR_VISUAL_CROSSING_API_KEY"
```

---

## 🖥️ Hướng dẫn khởi chạy

### Bước 1: Khởi động Backend (FastAPI)
Chạy lệnh sau tại thư mục gốc của dự án:

```bash
uvicorn backend.main:app --reload
```

* Backend sẽ khởi chạy tại: [http://localhost:8000](http://localhost:8000)
* Tài liệu API tương tác tự động (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

### Bước 2: Khởi động Frontend
Bạn có thể lựa chọn 1 trong 2 cách sau:

- **Cách 1 (Nhanh nhất):** Nhấp đúp chuột trực tiếp vào file `frontend/index.html` để mở trên trình duyệt.
- **Cách 2 (Khuyên dùng):** Dùng extension **Live Server** trong VS Code hoặc khởi chạy server tĩnh với Python:
  ```bash
  python -m http.server 3000 --directory frontend
  ```
  Sau đó truy cập: [http://localhost:3000](http://localhost:3000).

---

## 🔌 Tài liệu API Endpoints

### 1. Kiểm tra trạng thái máy chủ
- **Endpoint:** `GET /`
- **Mô tả:** Kiểm tra kết nối server.
- **Response mẫu:**
  ```json
  {
    "message": "Hello, World!"
  }
  ```

### 2. Lấy thông tin thời tiết theo thành phố
- **Endpoint:** `GET /weather/{city}`
- **Tham số đường dẫn:** `city` *(string, bắt buộc)*: Tên thành phố (ví dụ: `hanoi`, `tokyo`, `paris`, `new york`).
- **Response thành công (200 OK):**
  ```json
  {
    "city": "hanoi",
    "current": {
      "temp": 28.0,
      "condition": "Clear",
      "humidity": 78.9,
      "precip": 0,
      "uv": 0.0,
      "aqi": 93.0
    },
    "hours": [
      {"time": "00:00", "temp": 28.0},
      {"time": "01:00", "temp": 27.5}
    ],
    "days": [
      {
        "date": "2026-10-20",
        "tempmax": 35.0,
        "tempmin": 25.0,
        "condition": "Partially cloudy",
        "icon": "partly-cloudy-day"
      }
    ]
  }
  ```
- **Response lỗi (404 Not Found):**
  Khi nhập sai tên thành phố (ví dụ: `/weather/Abcdxyz`):
  ```json
  {
    "detail": "Không tìm thấy dữ liệu cho thành phố này"
  }
  ```

---

## 🛠️ Công nghệ sử dụng

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), Requests, Tomllib.
- **Frontend:** Semantic HTML5, Modern CSS (Flexbox & CSS Grid), Vanilla JavaScript (Async/Await, Fetch API, LocalStorage), [Chart.js](https://www.chartjs.org/).
- **Data Source:** [Visual Crossing Timeline Weather API](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/).
