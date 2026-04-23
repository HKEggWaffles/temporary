
const weatherSnapshotData = "last-weather-snapshot";


function saveSnapshot(weatherData) {
    if (!weatherData) return;

    const dataWrapped = {
        savedAt: Date.now(),
        data: weatherData
    };

    const weatherString = JSON.stringify(dataWrapped);
    localStorage.setItem(weatherSnapshotData, weatherString);
}

function loadSnapshot() {
    const fetchedData = localStorage.getItem(weatherSnapshotData);

    if (fetchedData == null) {
        return null;
    }

    try {
        const dataWrapped = JSON.parse(fetchedData);
        return dataWrapped;
    } catch (e) {
        return null;
    }
}