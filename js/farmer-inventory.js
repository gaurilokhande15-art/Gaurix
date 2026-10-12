document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "croplandInventoryDemo";

    const form = document.getElementById("inventoryForm");
    const formPanel = document.getElementById("productFormPanel");
    const formTitle = document.getElementById("formTitle");
    const productIdInput = document.getElementById("productId");
    const productNameInput = document.getElementById("productName");
    const categoryInput = document.getElementById("category");
    const quantityInput = document.getElementById("quantity");
    const priceInput = document.getElementById("price");
    const locationInput = document.getElementById("location");
    const harvestDateInput = document.getElementById("harvestDate");
    const availabilityInput = document.getElementById("availability");
    const qualityInput = document.getElementById("quality");
    const descriptionInput = document.getElementById("description");

    const formMessage = document.getElementById("formMessage");
    const saveButton = document.getElementById("saveProductBtn");
    const cancelEditButton = document.getElementById("cancelEditBtn");
    const clearFormButton = document.getElementById("clearFormBtn");

    const inventoryGrid = document.getElementById("inventoryGrid");
    const emptyState = document.getElementById("emptyState");
    const inventorySearch = document.getElementById("inventorySearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const availabilityFilter = document.getElementById("availabilityFilter");

    const numberFormat = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2
    });

    const currencyFormat = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });

    let products = [];

    const demoProducts = [
        {
            id: "INV-DEMO-1",
            name: "Wheat",
            category: "Grains",
            quantity: 250,
            price: 28,
            location: "Nanded, Maharashtra",
            harvestDate: "",
            availability: "Available",
            quality: "Standard",
            description: "Fresh wheat available for bulk orders."
        },
        {
            id: "INV-DEMO-2",
            name: "Tomato",
            category: "Vegetables",
            quantity: 18,
            price: 25,
            location: "Nanded, Maharashtra",
            harvestDate: "",
            availability: "Available",
            quality: "Premium",
            description: "Fresh tomatoes from the farm."
        },
        {
            id: "INV-DEMO-3",
            name: "Onion",
            category: "Vegetables",
            quantity: 100,
            price: 32,
            location: "Nanded, Maharashtra",
            harvestDate: "",
            availability: "Unavailable",
            quality: "Standard",
            description: "Currently unavailable for new orders."
        }
    ];

    function formatCurrency(value) {
        return currencyFormat.format(value);
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = "message " + type;
    }

    function hideMessage() {
        formMessage.textContent = "";
        formMessage.className = "message";
    }

    function saveProducts() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error("Unable to save inventory:", error);
            showMessage(
                "Inventory could not be saved. Browser storage may be unavailable.",
                "error"
            );
            return false;
        }
    }

    function loadProducts() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved !== null) {
                const parsed = JSON.parse(saved);

                if (!Array.isArray(parsed)) {
                    throw new Error("Invalid inventory data.");
                }

                products = parsed;
                return;
            }
        } catch (error) {
            console.error("Unable to load inventory:", error);
            products = [];
            showMessage(
                "Saved inventory could not be read. Please add your products again.",
                "error"
            );
            return;
        }

        products = demoProducts.map(function (product) {
            return { ...product };
        });

        saveProducts();
    }

    function updateStats() {
        const totalQuantity = products.reduce(function (total, product) {
            return total + Number(product.quantity || 0);
        }, 0);

        const availableCount = products.filter(function (product) {
            return product.availability === "Available";
        }).length;

        const lowStockCount = products.filter(function (product) {
            return (
                product.availability === "Available" &&
                Number(product.quantity) <= 20
            );
        }).length;

        document.getElementById("totalProducts").textContent = products.length;

        document.getElementById("totalStock").textContent =
            numberFormat.format(totalQuantity) + " kg";

        document.getElementById("availableProducts").textContent =
            availableCount;

        document.getElementById("lowStock").textContent =
            lowStockCount;
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function createProductCard(product) {
        const card = createElement("article", "product-card");

        const top = createElement("div", "product-top");
        const icon = createElement("div", "crop-icon", "🌾");

        const badge = createElement(
            "span",
            "availability-badge " +
                (product.availability === "Available"
                    ? "available"
                    : "unavailable"),
            product.availability
        );

        top.append(icon, badge);

        const content = createElement("div", "product-content");
        const name = createElement("h3", "", product.name);
        const category = createElement(
            "span",
            "category-label",
            product.category + " · " + product.quality
        );

        const price = createElement("div", "product-price");
        price.appendChild(
            document.createTextNode(formatCurrency(Number(product.price)))
        );
        price.appendChild(createElement("small", "", " / kg"));

        const location = createElement(
            "p",
            "product-detail",
            "📍 " + product.location
        );

        const stockLine = createElement("div", "stock-line");
        stockLine.appendChild(createElement("span", "", "Available stock"));

        const stock = createElement(
            "strong",
            Number(product.quantity) <= 20 &&
            product.availability === "Available"
                ? "low-stock"
                : "",
            numberFormat.format(Number(product.quantity)) + " kg"
        );

        stockLine.appendChild(stock);

        content.append(name, category, price, location, stockLine);

        if (product.harvestDate) {
            content.appendChild(
                createElement(
                    "p",
                    "product-detail",
                    "Harvest date: " + product.harvestDate
                )
            );
        }

        if (product.description) {
            content.appendChild(
                createElement(
                    "p",
                    "product-description",
                    product.description
                )
            );
        }

        const actions = createElement("div", "product-actions");

        const editButton = createElement("button", "edit-btn", "Edit");
        editButton.type = "button";
        editButton.addEventListener("click", function () {
            editProduct(product.id);
        });

        const toggleButton = createElement(
            "button",
            "toggle-btn",
            product.availability === "Available"
                ? "Mark Unavailable"
                : "Mark Available"
        );

        toggleButton.type = "button";
        toggleButton.addEventListener("click", function () {
            toggleAvailability(product.id);
        });

        const deleteButton = createElement("button", "delete-btn", "Delete");
        deleteButton.type = "button";
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + product.name
        );

        deleteButton.addEventListener("click", function () {
            deleteProduct(product.id);
        });

        actions.append(editButton, toggleButton, deleteButton);
        card.append(top, content, actions);

        return card;
    }

    function renderProducts() {
        const query = inventorySearch.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedAvailability = availabilityFilter.value;

        const filteredProducts = products.filter(function (product) {
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.location.toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            const matchesAvailability =
                selectedAvailability === "all" ||
                product.availability === selectedAvailability;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesAvailability
            );
        });

        inventoryGrid.replaceChildren();

        filteredProducts.forEach(function (product) {
            inventoryGrid.appendChild(createProductCard(product));
        });

        document.getElementById("inventoryCount").textContent =
            filteredProducts.length +
            (filteredProducts.length === 1 ? " product" : " products");

        emptyState.hidden = filteredProducts.length > 0;
        inventoryGrid.hidden = filteredProducts.length === 0;
    }

    function renderPage() {
        updateStats();
        renderProducts();
    }

    function resetFormState() {
        form.reset();
        productIdInput.value = "";
        formTitle.textContent = "Add a Product";
        saveButton.textContent = "Add Product";
        cancelEditButton.hidden = true;
        clearFormButton.hidden = false;
        hideMessage();
    }

    function editProduct(id) {
        const product = products.find(function (item) {
            return item.id === id;
        });

        if (!product) {
            showMessage("Product could not be found.", "error");
            return;
        }

        productIdInput.value = product.id;
        productNameInput.value = product.name;
        categoryInput.value = product.category;
        quantityInput.value = product.quantity;
        priceInput.value = product.price;
        locationInput.value = product.location;
        harvestDateInput.value = product.harvestDate || "";
        availabilityInput.value = product.availability;
        qualityInput.value = product.quality;
        descriptionInput.value = product.description || "";

        formTitle.textContent = "Edit Product";
        saveButton.textContent = "Save Changes";
        cancelEditButton.hidden = false;
        clearFormButton.hidden = true;

        hideMessage();

        formPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function toggleAvailability(id) {
        const product = products.find(function (item) {
            return item.id === id;
        });

        if (!product) {
            return;
        }

        const previousAvailability = product.availability;

        product.availability =
            previousAvailability === "Available"
                ? "Unavailable"
                : "Available";

        if (!saveProducts()) {
            product.availability = previousAvailability;
            return;
        }

        renderPage();
    }

    function deleteProduct(id) {
        const product = products.find(function (item) {
            return item.id === id;
        });

        if (!product) {
            return;
        }

        const confirmed = window.confirm(
            "Delete " + product.name + " from this demo inventory?"
        );

        if (!confirmed) {
            return;
        }

        const previousProducts = products.map(function (item) {
            return { ...item };
        });

        products = products.filter(function (item) {
            return item.id !== id;
        });

        if (!saveProducts()) {
            products = previousProducts;
            renderPage();
            return;
        }

        if (productIdInput.value === id) {
            resetFormState();
        }

        renderPage();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const quantity = Number(quantityInput.value);
        const price = Number(priceInput.value);

        if (!Number.isFinite(quantity) || quantity < 0) {
            showMessage("Enter a valid non-negative quantity.", "error");
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            showMessage("Price per kg must be greater than zero.", "error");
            return;
        }

        const editingId = productIdInput.value;

        const productData = {
            id: editingId || (
                "INV-" + Date.now() + "-" +
                Math.random().toString(36).slice(2, 7)
            ),
            name: productNameInput.value.trim(),
            category: categoryInput.value,
            quantity: quantity,
            price: price,
            location: locationInput.value.trim(),
            harvestDate: harvestDateInput.value,
            availability: availabilityInput.value,
            quality: qualityInput.value,
            description: descriptionInput.value.trim()
        };

        const previousProducts = products.map(function (item) {
            return { ...item };
        });

        if (editingId) {
            const index = products.findIndex(function (item) {
                return item.id === editingId;
            });

            if (index === -1) {
                showMessage("Product not found. Please refresh the page.", "error");
                return;
            }

            products[index] = productData;
        } else {
            products.unshift(productData);
        }

        if (!saveProducts()) {
            products = previousProducts;
            return;
        }

        resetFormState();
        renderPage();

        showMessage(
            editingId
                ? "Product details updated successfully."
                : "Product added to your demo inventory.",
            "success"
        );

        formPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    clearFormButton.addEventListener("click", function () {
        window.setTimeout(function () {
            productIdInput.value = "";
            formTitle.textContent = "Add a Product";
            saveButton.textContent = "Add Product";
            hideMessage();
        }, 0);
    });

    cancelEditButton.addEventListener("click", resetFormState);

    inventorySearch.addEventListener("input", renderProducts);
    categoryFilter.addEventListener("change", renderProducts);
    availabilityFilter.addEventListener("change", renderProducts);

    loadProducts();
    renderPage();
});