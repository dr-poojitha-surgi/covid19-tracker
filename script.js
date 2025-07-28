const countrySelector = document.getElementById('countrySelector');
const casesSpan = document.getElementById('cases');
const recoveredSpan = document.getElementById('recovered');
const deathsSpan = document.getElementById('deaths');
const ctx = document.getElementById('covidChart').getContext('2d');

let covidChart;

async function fetchCountries() {
  const res = await fetch('https://disease.sh/v3/covid-19/countries');
  const countries = await res.json();
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.country;
    option.text = country.country;
    countrySelector.appendChild(option);
  });
}

async function fetchData(country) {
  const res = await fetch(`https://disease.sh/v3/covid-19/countries/${country}`);
  const data = await res.json();
  updateStats(data);
  updateChart(data);
}

function updateStats(data) {
  casesSpan.textContent = data.cases.toLocaleString();
  recoveredSpan.textContent = data.recovered.toLocaleString();
  deathsSpan.textContent = data.deaths.toLocaleString();
}

function updateChart(data) {
  const chartData = {
    labels: ['Cases', 'Recovered', 'Deaths'],
    datasets: [{
      label: 'COVID-19 Stats',
      data: [data.cases, data.recovered, data.deaths],
      backgroundColor: ['#f39c12', '#27ae60', '#c0392b']
    }]
  };

  if (covidChart) {
    covidChart.destroy();
  }

  covidChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

countrySelector.addEventListener('change', () => {
  fetchData(countrySelector.value);
});

// Initial load
fetchCountries().then(() => {
  countrySelector.value = 'India'; // default country
  fetchData('India');
});
