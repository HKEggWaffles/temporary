const FAVORITES_API = "http://localhost:8080/favorites";

let currentDisplayedLocation = null;

async function fetchFavorites() {
    const response = await fetch(FAVORITES_API);

    if (!response.ok) {
        throw new Error(`Failed to fetch favourites: ${response.status}`);
    }

    return await response.json();
}

async function createFavorite(favorite) {
    const response = await fetch(FAVORITES_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(favorite)
    });

    if (!response.ok) {
        throw new Error(`Failed to save favourite: ${response.status}`);
    }

    return await response.json();
}

async function removeFavorite(id) {
    const response = await fetch(`${FAVORITES_API}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Failed to delete favourite: ${response.status}`);
    }
}

function renderFavorites(favorites) {
    const favoritesList = document.getElementById("favorites-list");
    if (!favoritesList) return;

    if (!favorites || favorites.length === 0) {
        favoritesList.innerHTML = `<div class="card">No favourite locations saved yet.</div>`;
        return;
    }

    favoritesList.innerHTML = favorites.map((fav) => `
        <div class="card favorite-card">
            <div class="favorite-card__info">
                <div class="favorite-card__title">${fav.city}, ${fav.country}</div>
                <div class="favorite-card__meta">Lat: ${fav.lat}, Lon: ${fav.lon}</div>
            </div>
            <div class="favorite-card__buttons">
                <button class="toggle-button" data-action="load" data-lat="${fav.lat}" data-lon="${fav.lon}">
                    Load
                </button>
                <button class="secondary-button" data-action="delete" data-id="${fav.id}">
                    Delete
                </button>
            </div>
        </div>
    `).join("");
}

async function refreshFavorites() {
    const favoritesList = document.getElementById("favorites-list");

    try {
        const favorites = await fetchFavorites();
        renderFavorites(favorites);
    } catch (error) {
        console.error(error);
        if (favoritesList) {
            favoritesList.innerHTML = `<div class="card">Could not load favourites.</div>`;
        }
    }
}

function setFavoriteStatus(message, isError = false) {
    const status = document.getElementById("favorite-status");
    if (!status) return;

    status.textContent = message;
    status.style.color = isError ? "#ffd6d6" : "#ffffff";
}

async function handleSaveFavorite() {
    if (!currentDisplayedLocation) {
        setFavoriteStatus("No current location available to save.", true);
        return;
    }

    try {
        await createFavorite(currentDisplayedLocation);
        setFavoriteStatus("Location saved successfully.");
        await refreshFavorites();
    } catch (error) {
        console.error(error);
        setFavoriteStatus("Failed to save location.", true);
    }
}

function attachFavoriteEvents() {
    const saveButton = document.getElementById("save-favorite-btn");
    const refreshButton = document.getElementById("refresh-favorites-btn");
    const favoritesList = document.getElementById("favorites-list");

    if (saveButton) {
        saveButton.addEventListener("click", handleSaveFavorite);
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", refreshFavorites);
    }

    if (favoritesList) {
        favoritesList.addEventListener("click", async (event) => {
            const button = event.target.closest("button");
            if (!button) return;

            const action = button.dataset.action;

            if (action === "delete") {
                try {
                    await removeFavorite(button.dataset.id);
                    await refreshFavorites();
                } catch (error) {
                    console.error(error);
                }
            }

            if (action === "load") {
                const latInput = document.getElementById("lat-input");
                const lonInput = document.getElementById("lon-input");
                const loadButton = document.getElementById("load-location");

                if (latInput) latInput.value = button.dataset.lat;
                if (lonInput) lonInput.value = button.dataset.lon;

                if (loadButton) {
                    loadButton.click();
                }
            }
        });
    }
}

function setCurrentDisplayedLocation(locationData) {
    currentDisplayedLocation = locationData;
}

document.addEventListener("DOMContentLoaded", () => {
    attachFavoriteEvents();
    refreshFavorites();
});