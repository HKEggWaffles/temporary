
function initialSettings() {
    const body = document.body;
    const fontToggle = document.getElementById("font-size-toggle");
    const highContrastToggle = document.getElementById("high-contrast-toggle");
    const reducedMotionToggle = document.getElementById("reduced-motion-toggle");
    const unitToggle = document.getElementById("unit-toggle");
    const timeToggle = document.getElementById("time-toggle");
    const fontStoredValue = localStorage.getItem("font-large");
    const fontLargeStored = fontStoredValue;          
    const largeFontEnabled = fontLargeStored === "true";
    if (fontToggle) {
        if (largeFontEnabled == true) {

            document.body.classList.add("font-large")
            fontToggle.textContent = "Enlarged";
            fontToggle.setAttribute("aria-pressed", "true");
        }
        else {
            body.classList.remove("font-large");
            fontToggle.textContent = "Normal";
            fontToggle.setAttribute("aria-pressed", "false");
        }
    } 

    const contrastStoredValue = localStorage.getItem("high-contrast");
    const highContrastEnabled = contrastStoredValue === "true";

    if (highContrastToggle) {
        if (highContrastEnabled == true) {

            body.classList.add("high-contrast");
            highContrastToggle.checked = true;
        }
        else {
            body.classList.remove("high-contrast");
            highContrastToggle.checked = false;
        }
    }

    const motionStoredValue = localStorage.getItem("reduced-motion");
    const reducedMotionEnabled = motionStoredValue === "true";

    if (reducedMotionToggle) {
        if (reducedMotionEnabled == true) {

            body.classList.add("reduced-motion");
            reducedMotionToggle.checked = true;
        }
        else {
            body.classList.remove("reduced-motion");
            reducedMotionToggle.checked = false;
        }
    }

    const storedUnit = localStorage.getItem("temp-unit"); 

    if (storedUnit === "F") {
       
        isCelsius = false;
    } else {
        isCelsius = true;
    }

    if (unitToggle) {
        if (isCelsius) {
            unitToggle.textContent = "C";
            unitToggle.setAttribute("aria-pressed", "false");
        } else {
            unitToggle.textContent = "F";
            unitToggle.setAttribute("aria-pressed", "true");
        }
    }


    const storedTimeToggle = localStorage.getItem("time-format");
    if (timeToggle) {
        if (storedTimeToggle === "12") {
            is24Hour = false;
            timeToggle.textContent = "12h";
            timeToggle.setAttribute("aria-pressed", "true");
        } else {
            is24Hour = true;
            timeToggle.textContent = "24h";
            timeToggle.setAttribute("aria-pressed", "false");
        }
    }
}
function controlSettings() {
    const body = document.body;
    const fontToggle = document.getElementById("font-size-toggle");
    const highContrastToggle = document.getElementById("high-contrast-toggle");
    const reducedMotionToggle = document.getElementById("reduced-motion-toggle");
    const unitToggle = document.getElementById("unit-toggle");
    const timeToggle = document.getElementById("time-toggle");


    if (fontToggle) { 
        fontToggle.addEventListener("click", () => {
            const isNotObese = !body.classList.contains("font-large");

            if (isNotObese) {
                body.classList.add("font-large");
                fontToggle.textContent = "Enlarged";
                fontToggle.setAttribute("aria-pressed", "true");
                localStorage.setItem("font-large", "true");
            }
            else {
                body.classList.remove("font-large");
                fontToggle.textContent = "Normal";
                fontToggle.setAttribute("aria-pressed", "false");
                localStorage.setItem("font-large", "false");
            }
        });
    }

    if (highContrastToggle) {
        highContrastToggle.addEventListener("change", () => {
            const hcEnabled = highContrastToggle.checked;

            if (hcEnabled == true) {
                body.classList.add("high-contrast");

            }
            else {
                body.classList.remove("high-contrast");
            }
            localStorage.setItem("high-contrast", String(hcEnabled));
        });
    }

    if (reducedMotionToggle) {
        reducedMotionToggle.addEventListener("change", () => {
            const rmEnabled = reducedMotionToggle.checked;

            if (rmEnabled) {
                body.classList.add("reduced-motion");
            }
            else {
                body.classList.remove("reduced-motion");
            }

            localStorage.setItem("reduced-motion", String(rmEnabled));
        });
    }

    if (unitToggle) {
        unitToggle.addEventListener("click", () => {
        
            isCelsius = !isCelsius;

            if (isCelsius) {
                unitToggle.textContent = "C";
                unitToggle.setAttribute("aria-pressed", "false");
                localStorage.setItem("temp-unit", "C");
            } else {
                unitToggle.textContent = "F";
                unitToggle.setAttribute("aria-pressed", "true");
                localStorage.setItem("temp-unit", "F");
            }

            if (typeof currentWeatherData !== "undefined" && currentWeatherData) {
                renderConditions(currentWeatherData);
                renderForecast(currentWeatherData);
                renderForecastBlobs(currentWeatherData);
            }
        });
    } 

    if (timeToggle) {
        const storedFormat = localStorage.getItem("time-format"); 

        if (storedFormat === "12") {
            is24Hour = false;
            timeToggle.textContent = "12h";
            timeToggle.setAttribute("aria-pressed", "true");
        } else {
            is24Hour = true;
            timeToggle.textContent = "24h";
            timeToggle.setAttribute("aria-pressed", "false");
        }

        timeToggle.addEventListener("click", () => {
            is24Hour = !is24Hour;

            if (is24Hour) {
                timeToggle.textContent = "24h";
                timeToggle.setAttribute("aria-pressed", "false");
                localStorage.setItem("time-format", "24");
            } else {
                timeToggle.textContent = "12h";
                timeToggle.setAttribute("aria-pressed", "true");
                localStorage.setItem("time-format", "12");
            }

            if (currentWeatherData) {
                renderForecast(currentWeatherData);
                renderForecastBlobs(currentWeatherData);
            }
        });
    }
}




