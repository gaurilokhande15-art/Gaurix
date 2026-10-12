document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("faqSearch");
    const searchButton = document.getElementById("searchBtn");
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const faqCount = document.getElementById("faqCount");
    const noResults = document.getElementById("noResults");
    const faqList = document.getElementById("faqList");
    const clearSearchButton = document.getElementById("clearSearch");

    // Open and close FAQ answers
    faqItems.forEach(function (item) {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", function () {
            const isOpen = item.classList.contains("open");

            item.classList.toggle("open", !isOpen);
            question.setAttribute("aria-expanded", String(!isOpen));
        });
    });

    // Search questions and answers
    function filterFAQs() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        faqItems.forEach(function (item) {
            const searchableText = item.textContent.toLowerCase();
            const matches = searchableText.includes(query);

            item.hidden = !matches;

            if (matches) {
                visibleCount++;
            } else {
                item.classList.remove("open");
                item.querySelector(".faq-question")
                    .setAttribute("aria-expanded", "false");
            }
        });

        faqCount.textContent =
            visibleCount + (visibleCount === 1 ? " question" : " questions");

        noResults.hidden = visibleCount !== 0;
        faqList.hidden = visibleCount === 0;
    }

    searchButton.addEventListener("click", filterFAQs);

    searchInput.addEventListener("input", filterFAQs);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            filterFAQs();
        }
    });

    clearSearchButton.addEventListener("click", function () {
        searchInput.value = "";
        filterFAQs();
        searchInput.focus();
    });

    // Initial count
    filterFAQs();
});