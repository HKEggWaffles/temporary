let isCelsius = true;

function formatTemp(tempCel) {
    let output;

    if (isCelsius === true) {
        output = Math.round(tempCel) + "\u00B0C";
    } else {
        const tempF = tempCel * 9 / 5 + 32;
        output = Math.round(tempF) + "\u00B0F";
    }

    return output;
}


function formatTime(timeMsOrString) {
  
    if (typeof timeMsOrString === "number") {
        return new Date(timeMsOrString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: !is24Hour  
        });
    }

    if (typeof timeMsOrString === "string") {
        return timeMsOrString;
    }

    return "";
}

function renderConditions(weatherData) {


    const currentConditions = weatherData.current;

    const icon = document.getElementById("current-icon");
    const summary = document.getElementById("current-summary");
    const location = document.getElementById("current-location");
    const temp = document.getElementById("current-temp");
    const humidity = document.getElementById("current-humidity");
    const aqi = document.getElementById("current-aqi");
    const precip = document.getElementById("current-precip");

    icon.textContent = currentConditions.icon;
    summary.textContent = currentConditions.summary;
    location.textContent = weatherData.locationLabel;
    temp.textContent = formatTemp(currentConditions.tempC);
    humidity.textContent = currentConditions.humidity + "%";
    aqi.textContent = currentConditions.aqi + " - " + currentConditions.aqiLabel;
    precip.textContent = currentConditions.precipChance + "%";

}

function renderForecast(weatherData) {

    const forecastBox = document.getElementById("forecast-grid");
    forecastBox.innerHTML = "";

    const forecastHours = weatherData.hourly;

    forecastHours.forEach((hour) => {
        const card = document.createElement("article");
        card.className = "forecast-card";

        card.innerHTML = `
            <div class="forecast-card__header">
                <div>
                   <div class="forecast-card__time">
                    ${formatTime(hour.timeMs || hour.time)}
                    </div>
                    <div class="forecast-card__summary">${hour.summary}</div>
                </div>
                <span class="forecast-card__icon" aria-hidden="true">
                    ${hour.icon}
                </span>
            </div>

            <div class="forecast-card__values">
                <div>
                    <div><strong>Temp</strong> ${formatTemp(hour.tempC)}</div>
                    <div><strong>Humidity</strong> ${hour.humidity}%</div>
                </div>
                <div>
                    <div><strong>AQI</strong> ${hour.aqi}</div>
                    <div>${hour.aqiLabel}</div>
                </div>
            </div>
        `;

        forecastBox.appendChild(card);
    });


}

function renderForecastBlobs(weatherData) {
    const container = document.getElementById("insights-list");
    if (!container || !weatherData || !Array.isArray(weatherData.hourly)) {
        return;
    }

    const hours = weatherData.hourly;
    const insights = [];

  
    const warmest = findWarmestHour(hours);
    if (warmest) {
        insights.push(
            `Warmest period around ${formatTime(warmest.timeMs || warmest.time)}, reaching about ${formatTemp(warmest.tempC)}.`
        );
    }

 
    const wettest = findWettestHour(hours);
    if (wettest && wettest.precipChance >= 40) {
        insights.push(
            `Heaviest rain expected near ${formatTime(wettest.timeMs || wettest.time)}, with a ${wettest.precipChance}% chance of precipitation.`
        );
    }


    const allHumid = hours.every((h) => h.humidity >= 70);
    if (allHumid) {
        insights.push(
            `Humidity stays high (above 70%) throughout the forecast period.`
        );
    }

   
    if (insights.length === 0) {
        insights.push(
            `No major changes expected; conditions stay fairly stable over the next several hours.`
        );
    }


    container.innerHTML = insights
        .map(
            (text) => `
        <article class="card">
            <p>${text}</p>
        </article>
    `
        )
        .join("");
}

function findWarmestHour(hours) {
    if (!hours || hours.length === 0) return null;

    let warmest = hours[0];

    for (let i = 1; i < hours.length; i++) {
        const hour = hours[i];
        if (hour.tempC > warmest.tempC) {
            warmest = hour;
        }
    }

    return warmest;
}

function findWettestHour(hours) {
    if (!hours || hours.length === 0) return null;

    let wettest = hours[0];

    for (let i = 1; i < hours.length; i++) {
        const hour = hours[i];
        if (hour.precipChance > wettest.precipChance) {
            wettest = hour;
        }
    }

    return wettest;
}
