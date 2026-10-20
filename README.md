# 🌤️ Weather Dashboard App

Ứng dụng tra cứu thời tiết thời gian thực được xây dựng với **FastAPI** (Backend) và **HTML/CSS/JavaScript ** (Frontend), tích hợp dữ liệu từ dịch vụ **Visual Crossing Weather API**.

---

## 🚀 Tính năng nổi bật

- 🔍 **Tìm kiếm thời tiết nhanh:** Tra cứu thông tin thời tiết theo tên thành phố (hỗ trợ cả phím Enter).
- 📊 **Giao diện Dashboard chuyên nghiệp:**
  - Bố cục kết hợp **Flexbox & CSS Grid** hiện đại, responsive trên nhiều kích cỡ màn hình.
  - **Phần tổng quan:** Tên địa điểm, nhiệt độ lớn (°C), trạng thái thời tiết.
  - **Lưới 4 chỉ số chi tiết:**
    - 💧 **Độ ẩm** (`%`)
    - 🌧️ **Lượng mưa** (`mm`)
    - ☀️ **Chỉ số UV** (UV Index)
    - 🍃 **Chất lượng không khí** (AQI theo chuẩn US EPA - `aqius`)
- ⏳ **Trải nghiệm mượt mà:** Có trạng thái đang tải (Loading state) và thông báo lỗi rõ ràng khi không tìm thấy thành phố.
- 🛡️ **Bảo mật & Cấu hình CORS:** API Backend hỗ trợ CORS cho phép frontend gọi mượt mà từ bất kỳ origin nào.

---

## 📁 Cấu trúc dự án

```text
Weather-App/
├── backend/
│   └── main.py          # Server FastAPI xử lý API thời tiết & tích hợp Visual Crossing
├── frontend/
│   └── index.html       # Giao diện Dashboard (HTML, CSS Grid/Flexbox, JS Fetch)
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
# Sử dụng Uvicorn với chế độ tự động reload khi sửa code
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
- **Response mẫu (200 OK):**
  ```json
  {
    "city": "hanoi",
    "current": {
      "temp": 29.0,
      "condition": "Clear",
      "humidity": 70.1,
      "precip": 0,
      "uv": 0.0,
      "aqi": 93.0
    }
  }
  ```
- **Lỗi thường gặp:**
  - `400 / 404`: Thành phố không tồn tại hoặc lỗi từ nhà cung cấp API.

---

## 🛠️ Công nghệ sử dụng

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), Requests, Tomllib.
- **Frontend:** Semantic HTML5, Modern CSS (Flexbox & CSS Grid), Vanilla JavaScript (Async/Await, Fetch API).
- **Data Source:** [Visual Crossing Timeline Weather API](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/).
