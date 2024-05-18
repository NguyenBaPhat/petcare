// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

async function fetchData() {
  const response = await fetch('https://wfyo32vatc.execute-api.ap-southeast-2.amazonaws.com/database/get_database');
  const data = await response.json();
  return data;
}

function getLatestValueByTimestamp(data, key) {
  if (Array.isArray(data)) {
    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latestItem = sortedData[0];
    return latestItem[key];
  } else {
    // Xử lý trường hợp data không phải là mảng
    return null; // hoặc giá trị mặc định khác
  }
}

let map; 
function initMap(data) {
  const latestLat = getLatestValueByTimestamp(data, 'lat');
  const latestLong = getLatestValueByTimestamp(data, 'long');
  const latLng = [latestLat, latestLong];
  const currentLocation = `Latitude: ${latestLat}, Longitude: ${latestLong}`;

  // Kiểm tra nếu map đã được khởi tạo
  if (!map) {
    map = L.map('map').setView(latLng, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: currentLocation,
      maxZoom: 18,
    }).addTo(map);
  } else {
    // Nếu map đã được khởi tạo, chỉ cần cập nhật vị trí mới
    // map.setView(latLng, 13);
  }

  L.marker(latLng).addTo(map);
}

function temperature(data) {
  const latestTemperature = getLatestValueByTimestamp(data, 'temp');
  const TemperatureContentElement = document.getElementById('temperature-content');
  if (TemperatureContentElement !== null) {
    TemperatureContentElement.textContent = latestTemperature;
  }

  const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestData = sortedData.slice(0, MAX_DATA_POINTS).map(item => item.temp);

  if (temperatureChart) {
    temperatureChart.data.datasets[0].data.push(latestData[0]); // Thêm giá trị mới vào cuối mảng dữ liệu
    temperatureChart.data.datasets[0].data.shift(); // Loại bỏ giá trị cũ nhất khỏi đầu mảng dữ liệu
    temperatureChart.data.labels = temperatureChart.data.labels.map((_, i) => i); // Cập nhật nhãn trục x
    temperatureChart.update();
  }
}

function updateBehavior(data) {
  const latestBehavior = getLatestValueByTimestamp(data, 'behavior');
  const behaviorContentElement = document.getElementById('behavior-content');
  behaviorContentElement.textContent = latestBehavior;
}

function updateHealthStatus(data) {
  const latestHealth = getLatestValueByTimestamp(data, 'health');
  const HealthContentElement = document.getElementById('health-content');
  HealthContentElement.textContent = latestHealth;
  HealthContentElement.classList.remove('good', 'normal', 'bad');
  // Thêm lớp màu mới tùy theo giá trị của latestHealth
  if (latestHealth.toLowerCase() === 'good') {
    HealthContentElement.classList.add('good');
  } else if (latestHealth.toLowerCase() === 'normal') {
    HealthContentElement.classList.add('normal');
  } else {
    HealthContentElement.classList.add('bad');
  }
}

function Batterry(data) {
  const latestbatterry = getLatestValueByTimestamp(data, 'batterry');
  const batterryContentElement = document.getElementById('batterry-content');
  batterryContentElement.textContent = latestbatterry;
  
  const acidFillElement = document.querySelector('.acid .fill');
  const acidHeight = (latestbatterry / 100) * 250; // Chiều cao tối đa của cục pin là 250px
  acidFillElement.style.setProperty('--acid-height', `${acidHeight}px`);
  const chargingIcon = document.querySelector('.percentage i');
  chargingIcon.style.setProperty('--display-charging', latestbatterry < 100 ? 'inline' : 'none');

  const batteryElement = document.querySelector('.battery');

  if (latestbatterry < 20) {
    acidFillElement.classList.add('full-low-battery');
    batteryElement.classList.add('low-battery');
  } else {
    acidFillElement.classList.remove('full-low-battery');
    batteryElement.classList.remove('low-battery');
  }
}
const MAX_DATA_POINTS = 20;
let temperatureChart; // Khai báo biến toàn cục để lưu trữ biểu đồ

document.addEventListener('DOMContentLoaded', () => {
  const temperatureChartElement = document.getElementById('temperatureChart');
  if (temperatureChartElement) {
    const ctx = temperatureChartElement.getContext('2d');
    initChart(ctx);
  } else {
    console.error("Phần tử HTML với id 'temperatureChart' không tồn tại");
  }
});

function initChart(ctx) {
  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: MAX_DATA_POINTS }, (_, i) => i),
      datasets: [{
        label: 'Temperature',
        data: new Array(MAX_DATA_POINTS).fill(null),
        borderColor: 'rgba(0, 92, 185, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0)', // Không có màu nền
        borderWidth: 2.5
      }]
    },
    options: {
      maintainAspectRatio: false, // Cho phép biểu đồ thay đổi kích thước
      height: 300, // Chiều cao của biểu đồ
      legend: {
        display: false // Ẩn chú thích đồ thị
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false
          }
        }]
      },
      animation: {
        duration: 0 // Tắt hiệu ứng hoạt hình để cập nhật dữ liệu nhanh hơn
      }
    }
  });
}


async function updateData() {
  const data = await fetchData();
  temperature(data);
  Batterry(data);
  updateBehavior(data);
  updateHealthStatus(data);
  initMap(data);
}

setInterval(updateData, 1000);
updateData();
