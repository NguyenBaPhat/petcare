

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';



async function fetchData() {
  const response = await fetch('https://wfyo32vatc.execute-api.ap-southeast-2.amazonaws.com/database/get_database');
  const data = await response.json();
  return data;
}

function temperaturedraw(data) {

    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latestData = sortedData.slice(0, MAX_DATA_POINTS).map(item => item.temp);
  
    if (temperatureChart) {
      temperatureChart.data.datasets[0].data.push(latestData[0]); // Thêm giá trị mới vào cuối mảng dữ liệu
      temperatureChart.data.datasets[0].data.shift(); // Loại bỏ giá trị cũ nhất khỏi đầu mảng dữ liệu
      temperatureChart.data.labels = temperatureChart.data.labels.map((_, i) => i); // Cập nhật nhãn trục x
      temperatureChart.update();
    }
  }

const MAX_DATA_POINTS = 20;
let temperatureChart; // Khai báo biến toàn cục để lưu trữ biểu đồ

document.addEventListener('DOMContentLoaded', () => {
  const temperatureChartElement = document.getElementById('temperatureChart');
  if (temperatureChartElement) {
    const ctx = temperatureChartElement.getContext('2d');
    initChart(ctx);
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


function renderBehaviorChart(data) {
  const behaviorCounts = {
    'sitting': 0,
    'standing': 0,
    'lying down': 0,
    'trotting': 0,
    'walking': 0,
    'playing': 0,
    'treat-searching': 0
  };

  // Đếm số lần xuất hiện của mỗi hành vi
  data.forEach(item => {
    const behavior = item.behavior.toLowerCase();
    if (behaviorCounts.hasOwnProperty(behavior)) {
      behaviorCounts[behavior]++;
    }
  });

  const behaviorLabels = Object.keys(behaviorCounts);
  const behaviorData = Object.values(behaviorCounts);

  const ctx = document.getElementById('behaviorChart').getContext('2d');
  const behaviorChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: behaviorLabels,
      datasets: [{
        data: behaviorData,
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
          '#e74a3b',
          '#858796',
          '#6610f2'
        ],
        hoverBackgroundColor: [
          '#2e59d9',
          '#17a673',
          '#2c9faf',
          '#f6b820',
          '#e02d1b',
          '#6c757d',
          '#4e08b6'
        ],
        hoverBorderColor: 'rgba(234, 236, 244, 1)'
      }]
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgb(255,255,255)',
        bodyFontColor: '#858796',
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      cutoutPercentage: 80
    }
  });
}


function renderHealthCalendar(data) {
  const calendarEl = document.getElementById('calendar');
  const calendarContainer = calendarEl.parentNode;

  // Xóa chú thích màu cũ nếu có
  const existingLegend = calendarContainer.querySelector('.health-legend');
  if (existingLegend) {
    calendarContainer.removeChild(existingLegend);
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: [],
    dateClick: function(info) {
      console.log('Clicked on: ' + info.dateStr);
    },
    height: 300, // Đặt chiều cao của lịch
    eventContent: function(arg) {
      let arrayOfDomNodes = [];
      let titleElement = document.createElement('div');
      titleElement.classList.add('fc-event-title');
      titleElement.style.fontSize = '12px'; // Đặt cỡ chữ cho tiêu đề sự kiện (ngày trên lịch)
      titleElement.innerText = arg.event.title;
      arrayOfDomNodes.push(titleElement);
      return { domNodes: arrayOfDomNodes };
    }
  });
  calendar.render();

  const eventData = [];
  const healthCounts = {};

  data.forEach(item => {
    const itemDate = new Date(item.timestamp);
    const dateStr = itemDate.toISOString().split('T')[0];
    const health = item.health;

    if (!healthCounts[dateStr]) {
      healthCounts[dateStr] = {
        'Good': 0,
        'Normal': 0,
        'Bad': 0
      };
    }

    healthCounts[dateStr][health]++;
  });

  for (const date in healthCounts) {
    const counts = healthCounts[date];
    const maxHealth = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const color = maxHealth === 'Good' ? 'green' : maxHealth === 'Normal' ? 'yellow' : 'red';

    eventData.push({
      title: '',
      start: date,
      color: color
    });
  }

  calendar.removeAllEvents();
  calendar.addEventSource(eventData);

  // Tạo phần tử chú thích màu
  const legendContainer = document.createElement('div');
  legendContainer.classList.add('health-legend');
  legendContainer.style.marginTop = '20px'; // Dịch chuyển chú thích xuống dưới

  const legendCanvas = document.createElement('canvas');
  const ctx = legendCanvas.getContext('2d');
  const healthColors = [
    { color: 'green', label: 'Good' },
    { color: 'yellow', label: 'Normal' },
    { color: 'red', label: 'Bad' }
  ];

  // Thiết lập kích thước của canvas
  const legendWidth = 300;
  const legendHeight = 50;
  const radius = 10;
  const spacing = 30; // Tăng khoảng cách giữa hình tròn và nhãn văn bản
  const fontSize = 16;
  legendCanvas.width = legendWidth;
  legendCanvas.height = legendHeight;

  // Vẽ chú thích màu lên canvas
  let x = radius + spacing;
  ctx.font = `${fontSize}px Arial`;
  healthColors.forEach(({ color, label }) => {
    ctx.beginPath();
    ctx.arc(x, legendHeight / 2, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + radius*2, legendHeight / 2);
    x += radius * 2 + spacing*1.2 + ctx.measureText(label).width;
  });

  legendContainer.appendChild(legendCanvas);
  calendarContainer.appendChild(legendContainer);
}
async function fetchAndUpdateDatatemp() {
    const data = await fetchData();
    temperaturedraw(data);
  }
  async function fetchAndUpdateDatabehavior() {
    const data = await fetchData();
    renderBehaviorChart(data);
    renderHealthCalendar(data);
  }
  
setInterval(fetchAndUpdateDatatemp, 1000); // Cập nhật dữ liệu mỗi 1000ms
setInterval(fetchAndUpdateDatabehavior, 600000); // Cập nhật dữ liệu mỗi 10000ms
fetchAndUpdateDatatemp(); // Cập nhật dữ liệu lần đầu tiên
fetchAndUpdateDatabehavior();