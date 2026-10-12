document.addEventListener("DOMContentLoaded", function () {

    const storageKey = "croplandLanguageAccessibilityDemo";

    const statusMessage = document.getElementById("statusMessage");
    const languageSelect = document.getElementById("preferredLanguage");

    const sizeButtons = document.querySelectorAll(".size-btn");

    const accessibilityControls = {
        highContrast: document.getElementById("highContrast"),
        reduceMotion: document.getElementById("reduceMotion"),
        underlineLinks: document.getElementById("underlineLinks")
    };

    const defaults = {
        language: "en",
        textSize: "medium",
        highContrast: false,
        reduceMotion: false,
        underlineLinks: false
    };

    let settings = { ...defaults };

    function showMessage(message, type = "success") {
        statusMessage.textContent = message;
        statusMessage.className = "status-message " + type;
        statusMessage.hidden = false;
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(storageKey);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (parsed && typeof parsed === "object") {
                    settings = {
                        ...defaults,
                        ...parsed
                    };
                }
            }
        } catch (error) {
            console.error("Could not load preferences:", error);
            settings = { ...defaults };
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error("Could not save preferences:", error);
            showMessage(
                "Could not save settings in this browser.",
                "error"
            );
            return false;
        }
    }

    function applySettings() {
        document.body.classList.remove(
            "text-small",
            "text-medium",
            "text-large"
        );

        document.body.classList.add("text-" + settings.textSize);

        document.body.classList.toggle(
            "high-contrast",
            settings.highContrast
        );

        document.body.classList.toggle(
            "reduce-motion",
            settings.reduceMotion
        );

        document.body.classList.toggle(
            "underline-links",
            settings.underlineLinks
        );

        languageSelect.value = settings.language;

        Object.keys(accessibilityControls).forEach(function (key) {
            accessibilityControls[key].checked = settings[key];
        });

        sizeButtons.forEach(function (button) {
            const active = button.dataset.size === settings.textSize;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        // Language is saved as a preference only.
        // Full translation requires a separate translation system.
        document.documentElement.lang = settings.language;
    }

    // LANGUAGE

    document.getElementById("languageForm").addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            settings.language = languageSelect.value;

            if (saveSettings()) {
                applySettings();

                showMessage(
                    "Language preference saved. Full website translation is not enabled yet."
                );
            }
        }
    );

    // TEXT SIZE

    sizeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            settings.textSize = button.dataset.size;

            applySettings();

            if (saveSettings()) {
                showMessage("Text size updated successfully.");
            }
        });
    });

    // ACCESSIBILITY CHECKBOXES

    Object.keys(accessibilityControls).forEach(function (key) {
        accessibilityControls[key].addEventListener(
            "change",
            function () {
                settings[key] = accessibilityControls[key].checked;

                applySettings();

                if (saveSettings()) {
                    showMessage("Accessibility preference updated.");
                }
            }
        );
    });

    // SAVE ACCESSIBILITY

    document.getElementById("saveAccessibility").addEventListener(
        "click",
        function () {
            Object.keys(accessibilityControls).forEach(function (key) {
                settings[key] = accessibilityControls[key].checked;
            });

            applySettings();

            if (saveSettings()) {
                showMessage("Accessibility settings saved successfully.");
            }
        }
    );

    // RESET SETTINGS

    document.getElementById("resetSettings").addEventListener(
        "click",
        function () {
            const confirmed = window.confirm(
                "Reset language and accessibility preferences?"
            );

            if (!confirmed) {
                return;
            }

            settings = { ...defaults };

            applySettings();

            if (saveSettings()) {
                showMessage("Preferences restored to their defaults.");
            }
        }
    );

    loadSettings();
    applySettings();

});