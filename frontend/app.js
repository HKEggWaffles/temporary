let currentWeatherData = null;
let usingOfflineData = false;

document.addEventListener("DOMContentLoaded", async () => {
 
    initialSettings();
    controlSettings();


    const manualLongLat = document.getElementById("load-location");
    if (manualLongLat) {
        manualLongLat.addEventListener("click", async () => {
            const latInput = document.getElementById("lat-input");
            const lonInput = document.getElementById("lon-input");

            const lat = parseFloat(latInput.value);
            const lon = parseFloat(lonInput.value);

            if (Number.isNaN(lat) || Number.isNaN(lon)) {
                alert("Please enter valid numbers for both latitude and longitude!");
                return;
            }

            try {
                const manualData = await fetchAPIWeather(lat, lon);
setCurrentDisplayedLocation(manualData.favoriteLocation);

currentWeatherData = manualData;
                usingOfflineData = false;

                renderConditions(currentWeatherData);
                renderForecast(currentWeatherData);
                renderForecastBlobs(currentWeatherData);

                saveSnapshot(currentWeatherData);
            } catch (err) {
                const summaryEl = document.getElementById("current-summary");
                if (summaryEl) {
                    summaryEl.textContent = "Unable to load weather for location :(";
                }
            }
        });
    }
    const summary = document.getElementById("current-summary");

    try {
        const liveData = await loadByLocation();
        setCurrentDisplayedLocation(liveData.favoriteLocation);
        currentWeatherData = liveData;
        usingOfflineData = false;

        renderConditions(currentWeatherData);
        renderForecast(currentWeatherData);
        renderForecastBlobs(currentWeatherData);

        saveSnapshot(currentWeatherData);
    } catch (error) {
        console.error("Error loading live weather data:", error);
        const storedWrapper = loadSnapshot();

        if (storedWrapper && storedWrapper.data) {
            currentWeatherData = storedWrapper.data;
            usingOfflineData = true;

            renderConditions(currentWeatherData);
            renderForecast(currentWeatherData);
            renderForecastBlobs(currentWeatherData);

            if (summary) {
                summary.textContent += " (showing saved offline data!)";
            }
        } else {
            if (summary) {
                summary.textContent = "Unable to display weather data :(";
            }
        }
    }
});


