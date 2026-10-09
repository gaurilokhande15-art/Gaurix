/* =========================================
   INFORMED CROP SELECTION
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const continueButton = document.getElementById("continueCropSelection");
    const selectedCropInput = document.getElementById("registrationCropName");
    const selectionMessage = document.getElementById("selectionMessage");

    if (continueButton && selectedCropInput) {
        continueButton.addEventListener("click", function () {
            const selectedCrop = document.querySelector(
                'input[name="selectedCrop"]:checked'
            );

            if (!selectedCrop) {
                selectionMessage.textContent =
                    "Please select a crop before continuing.";
                selectionMessage.style.color = "#b42318";
                return;
            }

            selectedCropInput.value = selectedCrop.value;

            selectionMessage.textContent =
                selectedCrop.value + " selected. You can now complete crop registration.";
            selectionMessage.style.color = "#287447";

            document.getElementById("crop-registration").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }
});


/* =========================================
   MARKET DEMAND CROP SHORTCUT
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const demandButtons = document.querySelectorAll(".demand-select-btn");

    demandButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const cropName = button.dataset.crop;
            const radio = document.querySelector(
                'input[name="selectedCrop"][value="' + cropName + '"]'
            );

            if (radio) {
                radio.checked = true;

                document.getElementById("selectionMessage").textContent =
                    cropName + " selected. Continue to complete your crop plan.";

                document.getElementById("selectionMessage").style.color = "#287447";

                document.getElementById("crop-selection").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});

/* ===== PLAN NEXT CROP NAVIGATION ===== */

document.addEventListener("DOMContentLoaded", function () {
    const flowLinks = document.querySelectorAll(
        '.flowchart a[href^="#"], .flowchart-node a[href^="#"]'
    );

    flowLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", targetId);
            }
        });
    });
});

// ===== TRADER DISCOVERY: SEARCH AND FILTER =====
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("traderSearch");
    const cropFilter = document.getElementById("traderCropFilter");
    const traderCards = document.querySelectorAll(".trader-card");

    function filterTraders() {
        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const selectedCrop = cropFilter
            ? cropFilter.value.toLowerCase()
            : "all";

        traderCards.forEach(function (card) {
            const cardText = card.textContent.toLowerCase();

            const matchesSearch = cardText.includes(searchText);
            const matchesCrop =
                selectedCrop === "all" ||
                cardText.includes(selectedCrop);

            card.style.display =
                matchesSearch && matchesCrop ? "" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterTraders);
    }

    if (cropFilter) {
        cropFilter.addEventListener("change", filterTraders);
    }
});

// ===== PRE-ORDER FORM =====
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("preOrderForm");
    const message = document.getElementById("preOrderMessage");
    const dateInput = document.getElementById("preOrderDate");

    if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const preOrder = {
            crop: document.getElementById("preOrderCrop").value.trim(),
            quantity: Number(document.getElementById("preOrderQuantity").value),
            harvestDate: dateInput.value,
            location: document.getElementById("preOrderLocation").value.trim(),
            expectedPrice: document.getElementById("preOrderPrice").value,
            notes: document.getElementById("preOrderNotes").value.trim(),
            createdAt: new Date().toISOString()
        };

        if (
            !preOrder.crop ||
            preOrder.quantity <= 0 ||
            !preOrder.harvestDate ||
            !preOrder.location
        ) {
            message.textContent = "Please fill in all required fields correctly.";
            message.style.color = "#b42318";
            return;
        }

        const existingOrders = JSON.parse(
            localStorage.getItem("farm2landPreOrders") || "[]"
        );

        existingOrders.push(preOrder);

        localStorage.setItem(
            "farm2landPreOrders",
            JSON.stringify(existingOrders)
        );

        message.textContent =
            "Pre-order details saved successfully! Backend connection will be added later.";
        message.style.color = "#287447";

        form.reset();
        dateInput.min = new Date().toISOString().split("T")[0];
    });
});

// ===== EXPRESS INTEREST IN TRADER =====
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".trader-interest-btn");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".trader-card");

            if (!card) return;

            const traderName =
                card.querySelector("h3")?.textContent.trim();

            const cropDetails =
                card.querySelector(".trader-details")?.textContent.trim();

            const interest = {
                traderName: traderName,
                cropDetails: cropDetails,
                createdAt: new Date().toISOString()
            };

            const interests = JSON.parse(
                localStorage.getItem("farm2landTraderInterests") || "[]"
            );

            const alreadyExists = interests.some(function (item) {
                return item.traderName === traderName;
            });

            if (alreadyExists) {
                alert("You have already expressed interest in this demo trader.");
                return;
            }

            interests.push(interest);

            localStorage.setItem(
                "farm2landTraderInterests",
                JSON.stringify(interests)
            );

            button.textContent = "Interest Saved ✓";
            button.disabled = true;
        });
    });
});

// ===== CROP REGISTRATION FORM =====
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cropRegistrationForm");

    if (!form) return;

    const dateInput = document.getElementById("registrationHarvestDate");
    const message = document.getElementById("registrationMessage");

    if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const cropPlan = {
            crop: document.getElementById("registrationCropName").value.trim(),
            quantity: Number(document.getElementById("registrationQuantity").value),
            harvestDate: dateInput.value,
            location: document.getElementById("registrationLocation").value.trim(),
            notes: document.getElementById("registrationNotes").value.trim(),
            createdAt: new Date().toISOString()
        };

        if (
            !cropPlan.crop ||
            cropPlan.quantity <= 0 ||
            !cropPlan.harvestDate ||
            !cropPlan.location
        ) {
            message.textContent = "Please complete all required fields correctly.";
            message.style.color = "#b42318";
            return;
        }

        const plans = JSON.parse(
            localStorage.getItem("farm2landCropRegistrations") || "[]"
        );

        plans.push(cropPlan);

        localStorage.setItem(
            "farm2landCropRegistrations",
            JSON.stringify(plans)
        );

        message.textContent =
            "Crop plan registered successfully! Backend connection will be added later.";
        message.style.color = "#287447";

        form.reset();

        if (dateInput) {
            dateInput.min = new Date().toISOString().split("T")[0];
        }
    });
});

// ===== FLOWCHART NAVIGATION =====
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(
        '.flowchart a[href^="#"], .flowchart-node a[href^="#"]'
    );

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", targetId);
            }
        });
    });
});

// ===== MY CROP PLANS SUMMARY =====
document.addEventListener("DOMContentLoaded", function () {
    function getSavedCount(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data.length : 0;
        } catch (error) {
            return 0;
        }
    }

    const counts = {
        summaryCropCount: getSavedCount("farm2landPlannedCrops"),
        summaryRegistrationCount: getSavedCount("farm2landCropRegistrations"),
        summaryPreOrderCount: getSavedCount("farm2landPreOrders"),
        summaryInterestCount: getSavedCount("farm2landTraderInterests")
    };

    Object.entries(counts).forEach(function ([elementId, count]) {
        const element = document.getElementById(elementId);

        if (element) {
            element.textContent = count;
        }
    });
});