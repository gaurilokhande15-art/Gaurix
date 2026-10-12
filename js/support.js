document.addEventListener("DOMContentLoaded", function () {
    const faqSearch = document.getElementById("faqSearch");
    const searchBtn = document.getElementById("searchBtn");
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const noResults = document.getElementById("noResults");

    const supportForm = document.getElementById("supportForm");
    const issueCategory = document.getElementById("issueCategory");
    const issueDescription = document.getElementById("issueDescription");
    const descriptionCount = document.getElementById("descriptionCount");
    const formMessage = document.getElementById("formMessage");

    const STORAGE_KEY = "croplandSupportRequestsDemo";

    // FAQ search
    function searchFAQs() {
        const query = faqSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        faqItems.forEach(function (item) {
            const matches = item.textContent.toLowerCase().includes(query);

            item.hidden = !matches;

            if (matches) {
                visibleCount++;
            } else {
                item.open = false;
            }
        });

        noResults.hidden = visibleCount !== 0;
    }

    searchBtn.addEventListener("click", searchFAQs);

    faqSearch.addEventListener("input", searchFAQs);

    faqSearch.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchFAQs();
        }
    });

    // FAQ category buttons take the user to the support form
    document.querySelectorAll(".category-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            issueCategory.value = button.dataset.category;

            document.getElementById("contactSupport").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            issueCategory.focus({ preventScroll: true });
        });
    });

    // Description character counter
    function updateCharacterCount() {
        descriptionCount.textContent = issueDescription.value.length;
    }

    issueDescription.addEventListener("input", updateCharacterCount);

    // Display messages accessibly
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = "form-message " + type;
    }

    // Load saved demo support requests safely
    function getSavedRequests() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    // Submit support request
    supportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!supportForm.reportValidity()) {
            return;
        }

        const description = issueDescription.value.trim();

        if (description.length < 10) {
            showMessage(
                "Please describe your issue in at least 10 characters.",
                "error"
            );
            issueDescription.focus();
            return;
        }

        const request = {
            id: "SUP-" + Date.now().toString().slice(-8),
            name: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            role: document.getElementById("userRole").value,
            category: issueCategory.value,
            orderId: document.getElementById("orderId").value.trim(),
            subject: document.getElementById("issueTitle").value.trim(),
            description: description,
            status: "Submitted (Demo)",
            createdAt: new Date().toISOString()
        };

        try {
            const requests = getSavedRequests();
            requests.unshift(request);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(requests)
            );

            showMessage(
                "Demo request saved! Your reference ID is " +
                request.id +
                ". This request has not been sent to a real support team.",
                "success"
            );

            supportForm.reset();
            updateCharacterCount();
        } catch (error) {
            showMessage(
                "Unable to save the request in this browser. Please check your browser storage settings.",
                "error"
            );
        }
    });
});