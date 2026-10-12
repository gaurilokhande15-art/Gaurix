document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("farmerProfileForm");
    const resetButton = document.getElementById("resetProfileBtn");
    const message = document.getElementById("profileMessage");

    const STORAGE_KEY = "croplandFarmerProfile";

    const fields = [
        "fullName",
        "email",
        "phone",
        "experience",
        "village",
        "district",
        "state",
        "pincode",
        "crops",
        "farmSize",
        "farmUnit",
        "aboutFarm"
    ];

    let savedProfile = {};

    function getDefaultProfile() {
        return {
            fullName: "",
            email: "",
            phone: "",
            experience: "",
            village: "",
            district: "",
            state: "",
            pincode: "",
            crops: "",
            farmSize: "",
            farmUnit: "Acres",
            aboutFarm: ""
        };
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
    }

    function hideMessage() {
        message.textContent = "";
        message.className = "message";
    }

    function getProfileFromForm() {
        const profile = {};

        fields.forEach(function (fieldId) {
            const input = document.getElementById(fieldId);
            profile[fieldId] = input.value.trim();
        });

        return profile;
    }

    function fillForm(profile) {
        fields.forEach(function (fieldId) {
            const input = document.getElementById(fieldId);

            input.value =
                profile[fieldId] !== undefined
                    ? profile[fieldId]
                    : "";
        });

        updateProfilePreview();
    }

    function updateProfilePreview() {
        const name = document.getElementById("fullName").value.trim();
        const village = document.getElementById("village").value.trim();
        const district = document.getElementById("district").value.trim();
        const state = document.getElementById("state").value.trim();

        const displayName = document.getElementById("displayName");
        const displayLocation = document.getElementById("displayLocation");
        const avatar = document.getElementById("profileAvatar");

        displayName.textContent = name || "Farmer Name";

        const locationParts = [village, district, state].filter(Boolean);

        displayLocation.textContent = locationParts.length
            ? locationParts.join(", ")
            : "Add your location";

        avatar.textContent = name
            ? name.charAt(0).toUpperCase()
            : "F";
    }

    function loadProfile() {
        let profile = getDefaultProfile();

        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored) {
                const parsed = JSON.parse(stored);

                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    profile = {
                        ...profile,
                        ...parsed
                    };
                }
            }
        } catch (error) {
            console.error("Unable to load farmer profile:", error);
            showMessage(
                "Saved profile could not be loaded. You can enter your details again.",
                "error"
            );
        }

        savedProfile = { ...profile };
        fillForm(profile);
    }

    // Update preview while typing
    ["fullName", "village", "district", "state"].forEach(function (fieldId) {
        document.getElementById(fieldId).addEventListener("input", function () {
            updateProfilePreview();
        });

        document.getElementById(fieldId).addEventListener("change", function () {
            updateProfilePreview();
        });
    });

    // Save profile
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const profile = getProfileFromForm();

        if (profile.phone && !/^[6-9]\d{9}$/.test(profile.phone)) {
            showMessage(
                "Please enter a valid 10-digit Indian mobile number.",
                "error"
            );
            return;
        }

        if (profile.pincode && !/^\d{6}$/.test(profile.pincode)) {
            showMessage(
                "Please enter a valid 6-digit PIN code.",
                "error"
            );
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

            savedProfile = { ...profile };

            updateProfilePreview();

            showMessage(
                "Your profile has been saved successfully on this browser!",
                "success"
            );
        } catch (error) {
            console.error("Unable to save farmer profile:", error);

            showMessage(
                "Profile could not be saved. Your browser storage may be unavailable.",
                "error"
            );
        }
    });

    // Reset unsaved changes to the last saved profile
    resetButton.addEventListener("click", function () {
        fillForm(savedProfile);
        hideMessage();

        showMessage(
            "Form restored to your last saved profile.",
            "success"
        );
    });

    loadProfile();
});