const weatherAPIKey = "cbc459eb8ce0c5e043e61c38f8610797";
const weatherBaseURL = "https://api.openweathermap.org/data/2.5";

async function fetchAPIWeather(lat, lon) {
    const currentUrl = `${weatherBaseURL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
    const forecastUrl = `${weatherBaseURL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
    const airUrl = `${weatherBaseURL}/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`;

    const [currentRes, forecastRes, airRes] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl),
        fetch(airUrl)
    ]);

    /*
    fetch (url) is a function that immediately returns a Promise (of a response)

    That Promise will either resolve to a RESPONSE or a REJECT, but it doesnt
    know the value when its called.

    Response examples: json, status codes
    Reject examples: network failure

    pending -> resolved | rejected

*/
    if (!currentRes.ok || !forecastRes.ok || !airRes.ok) {
        throw new Error(
            "Weather/forecast/air API error: " +
            currentRes.status + " / " +
            forecastRes.status + " / " +
            airRes.status
        );
    }

    const currentJson = await currentRes.json();
    const forecastJson = await forecastRes.json();
    const airJson = await airRes.json();

    let aqiIndex = null;
    let aqiLabel = "N/A";

    if (airJson.list && airJson.list[0] && airJson.list[0].main && airJson.list[0].main.aqi) {
        aqiIndex = airJson.list[0].main.aqi;
        aqiLabel = mapAQILabel(aqiIndex);
    }

    const apiData = {
    locationLabel: `${currentJson.name} · Today`,
    favoriteLocation: {
        city: currentJson.name,
        country: currentJson.sys?.country || "Unknown",
        lat: currentJson.coord?.lat ?? lat,
        lon: currentJson.coord?.lon ?? lon
    },
    current: {
        icon: weatherIcons(currentJson.weather[0].icon),
        summary: currentJson.weather[0].description,
        tempC: Math.round(currentJson.main.temp),
        humidity: currentJson.main.humidity,
        aqi: aqiIndex !== null ? aqiIndex : 0,
        aqiLabel: aqiLabel,
        precipChance: 0
    },
    hourly: forecastBuilding(forecastJson.list, aqiIndex, aqiLabel)
};

    return apiData;
}


function weatherIcons(iconCode) {
   
    if (iconCode.startsWith("01")) return "☀️"; 
    if (iconCode.startsWith("02")) return "🌤️"; 
    if (iconCode.startsWith("03")) return "☁️";
    if (iconCode.startsWith("04")) return "☁️"; 
    if (iconCode.startsWith("09")) return "🌧️"; 
    if (iconCode.startsWith("10")) return "🌦️"; 
    if (iconCode.startsWith("11")) return "⛈️"; 
    if (iconCode.startsWith("13")) return "❄️"; 
    if (iconCode.startsWith("50")) return "🌫️"; 
    return "🌡️";
}

function mapAQILabel(aqiIndex) {
    switch (aqiIndex) {
        case 1: return "Good";
        case 2: return "Fair";
        case 3: return "Moderate";
        case 4: return "Poor";
        case 5: return "Very Poor";
        default: return "N/A";
    }
}

function forecastBuilding(list, aqiIndex, aqiLabel) {
    if (!Array.isArray(list)) return [];

    const firstSix = list.slice(0, 6);

    return firstSix.map((item) => {
        const timeMs = item.dt * 1000; 

        const weather = item.weather && item.weather[0]
            ? item.weather[0]
            : { description: "N/A", icon: "" };

        const hasRain = !!item.rain || !!item.snow;

        let precipChance = 0;
        if (hasRain) {
            precipChance = 60;
        } else {
            precipChance = 10;
        }

        return {
            timeMs: timeMs,                           
            summary: weather.description,
            icon: weatherIcons(weather.icon),
            tempC: Math.round(item.main.temp),
            humidity: item.main.humidity,
            aqi: aqiIndex != null ? aqiIndex : 0,
            aqiLabel: aqiLabel || "N/A",
            precipChance: precipChance
        };
    });
}


function loadByLocation() {
    return new Promise((resolve, reject) => {

        if (!("geolocation" in navigator)) {
            reject(new Error("Error in geolocation!"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const latitude = pos.coords.latitude;
                    const longitude = pos.coords.longitude;

                    const liveData = await fetchAPIWeather(latitude, longitude);
                    resolve(liveData);
                } catch (err) {
                    reject(err);
                }
            },
            (error) => {
              
                reject(error);
            },
            { timeout: 10000 }
        );
    });
}/* reflist for later


https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
https://openweathermap.org/api/one-call-3#current
https://www.w3schools.com/html/html5_geolocation.asp
*/

