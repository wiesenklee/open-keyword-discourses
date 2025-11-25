import Chart, { ChartItem } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

import bpk from 'url:./bpk.json'

(async function () {

  const response = await fetch(bpk);
  const json = await response.json();

  const startKeywords = ["migration", "ausländer", "asyl", "einwanderung", "abschiebung", "rückführung"]

  var chart = new Chart(
    document.getElementById('chart') as ChartItem,
    {
      type: 'bar',
      data: {
        labels: json.data.map((row: any) => row['date_y-m']),
        datasets: [
          {
            label: 'Total Words',
            data: json.data.map((row: any) => row['transcript_words']),
            hidden: true
          },
          ...startKeywords.map((k) => {
            return {
              label: k,
              data: json.data.map((row: any) => row.transcript.matchAll(new RegExp(k, "gi")).toArray().length)
            }
          })
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: "MMMM yyyy",
            },
            stacked: true,
          },
          y: {
            stacked: true,
          },

        },
        plugins: {
          colors: {
            forceOverride: true
          },
        },
      }
    }
  );

  var keywordButton = document.getElementById("keyword-button");
  var removeKeywordButton = document.getElementById("remove-keyword-button");
  var keywordInput = document.getElementById("keyword-input") as HTMLInputElement;
  keywordButton?.addEventListener("click", (_) => {
    var keyword = keywordInput.value;
    var countData: Array<Number> = [];
    if (keyword.length < 3) return;
    json.data.forEach((d: any) => {
      countData.push(d.transcript.matchAll(new RegExp(keyword, "gi")).toArray().length)
    });
    chart.data.datasets.push({ label: `${keyword} count`, data: countData });
    chart.update();
  });
  removeKeywordButton?.addEventListener("click", (_) => {
    chart.data.datasets.pop();
    chart.update();
  })
})();
