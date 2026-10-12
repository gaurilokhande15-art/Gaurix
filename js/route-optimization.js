const routeForm = document.getElementById("routeForm");
const stopsContainer = document.getElementById("stopsContainer");
const addStopBtn = document.getElementById("addStopBtn");

const routeMessage = document.getElementById("routeMessage");
const emptyState = document.getElementById("emptyState");
const routeResults = document.getElementById("routeResults");
const routeSequence = document.getElementById("routeSequence");
const resetBtn = document.getElementById("resetBtn");

let stopCounter = 2;

// Add another trader delivery location
addStopBtn.addEventListener("click", function () {
    if (stopsContainer.children.length >= 10) {
        routeMessage.textContent = "You can add up to 10 delivery stops.";
        return;
    }

    stopCounter++;

    const row = document.createElement("div");
    row.className = "stop-row";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "stop-input";
    input.placeholder = `Trader ${stopCounter} location`;
    input.required = true;
    input.setAttribute("aria-label", `Trader ${stopCounter} location`);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-stop";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove trader ${stopCounter}`);

    removeButton.addEventListener("click", function () {
        row.remove();
        routeMessage.textContent = "";
    });

    row.append(input, removeButton);
    stopsContainer.appendChild(row);
});

// Generate an illustrative demo route
routeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    routeMessage.textContent = "";

    const startLocation = document
        .getElementById("startLocation")
        .value.trim();

    const cropQuantity = Number(
        document.getElementById("cropQuantity").value
    );

    const vehicleCapacity = Number(
        document.getElementById("vehicleCapacity").value
    );

    const fuelPrice = Number(
        document.getElementById("fuelPrice").value
    );

    const stops = Array.from(
        document.querySelectorAll(".stop-input")
    )
        .map(input => input.value.trim())
        .filter(Boolean);

    if (!startLocation || stops.length === 0) {
        routeMessage.textContent =
            "Enter a starting location and at least one trader location.";
        return;
    }

    if (cropQuantity <= 0 || fuelPrice <= 0) {
        routeMessage.textContent =
            "Enter valid crop quantity and fuel price.";
        return;
    }

    // This is a demonstration formula, NOT a real route calculation.
    // Real distance requires map/geocoding data from a backend.
    const estimatedDistance = 10 + stops.length * 12;
    const averageSpeed = 30;
    const estimatedHours = estimatedDistance / averageSpeed;
    const fuelEfficiency = 10;
    const estimatedFuelCost =
        (estimatedDistance / fuelEfficiency) * fuelPrice;

    const vehiclesRequired = Math.ceil(
        cropQuantity / vehicleCapacity
    );

    document.getElementById("distanceResult").textContent =
        `${estimatedDistance} km*`;

    document.getElementById("timeResult").textContent =
        `${estimatedHours.toFixed(1)} hrs*`;

    document.getElementById("fuelResult").textContent =
        `₹${Math.round(estimatedFuelCost)}*`;

    document.getElementById("vehicleResult").textContent =
        vehiclesRequired;

    // Display start and stops in the entered order.
    // Actual stop optimization will be added with map integration.
    routeSequence.replaceChildren();

    const allLocations = [
        { name: startLocation, type: "Starting Location" },
        ...stops.map((name, index) => ({
            name,
            type: `Delivery Stop ${index + 1}`
        }))
    ];

    allLocations.forEach(function (location, index) {
        const item = document.createElement("div");
        item.className = "route-stop";

        const number = document.createElement("span");
        number.className = "stop-number";
        number.textContent = index + 1;

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = location.name;

        const type = document.createElement("small");
        type.textContent = location.type;

        details.append(name, type);
        item.append(number, details);
        routeSequence.appendChild(item);
    });

    emptyState.hidden = true;
    routeResults.hidden = false;

    routeMessage.textContent =
        "Demo plan generated. Estimates are illustrative, not real navigation data.";

    routeResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Reset the form to create a new demo route
resetBtn.addEventListener("click", function () {
    routeForm.reset();

    stopsContainer.replaceChildren();

    for (let i = 1; i <= 2; i++) {
        const row = document.createElement("div");
        row.className = "stop-row";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "stop-input";
        input.placeholder = `Trader ${i} location`;
        input.required = true;

        row.appendChild(input);
        stopsContainer.appendChild(row);
    }

    stopCounter = 2;
    routeResults.hidden = true;
    emptyState.hidden = false;
    routeMessage.textContent = "";

    document.getElementById("startLocation").focus();
});