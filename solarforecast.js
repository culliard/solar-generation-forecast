
function drawChart(type, name, units, values) {
    
    let labels = [];
    let solarGeneration = [];

    data = eval(values)
    for (var key in data) {
        labels.push(key);
        solarGeneration.push(data[key]);
    }

    let ctx = document.getElementById(`${name}`).getContext('2d'); // 2d context

    var chart = new Chart(ctx, {
        type: `${type}`,
        data: {
            labels: labels,
            datasets: [{
                label: `Solar Generation (${units})`,
                data: solarGeneration,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)"
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}




function getSolarEstimations(lat, long, declination, azimuth, inverter_peak) {
    // Use the fetch() method to retrieve solar generation data
    fetch(`https://api.forecast.solar/estimate/${lat}/${long}/${declination}/${azimuth}/${inverter_peak}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {

        msg = eval(response.message)
        document.getElementById('place').insertAdjacentText('beforeEnd', msg.info.place);
        document.getElementById('timezone').insertAdjacentText('beforeEnd', msg.info.timezone);
        document.getElementById('time').insertAdjacentText('beforeEnd', msg.info.time);

        drawChart('line', 'watts', 'kW', response.result.watts);
        drawChart('line', 'wattHours', 'kWh', response.result.watt_hours);
        drawChart('bar', 'wattHoursDay', 'kWh', response.result.watt_hours_day);
    });
}

function calculate() {
    
    let lat = document.getElementById('lat').value;
    let long = document.getElementById('long').value;
    let declination = document.getElementById('declination').value;
    let azimuth = document.getElementById('azimuth').value;
    let inverter_peak = document.getElementById('peak_power').value;
    
    // Check for empty values and use defaults
    if (lat == '') 
        lat = 54;
    if (long == '')
        long = -6;

    localStorage['lat'] = lat;
    localStorage['long'] = long;
    localStorage['declination'] = declination;
    localStorage['azimuth'] = azimuth;
    localStorage['peak_power'] = inverter_peak;

    getSolarEstimations(lat, long, declination, azimuth, inverter_peak);
    //"https://api.forecast.solar/estimate/54.519859/-6.272860/30/45/5.32
}

const btn = document.getElementById('forecast');
btn.addEventListener("click", calculate);

// Set defaults
DEFAULT_LAT = 54.596391;
DEFAULT_LONG = -5.930183;
DEFAULT_DECLIN = 35;
DEFAULT_AZIMUTH = 0;   // south
DEFAULT_POWER = 4;      //kW

document.getElementById("lat").value = localStorage['lat'] || DEFAULT_LAT;
document.getElementById("long").value = localStorage['long'] || DEFAULT_LONG;
document.getElementById("declination").value = localStorage['declination'] || DEFAULT_DECLIN;
document.getElementById("azimuth").value = localStorage['azimuth'] || DEFAULT_AZIMUTH;
document.getElementById("peak_power").value = localStorage['peak_power'] || DEFAULT_POWER;

calculate()
