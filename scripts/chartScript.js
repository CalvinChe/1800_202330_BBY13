// // for line chart
// const lineCtx = document.getElementById("lineChart").getContext('2d');
// const lineChart = new Chart(lineCtx, {
//     type: 'line',
//     data: {
//         labels: ["sunday", "monday", "tuesday",
//             "wednesday", "thursday", "friday", "saturday"],
//         datasets: [{
//             label: 'Last week',
//             backgroundColor: 'rgba(161, 198, 247, 1)',
//             borderColor: 'rgb(47, 128, 237)',
//             data: [3000, 4000, 2000, 5000, 8000, 9000, 2000],
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true,
//                 }
//             }]
//         }
//     },
// });

//doughnut chart
const douCtx = document.getElementById("douChart").getContext('2d');
const douChart = new Chart(douCtx, {
    type: 'doughnut',
    data: {
        labels: ["rice", "yam", "tomato", "potato", "beans",
            "maize", "oil"],
        datasets: [{
            label: 'food Items',
            data: [30, 40, 20, 50, 80, 90, 20],
            backgroundColor: ["#0074D9", "#FF4136", "#2ECC40",
                "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00",
                "#001f3f", "#39CCCC", "#01FF70", "#85144b",
                "#F012BE", "#3D9970", "#111111", "#AAAAAA"]
        }]
    },
});

const barCtx = document.getElementById('barChart');

new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ['Daily', 'Monthly', 'Yearly'],
    datasets: [{
      label: 'Progress',
      data: [0.2, 0.8, 0.5, 1.0],
      borderWidth: 1
    }]
  },
  options: {
    indexAxis: 'y',
  }
});