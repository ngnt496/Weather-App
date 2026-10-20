// ===== Biến toàn cục lưu instance của Chart để hủy trước khi vẽ lại =====
let hourlyChartInstance = null;

// ===== Mapping icon từ Visual Crossing sang emoji =====
const iconMap = {
    "snow":                 "❄️",
    "rain":                 "🌧️",
    "fog":                  "🌫️",
    "wind":                 "💨",
    "cloudy":               "☁️",
    "partly-cloudy-day":    "⛅",
    "partly-cloudy-night":  "🌥️",
    "clear-day":            "☀️",
    "clear-night":          "🌙",
    "showers-day":          "🌦️",
    "showers-night":        "🌧️",
    "thunder-rain":         "⛈️",
    "thunder-showers-day":  "⛈️",
    "thunder-showers-night":"⛈️",
};

// ===== Mapping ngày trong tuần sang tiếng Việt =====
const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// ===== Tự động tải lại với LocalStorage khi mở trang web =====
window.onload = function() {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        document.getElementById("city").value = lastCity;
        timThoiTiet();
    }
};

// Hỗ trợ nhấn Enter trong ô tìm kiếm
document.getElementById("city").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        timThoiTiet();
    }
});

// Hàm xóa dữ liệu cũ khi gặp lỗi để tránh gây nhầm lẫn
function xoaDuLieuCu() {
    const weatherContent = document.getElementById("weather-content");
    if (weatherContent) {
        weatherContent.style.display = "none";
    }
    if (hourlyChartInstance) {
        hourlyChartInstance.destroy();
        hourlyChartInstance = null;
    }
    const forecastList = document.getElementById("forecast-list");
    if (forecastList) {
        forecastList.innerHTML = "";
    }
}

async function timThoiTiet() {
    let tenThanhPho = document.getElementById("city").value.trim();
    if (!tenThanhPho) {
        alert("Vui lòng nhập tên thành phố!");
        return;
    }

    const loadingEl = document.getElementById("loading");
    const errorEl = document.getElementById("error-message");
    const weatherContent = document.getElementById("weather-content");

    // Hiển thị Loading, ẩn lỗi cũ
    loadingEl.style.display = "block";
    errorEl.style.display = "none";

    try {
        let response = await fetch("http://localhost:8000/weather/" + encodeURIComponent(tenThanhPho));
        
        // Bắt mã lỗi 404 (hoặc response không thành công)
        if (response.status === 404 || !response.ok) {
            throw new Error("Không tìm thấy dữ liệu cho thành phố này");
        }

        let data = await response.json();

        // Lưu thành phố hợp lệ vừa tìm vào LocalStorage
        localStorage.setItem("lastCity", tenThanhPho);

        // Hiển thị khung dữ liệu thời tiết
        weatherContent.style.display = "flex";

        // ===== 1. Cập nhật phần Tổng quan =====
        document.getElementById("city-name").innerText = data.city;
        document.getElementById("temp").innerText = data.current.temp ?? "--";
        document.getElementById("condition").innerText = data.current.condition ?? "--";

        // ===== 2. Cập nhật lưới 4 chỉ số =====
        document.getElementById("humidity").innerText = data.current.humidity ?? "--";
        document.getElementById("precip").innerText = data.current.precip ?? 0;
        document.getElementById("uv").innerText = data.current.uv ?? "--";
        document.getElementById("aqi").innerText = data.current.aqi ?? "N/A";

        // ===== 3. Vẽ biểu đồ nhiệt độ theo giờ =====
        veDoThiTheoGio(data.hours);

        // ===== 4. Render danh sách dự báo 7 ngày =====
        renderDuBao7Ngay(data.days);

    } catch (error) {
        // Hiển thị thông báo màu đỏ mờ
        errorEl.innerText = error.message || "Không tìm thấy dữ liệu cho thành phố này";
        errorEl.style.display = "block";

        // Xóa sạch bảng dữ liệu cũ
        xoaDuLieuCu();
    } finally {
        loadingEl.style.display = "none";
    }
}

/**
 * Hàm vẽ biểu đồ đường (Line Chart) bằng Chart.js
 * Nhận mảng hours, tách thành 2 mảng nhỏ:
 *   - labels: mảng các mốc giờ (trục X)
 *   - temps:  mảng các nhiệt độ (trục Y)
 */
function veDoThiTheoGio(hours) {
    const labels = hours.map(h => h.time);
    const temps  = hours.map(h => h.temp);

    if (hourlyChartInstance) {
        hourlyChartInstance.destroy();
    }

    const ctx = document.getElementById("hourlyChart").getContext("2d");

    hourlyChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Nhiệt độ (°C)",
                data: temps,
                borderColor: "#0284c7",
                backgroundColor: "rgba(2, 132, 199, 0.1)",
                borderWidth: 2.5,
                pointRadius: 3,
                pointBackgroundColor: "#0284c7",
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            return ctx.parsed.y + "°C";
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 11 },
                        maxTicksLimit: 12,
                        color: "#64748b"
                    }
                },
                y: {
                    grid: { color: "#f1f5f9" },
                    ticks: {
                        font: { size: 11 },
                        color: "#64748b",
                        callback: function(value) {
                            return value + "°";
                        }
                    }
                }
            }
        }
    });
}

/**
 * Hàm render danh sách dự báo 7 ngày
 */
function renderDuBao7Ngay(days) {
    const container = document.getElementById("forecast-list");
    container.innerHTML = "";

    days.forEach(function(day) {
        const dateObj = new Date(day.date + "T00:00:00");
        const thuTrongTuan = dayNames[dateObj.getDay()];
        const ngayThang = dateObj.getDate() + "/" + (dateObj.getMonth() + 1);

        const emoji = iconMap[day.icon] || "🌡️";

        const card = document.createElement("div");
        card.className = "forecast-card";

        const dayDiv = document.createElement("div");
        dayDiv.className = "forecast-day";
        const dayNameEl = document.createElement("div");
        dayNameEl.className = "day-name";
        dayNameEl.textContent = thuTrongTuan;
        const dayDateEl = document.createElement("div");
        dayDateEl.className = "day-date";
        dayDateEl.textContent = ngayThang;
        dayDiv.appendChild(dayNameEl);
        dayDiv.appendChild(dayDateEl);

        const iconDiv = document.createElement("div");
        iconDiv.className = "forecast-icon";
        iconDiv.textContent = emoji;

        const condDiv = document.createElement("div");
        condDiv.className = "forecast-condition";
        condDiv.textContent = day.condition;

        const tempDiv = document.createElement("div");
        tempDiv.className = "forecast-temps";
        tempDiv.innerHTML =
            '<span class="temp-high">' + Math.round(day.tempmax) + '°</span>' +
            '<span class="temp-sep">/</span>' +
            '<span class="temp-low">' + Math.round(day.tempmin) + '°</span>';

        card.appendChild(dayDiv);
        card.appendChild(iconDiv);
        card.appendChild(condDiv);
        card.appendChild(tempDiv);

        container.appendChild(card);
    });
}

