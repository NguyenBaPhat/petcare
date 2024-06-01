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

  // const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  // const latestData = sortedData.slice(0, MAX_DATA_POINTS).map(item => item.temp);

  // if (temperatureChart) {
  //   temperatureChart.data.datasets[0].data.push(latestData[0]); // Thêm giá trị mới vào cuối mảng dữ liệu
  //   temperatureChart.data.datasets[0].data.shift(); // Loại bỏ giá trị cũ nhất khỏi đầu mảng dữ liệu
  //   temperatureChart.data.labels = temperatureChart.data.labels.map((_, i) => i); // Cập nhật nhãn trục x
  //   temperatureChart.update();
  // }
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



// var ctx = document.getElementById("myPieChart");
// var myPieChart = new Chart(ctx, {
//   type: 'doughnut',
//   data: {
//     labels: ["Direct", "Referral", "Social"],
//     datasets: [{
//       data: [55, 30, 15],
//       backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
//       hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
//       hoverBorderColor: "rgba(234, 236, 244, 1)",
//     }],
//   },
//   options: {
//     maintainAspectRatio: false,
//     tooltips: {
//       backgroundColor: "rgb(255,255,255)",
//       bodyFontColor: "#858796",
//       borderColor: '#dddfeb',
//       borderWidth: 1,
//       xPadding: 15,
//       yPadding: 15,
//       displayColors: false,
//       caretPadding: 10,
//     },
//     legend: {
//       display: false
//     },
//     cutoutPercentage: 80,
//   },
// });


// function renderBehaviorChart(data) {
//   const behaviorCounts = {
//     'sitting': 0,
//     'standing': 0,
//     'lying down': 0,
//     'trotting': 0,
//     'walking': 0,
//     'playing': 0,
//     'treat-searching': 0
//   };

//   // Đếm số lần xuất hiện của mỗi hành vi
//   data.forEach(item => {
//     const behavior = item.behavior.toLowerCase();
//     if (behaviorCounts.hasOwnProperty(behavior)) {
//       behaviorCounts[behavior]++;
//     }
//   });

//   const behaviorLabels = Object.keys(behaviorCounts);
//   const behaviorData = Object.values(behaviorCounts);

//   const ctx = document.getElementById('behaviorChart').getContext('2d');
//   const behaviorChart = new Chart(ctx, {
//     type: 'doughnut',
//     data: {
//       labels: behaviorLabels,
//       datasets: [{
//         data: behaviorData,
//         backgroundColor: [
//           '#4e73df',
//           '#1cc88a',
//           '#36b9cc',
//           '#f6c23e',
//           '#e74a3b',
//           '#858796',
//           '#6610f2'
//         ],
//         hoverBackgroundColor: [
//           '#2e59d9',
//           '#17a673',
//           '#2c9faf',
//           '#f6b820',
//           '#e02d1b',
//           '#6c757d',
//           '#4e08b6'
//         ],
//         hoverBorderColor: 'rgba(234, 236, 244, 1)'
//       }]
//     },
//     options: {
//       maintainAspectRatio: false,
//       tooltips: {
//         backgroundColor: 'rgb(255,255,255)',
//         bodyFontColor: '#858796',
//         borderColor: '#dddfeb',
//         borderWidth: 1,
//         xPadding: 15,
//         yPadding: 15,
//         displayColors: false,
//         caretPadding: 10
//       },
//       legend: {
//         display: true,
//         position: 'bottom'
//       },
//       cutoutPercentage: 80
//     }
//   });
// }

async function updateData() {
  const data = await fetchData();
  temperature(data);
  Batterry(data);
  updateBehavior(data);
  updateHealthStatus(data);
  initMap(data);
  // renderBehaviorChart(data);
}

setInterval(updateData, 1000);
updateData();
