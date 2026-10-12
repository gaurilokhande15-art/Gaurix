// CROPLAND RATINGS AND REVIEWS
// Frontend demonstration. Real review verification requires a backend.

document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "croplandReviewsDemo";
    const HELPFUL_KEY = "croplandHelpfulReviewsDemo";

    const reviewsList = document.getElementById("reviewsList");
    const emptyReviews = document.getElementById("emptyReviews");

    const reviewModal = document.getElementById("reviewModal");
    const reviewForm = document.getElementById("reviewForm");

    const ratingInput = document.getElementById("selectedRating");
    const ratingHelp = document.getElementById("ratingHelp");
    const starButtons = [...document.querySelectorAll("#starPicker button")];

    const searchInput = document.getElementById("reviewSearch");
    const ratingFilter = document.getElementById("ratingFilter");
    const sortSelect = document.getElementById("sortReviews");

    let reviews = loadReviews();
    let helpfulReviews = loadHelpfulReviews();

    // SAMPLE DATA IS EXPLICITLY MARKED AS DEMO

    if (reviews === null) {

        reviews = [
            {
                id: "demo-1",
                reviewer: "Amit Kulkarni",
                seller: "Example Farmer A",
                product: "Fresh Tomatoes",
                rating: 5,
                text: "The tomatoes were fresh and good quality. Communication was clear.",
                date: Date.now() - 86400000,
                helpful: 4,
                demo: true
            },
            {
                id: "demo-2",
                reviewer: "Priya Sharma",
                seller: "Example Farmer B",
                product: "Wheat",
                rating: 4,
                text: "The product quality was good. I would like to see more delivery options.",
                date: Date.now() - 172800000,
                helpful: 2,
                demo: true
            },
            {
                id: "demo-3",
                reviewer: "Rahul Patil",
                seller: "Example Shopkeeper A",
                product: "Onion",
                rating: 5,
                text: "The seller communicated clearly and the buying process was straightforward.",
                date: Date.now() - 259200000,
                helpful: 3,
                demo: true
            }
        ];

        saveReviews();
    }

    // LOAD REVIEWS

    function loadReviews() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            if (raw === null) {
                return null;
            }

            const parsed = JSON.parse(raw);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.filter(function (review) {

                return review &&
                    typeof review.id === "string" &&
                    typeof review.reviewer === "string" &&
                    typeof review.seller === "string" &&
                    typeof review.product === "string" &&
                    Number.isInteger(review.rating) &&
                    review.rating >= 1 &&
                    review.rating <= 5 &&
                    typeof review.text === "string";
            });

        } catch (error) {

            console.error("Could not load reviews:", error);
            return [];
        }
    }

    function loadHelpfulReviews() {

        try {

            const raw = localStorage.getItem(HELPFUL_KEY);

            if (!raw) {
                return [];
            }

            const parsed = JSON.parse(raw);

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {

            console.error("Could not load helpful votes:", error);
            return [];
        }
    }

    // SAVE REVIEWS

    function saveReviews() {

        try {

            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
            return true;

        } catch (error) {

            console.error("Could not save reviews:", error);

            alert("Unable to save the review. Check browser storage.");
            return false;
        }
    }

    function saveHelpfulReviews() {

        try {

            localStorage.setItem(
                HELPFUL_KEY,
                JSON.stringify(helpfulReviews)
            );

            return true;

        } catch (error) {

            console.error("Could not save helpful votes:", error);
            return false;
        }
    }

    // CREATE ELEMENTS SAFELY

    function element(tag, className, text) {

        const node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text !== undefined) {
            node.textContent = text;
        }

        return node;
    }

    function stars(rating) {

        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    function formatDate(timestamp) {

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // UPDATE SUMMARY AND RATING BREAKDOWN

    function renderSummary() {

        const total = reviews.length;

        const average = total
            ? reviews.reduce(function (sum, review) {
                return sum + review.rating;
            }, 0) / total
            : 0;

        document.getElementById("averageRating").textContent =
            total ? average.toFixed(1) : "0.0";

        document.getElementById("averageStars").textContent =
            stars(Math.round(average));

        document.getElementById("totalReviews").textContent =
            total + (total === 1 ? " review" : " reviews");

        const breakdown = document.getElementById("ratingBreakdown");

        breakdown.replaceChildren();

        for (let rating = 5; rating >= 1; rating--) {

            const count = reviews.filter(function (review) {
                return review.rating === rating;
            }).length;

            const percentage = total ? (count / total) * 100 : 0;

            const row = element("div", "rating-row");

            const label = element(
                "span",
                "rating-label",
                rating + " ★"
            );

            const track = element("div", "rating-track");
            const fill = element("div", "rating-fill");

            fill.style.width = percentage + "%";

            track.append(fill);

            const number = element(
                "span",
                "rating-count",
                String(count)
            );

            row.append(label, track, number);

            breakdown.append(row);
        }
    }

    // FILTER AND SORT

    function getFilteredReviews() {

        const query = searchInput.value.trim().toLowerCase();
        const rating = ratingFilter.value;
        const sort = sortSelect.value;

        const result = reviews.filter(function (review) {

            const searchableText = [
                review.reviewer,
                review.seller,
                review.product,
                review.text
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(query);

            const matchesRating =
                rating === "all" ||
                review.rating === Number(rating);

            return matchesSearch && matchesRating;
        });

        result.sort(function (a, b) {

            if (sort === "helpful") {
                return (b.helpful || 0) - (a.helpful || 0);
            }

            if (sort === "highest") {
                return b.rating - a.rating;
            }

            if (sort === "lowest") {
                return a.rating - b.rating;
            }

            return b.date - a.date;
        });

        return result;
    }

    // RENDER REVIEW CARDS

    function renderReviews() {

        reviewsList.replaceChildren();

        const filtered = getFilteredReviews();

        emptyReviews.classList.toggle(
            "hidden",
            filtered.length > 0
        );

        filtered.forEach(function (review) {

            const card = element("article", "review-card");

            const top = element("div", "review-top");

            const avatar = element(
                "div",
                "reviewer-avatar",
                review.reviewer.trim().charAt(0).toUpperCase() || "?"
            );

            const details = element("div", "reviewer-details");

            const reviewerName = element(
                "h3",
                "",
                review.reviewer
            );

            const subtitle = element(
                "p",
                "review-subtitle",
                "Review for " + review.seller
            );

            details.append(reviewerName, subtitle);

            const date = element(
                "time",
                "review-date",
                formatDate(review.date)
            );

            top.append(avatar, details, date);

            const ratingLine = element("div", "review-rating-line");

            const starText = element(
                "span",
                "review-stars",
                stars(review.rating)
            );

            const ratingNumber = element(
                "span",
                "rating-number",
                review.rating + "/5"
            );

            ratingLine.append(starText, ratingNumber);

            const product = element(
                "span",
                "review-product",
                "🛒 " + review.product
            );

            const text = element(
                "p",
                "review-text",
                review.text
            );

            const footer = element("div", "review-footer");

            const label = element(
                "span",
                "review-demo-label",
                "Demo review · Not purchase-verified"
            );

            const alreadyHelpful = helpfulReviews.includes(review.id);

            const helpfulBtn = element(
                "button",
                "helpful-btn",
                alreadyHelpful
                    ? "👍 Helpful (" + (review.helpful || 0) + ")"
                    : "👍 Helpful (" + (review.helpful || 0) + ")"
            );

            helpfulBtn.type = "button";
            helpfulBtn.disabled = alreadyHelpful;

            if (alreadyHelpful) {
                helpfulBtn.setAttribute("aria-pressed", "true");
            } else {
                helpfulBtn.setAttribute("aria-pressed", "false");
            }

            helpfulBtn.addEventListener("click", function () {

                if (helpfulReviews.includes(review.id)) {
                    return;
                }

                const previousCount = review.helpful || 0;

                review.helpful = previousCount + 1;
                helpfulReviews.push(review.id);

                if (!saveReviews() || !saveHelpfulReviews()) {

                    review.helpful = previousCount;

                    helpfulReviews = helpfulReviews.filter(function (id) {
                        return id !== review.id;
                    });

                    saveReviews();
                    saveHelpfulReviews();

                    return;
                }

                renderReviews();
            });

            footer.append(label, helpfulBtn);

            card.append(top, ratingLine, product, text, footer);

            reviewsList.append(card);
        });
    }

    function renderAll() {
        renderSummary();
        renderReviews();
    }

    // OPEN AND CLOSE MODAL

    function openModal() {

        reviewForm.reset();

        ratingInput.value = "0";

        document.getElementById("characterCount").textContent = "0";

        document.getElementById("formError").classList.add("hidden");

        updateStarPicker(0);

        reviewModal.classList.remove("hidden");

        document.getElementById("reviewerName").focus();
    }

    function closeModal() {
        reviewModal.classList.add("hidden");
    }

    document.getElementById("writeReviewBtn")
        .addEventListener("click", openModal);

    document.getElementById("closeModalBtn")
        .addEventListener("click", closeModal);

    document.getElementById("cancelReviewBtn")
        .addEventListener("click", closeModal);

    reviewModal.addEventListener("click", function (event) {

        if (event.target === reviewModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeModal();
        }
    });

    // STAR PICKER

    function updateStarPicker(rating) {

        starButtons.forEach(function (button) {

            const value = Number(button.dataset.rating);

            button.classList.toggle("active", value <= rating);

            button.textContent = value <= rating ? "★" : "☆";

            button.setAttribute(
                "aria-pressed",
                value === rating ? "true" : "false"
            );
        });

        ratingHelp.textContent = rating
            ? rating + " out of 5 stars selected."
            : "Select between 1 and 5 stars.";
    }

    starButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const rating = Number(button.dataset.rating);

            ratingInput.value = String(rating);

            updateStarPicker(rating);
        });
    });

    // CHARACTER COUNTER

    document.getElementById("reviewText")
        .addEventListener("input", function () {

            document.getElementById("characterCount").textContent =
                this.value.length;
        });

    // SUBMIT REVIEW

    reviewForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const rating = Number(ratingInput.value);

        const error = document.getElementById("formError");

        if (rating < 1 || rating > 5) {

            error.textContent = "Please select a rating between 1 and 5 stars.";
            error.classList.remove("hidden");

            return;
        }

        const reviewer = document.getElementById("reviewerName")
            .value.trim();

        const seller = document.getElementById("sellerName")
            .value.trim();

        const product = document.getElementById("productName")
            .value.trim();

        const text = document.getElementById("reviewText")
            .value.trim();

        if (!reviewer || !seller || !product || !text) {

            error.textContent = "Please complete all required fields.";
            error.classList.remove("hidden");

            return;
        }

        const review = {
            id: "review-" + Date.now().toString(36) +
                Math.random().toString(36).slice(2, 7),

            reviewer: reviewer,
            seller: seller,
            product: product,
            rating: rating,
            text: text,
            date: Date.now(),
            helpful: 0,
            demo: true
        };

        reviews.unshift(review);

        if (!saveReviews()) {

            reviews.shift();
            return;
        }

        closeModal();

        searchInput.value = "";
        ratingFilter.value = "all";
        sortSelect.value = "recent";

        renderAll();

        alert(
            "Your demo review has been saved in this browser. " +
            "It is not yet published to other users."
        );
    });

    // FILTER EVENTS

    searchInput.addEventListener("input", renderReviews);
    ratingFilter.addEventListener("change", renderReviews);
    sortSelect.addEventListener("change", renderReviews);

    // INITIALIZE

    renderAll();

});