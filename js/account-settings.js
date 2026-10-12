document.addEventListener("DOMContentLoaded", function () {

    const profileKey = "croplandAccountProfileDemo";
    const notificationKey = "croplandNotificationSettingsDemo";
    const privacyKey = "croplandPrivacySettingsDemo";

    const statusMessage = document.getElementById("statusMessage");

    const profileForm = document.getElementById("profileForm");
    const notificationForm = document.getElementById("notificationForm");
    const privacyForm = document.getElementById("privacyForm");
    const passwordForm = document.getElementById("passwordForm");

    function showMessage(message, type = "success") {
        statusMessage.textContent = message;
        statusMessage.className = "status-message " + type;
        statusMessage.hidden = false;

        statusMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    function readSettings(key, fallback) {
        try {
            const saved = localStorage.getItem(key);

            if (!saved) {
                return fallback;
            }

            const parsed = JSON.parse(saved);

            if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
            ) {
                return { ...fallback, ...parsed };
            }

            return fallback;

        } catch (error) {
            console.error("Could not load settings:", error);
            return fallback;
        }
    }

    function saveSettings(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Could not save settings:", error);
            showMessage(
                "Settings could not be saved in this browser.",
                "error"
            );
            return false;
        }
    }

    const defaultProfile = {
        fullName: "",
        email: "",
        language: "English",
        accountType: "Farmer"
    };

    const defaultNotifications = {
        orderNotifications: true,
        messageNotifications: true,
        marketNotifications: true,
        offerNotifications: false
    };

    const defaultPrivacy = {
        profileVisibility: true,
        contactVisibility: false
    };

    // LOAD PROFILE SETTINGS

    const profile = readSettings(profileKey, defaultProfile);

    document.getElementById("fullName").value = profile.fullName;
    document.getElementById("email").value = profile.email;
    document.getElementById("language").value = profile.language;
    document.getElementById("accountType").value = profile.accountType;


    // LOAD NOTIFICATION SETTINGS

    const notifications = readSettings(
        notificationKey,
        defaultNotifications
    );

    Object.keys(defaultNotifications).forEach(function (key) {
        document.getElementById(key).checked = notifications[key];
    });


    // LOAD PRIVACY SETTINGS

    const privacy = readSettings(privacyKey, defaultPrivacy);

    Object.keys(defaultPrivacy).forEach(function (key) {
        document.getElementById(key).checked = privacy[key];
    });


    // SAVE PROFILE

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedProfile = {
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            language: document.getElementById("language").value,
            accountType: document.getElementById("accountType").value
        };

        if (!updatedProfile.fullName || !updatedProfile.email) {
            showMessage("Please enter your name and email.", "error");
            return;
        }

        if (!saveSettings(profileKey, updatedProfile)) {
            return;
        }

        showMessage("Profile preferences saved successfully!");
    });


    // SAVE NOTIFICATIONS

    notificationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedNotifications = {};

        Object.keys(defaultNotifications).forEach(function (key) {
            updatedNotifications[key] =
                document.getElementById(key).checked;
        });

        if (!saveSettings(notificationKey, updatedNotifications)) {
            return;
        }

        showMessage("Notification preferences saved successfully!");
    });


    // SAVE PRIVACY SETTINGS

    privacyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedPrivacy = {};

        Object.keys(defaultPrivacy).forEach(function (key) {
            updatedPrivacy[key] =
                document.getElementById(key).checked;
        });

        if (!saveSettings(privacyKey, updatedPrivacy)) {
            return;
        }

        showMessage(
            "Privacy preferences saved locally. They do not affect server data."
        );
    });


    // DEMO PASSWORD VALIDATION
    // Never save passwords in localStorage.

    passwordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage("Please fill in all password fields.", "error");
            return;
        }

        if (newPassword.length < 8) {
            showMessage(
                "Your new password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        if (newPassword === currentPassword) {
            showMessage(
                "Your new password must differ from your current password.",
                "error"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage(
                "The new password and confirmation do not match.",
                "error"
            );
            return;
        }

        passwordForm.reset();

        showMessage(
            "Demo validation successful. No password was changed. Connect Supabase Auth to implement a real password change."
        );
    });


    // RESET SETTINGS

    document.getElementById("resetSettings").addEventListener(
        "click",
        function () {

            const confirmed = window.confirm(
                "Reset all Account Settings on this page to their defaults?"
            );

            if (!confirmed) {
                return;
            }

            try {
                localStorage.removeItem(profileKey);
                localStorage.removeItem(notificationKey);
                localStorage.removeItem(privacyKey);

                profileForm.reset();
                notificationForm.reset();
                privacyForm.reset();
                passwordForm.reset();

                // Restore profile defaults.
                document.getElementById("language").value = "English";
                document.getElementById("accountType").value = "Farmer";

                // Restore notification defaults.
                Object.keys(defaultNotifications).forEach(function (key) {
                    document.getElementById(key).checked =
                        defaultNotifications[key];
                });

                // Restore privacy defaults.
                Object.keys(defaultPrivacy).forEach(function (key) {
                    document.getElementById(key).checked =
                        defaultPrivacy[key];
                });

                showMessage("Account Settings have been reset.");

            } catch (error) {
                console.error("Could not reset settings:", error);

                showMessage(
                    "Settings could not be reset in this browser.",
                    "error"
                );
            }
        }
    );

});