

// // Set new default font family and font color to mimic Bootstrap's default styling
// Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = '#858796';

// const MAX_DATA_POINTS = 20; // Số lượng điểm dữ liệu tối đa trên đồ thị

// async function fetchData() {
//   const response = await fetch('https://wfyo32vatc.execute-api.ap-southeast-2.amazonaws.com/database/get_database');
//   const data = await response.json();
//   return data;
// }

// let temperatureChart; // Khai báo biến toàn cục để lưu trữ biểu đồ

// document.addEventListener('DOMContentLoaded', () => {
//   const temperatureChartElement = document.getElementById('temperatureChart');
//   if (temperatureChartElement) {
//     const ctx = temperatureChartElement.getContext('2d');
//     initChart(ctx);
//   } else {
//     console.error("Phần tử HTML với id 'temperatureChart' không tồn tại");
//   }
// });

// function initChart(ctx) {
//   temperatureChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: Array.from({ length: MAX_DATA_POINTS }, (_, i) => i),
//       datasets: [{
//         label: 'Temperature',
//         data: new Array(MAX_DATA_POINTS).fill(null),
//         borderColor: 'rgba(0, 92, 185, 1)',
//         backgroundColor: 'rgba(0, 0, 0, 0)', // Không có màu nền
//         borderWidth: 2.5
//       }]
//     },
//     options: {
//       maintainAspectRatio: false, // Cho phép biểu đồ thay đổi kích thước
//       height: 300, // Chiều cao của biểu đồ
//       legend: {
//         display: false // Ẩn chú thích đồ thị
//       },
//       scales: {
//         xAxes: [{
//           ticks: {
//             display: false
//           }
//         }]
//       },
//       animation: {
//         duration: 0 // Tắt hiệu ứng hoạt hình để cập nhật dữ liệu nhanh hơn
//       }
//     }
//   });
// }

// function updateChart(data) {
//   const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//   const latestData = sortedData.slice(0, MAX_DATA_POINTS).map(item => item.temp);

//   if (temperatureChart) {
//     temperatureChart.data.datasets[0].data.push(latestData[0]); // Thêm giá trị mới vào cuối mảng dữ liệu
//     temperatureChart.data.datasets[0].data.shift(); // Loại bỏ giá trị cũ nhất khỏi đầu mảng dữ liệu
//     temperatureChart.data.labels = temperatureChart.data.labels.map((_, i) => i); // Cập nhật nhãn trục x
//     temperatureChart.update();
//   }
// }

// async function fetchAndUpdateData() {
//   const data = await fetchData();
//   updateChart(data);
// }

// setInterval(fetchAndUpdateData, 500); // Cập nhật dữ liệu mỗi 500ms
// fetchAndUpdateData(); // Cập nhật dữ liệu lần đầu tiên