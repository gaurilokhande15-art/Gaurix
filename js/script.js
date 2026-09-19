

    /* =========================
       FARMER DASHBOARD
    ========================= */

    const addProductBtn = document.getElementById("addProductBtn");

    if (addProductBtn) {

        addProductBtn.addEventListener("click", function () {

            const inputs =
                document.querySelectorAll(".product-form input");

            const productName = inputs[0].value;
            const quantity = inputs[1].value;
            const price = inputs[2].value;
            const location = inputs[3].value;

            const quality =
                document.querySelector(".product-form select").value;

            const description =
                document.querySelector(".product-form textarea").value;


            if (
                productName === "" ||
                quantity === "" ||
                price === "" ||
                location === ""
            ) {

                alert("Please fill all required product details.");

                return;
            }


            const product = {

                name: productName,

                quantity: quantity,

                price: price,

                location: location,

                quality: quality,

                description: description

            };


           let products =
    JSON.parse(
        localStorage.getItem("farm2landProducts")
    ) || [];


         products.push(product);

// Save updated products
localStorage.setItem(
    "farm2landProducts",
    JSON.stringify(products)
);

alert("Product added successfully!");

window.location.href = "product-listing.html";

            alert("Product added successfully!");

            window.location.href = "product-listing.html";

        });

    }


/* =========================
   PRODUCT LISTING
========================= */

const productContainer =
    document.getElementById("productContainer");

if (productContainer) {

    const savedProducts =
        JSON.parse(
            localStorage.getItem("farm2landProducts")
        ) || [];

    if (savedProducts.length > 0) {

        productContainer.innerHTML =
            savedProducts.map((product, index) => `

                <div class="product-card">

                    <h2>${product.name}</h2>

                    <p>
                        <strong>Available:</strong>
                        ${product.quantity} kg
                    </p>

                    <p>
                        <strong>Price:</strong>
                        ₹${product.price} / kg
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${product.location}
                    </p>

                    <p>
                        <strong>Quality:</strong>
                        ${product.quality}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${product.description}
                    </p>

                    <button
                        type="button"
                        onclick="viewProduct(${index})">

                        View Details

                    </button>

                </div>

            `).join("");

    } else {

        productContainer.innerHTML = `
            <p>No products available yet.</p>
        `;

    }

}
function viewProduct(index) {

    const products =
        JSON.parse(
            localStorage.getItem("farm2landProducts")
        ) || [];

    if (!products[index]) {

        alert("Product not found.");
        return;

    }

    // Save selected product with its original index
    const selectedProduct = {
        ...products[index],
        productIndex: index
    };

    localStorage.setItem(
        "farm2landProduct",
        JSON.stringify(selectedProduct)
    );

    window.location.href =
        "product-details.html";
}
/* =========================
   FARMER MULTIPLE ORDER REQUESTS
   STEP 12.14.4
========================= */

const orderRequestContainer =
    document.getElementById("orderRequestContainer");

if (orderRequestContainer) {

    const orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];

    if (orders.length === 0) {

        orderRequestContainer.innerHTML = `
            <p>No new order requests.</p>
        `;

    } else {

        orderRequestContainer.innerHTML =
            orders.map((order, index) => {

                const orderValue =
                    Number(order.quantity) *
                    Number(order.price);

                const orderDate =
                    order.id && !isNaN(new Date(Number(order.id)).getTime())
                        ? new Date(Number(order.id)).toLocaleString()
                        : "N/A";

                const statusClass =
                    (order.status || "Pending").toLowerCase().replace(/\s+/g, "-");

                const financialOrderValue =
                    order.orderValue !== null && order.orderValue !== undefined
                        ? `₹${order.orderValue}`
                        : "Not available yet";

                const financialCommission =
                    order.commission !== null && order.commission !== undefined
                        ? `₹${order.commission}`
                        : "Not available yet";

                const financialCommissionRate =
                    order.commissionRate !== null && order.commissionRate !== undefined
                        ? `${order.commissionRate}%`
                        : "Not available yet";

                const financialFarmerAmount =
                    order.farmerAmount !== null && order.farmerAmount !== undefined
                        ? `₹${order.farmerAmount}`
                        : "Not available yet";

                return `

                    <div class="order-request-card" data-status="${order.status}">

                        <h3>
                            🌾 ${order.productName}
                        </h3>

                        <div class="order-section">
                            <h4>Order Information</h4>
                            <p>
                                <strong>Product Name:</strong>
                                ${order.productName}
                            </p>
                            <p>
                                <strong>Order ID:</strong>
                                CL-${order.id}
                            </p>
                            <p>
                                <strong>Order Date & Time:</strong>
                                ${orderDate}
                            </p>
                            <p>
                                <strong>Order Status:</strong>
                                <span class="status-badge status-${statusClass}">
                                    ${order.status}
                                </span>
                            </p>
                        </div>

                        <div class="order-section">
                            <h4>Order Details</h4>
                            <p>
                                <strong>Quantity:</strong>
                                ${order.quantity} kg
                            </p>
                            <p>
                                <strong>Price per kg:</strong>
                                ₹${order.price} / kg
                            </p>
                            <p>
                                <strong>Total Order Value:</strong>
                                ₹${order.orderValue || orderValue}
                            </p>
                        </div>

                        <div class="order-section">
                            <h4>Delivery / Location</h4>
                            <p>
                                <strong>Location:</strong>
                                ${order.location}
                            </p>
                            <p>
                                <strong>Quality:</strong>
                                ${order.quality}
                            </p>
                        </div>

                        <div class="my-order-card" data-status="${order.status}">
                            <h4>Financial Information</h4>
                            <p>
                                <strong>Order Value:</strong>
                                ${financialOrderValue}
                            </p>
                            <p>
                                <strong>CROPLAND Commission:</strong>
                                ${financialCommission}
                            </p>
                            <p>
                                <strong>Commission Rate:</strong>
                                ${financialCommissionRate}
                            </p>
                            <p>
                                <strong>Farmer Net Payout:</strong>
                                ${financialFarmerAmount}
                            </p>
                        </div>


                        ${
                            order.status === "Pending"

                            ? `

                                <div class="order-buttons">

                                    <button
                                        onclick="acceptMultipleOrder(${index})">

                                        Accept

                                    </button>

                                    <button
                                        onclick="rejectMultipleOrder(${index})">

                                        Reject

                                    </button>

                                </div>

                            `

                            : ""

                        }


                        ${
                            order.status === "Accepted"

                            ? `

                                <div class="confirmed-order">

                                    <h4>
                                        ✅ Order Accepted
                                    </h4>

                                    <p>
                                        <strong>
                                            Order Value:
                                        </strong>

                                        ₹${order.orderValue}
                                    </p>

                                    <p>
                                        <strong>
                                            CROPLAND Commission:
                                        </strong>

                                        ${order.commissionRate}%
                                    </p>

                                    <p>
                                        <strong>
                                            CROPLAND Revenue:
                                        </strong>

                                        ₹${Number(
                                            order.commission
                                        ).toFixed(2)}
                                    </p>

                                    <p>
                                        <strong>
                                            Farmer Amount:
                                        </strong>

                                        ₹${Number(
                                            order.farmerAmount
                                        ).toFixed(2)}
                                    </p>

                                    <button
                                        onclick="readyForDeliveryMultipleOrder(${index})">

                                        Ready for Delivery 🚚

                                    </button>

                                </div>

                            `

                            : ""

                        }


                        ${
                            order.status === "Rejected"

                            ? `

                                <div class="rejected-summary">

                                    <h4>
                                        ❌ Order Rejected
                                    </h4>

                                    <p>
                                        This order request was rejected.
                                    </p>

                                </div>

                            `

                            : ""

                        }


                        ${
                            order.status === "Ready for Delivery"

                            ? `

                                <div class="confirmed-order">

                                    <h4>
                                        🚚 Ready for Delivery
                                    </h4>

                                    <p>
                                        Order accepted and ready
                                        for delivery.
                                    </p>

                                </div>

                            `

                            : ""

                        }


                        ${
                            order.status === "Delivered"

                            ? `

                                <div class="delivered-summary">

                                    <h3>
                                        📦 Order Delivered Successfully! ✅
                                    </h3>

                                    <p>
                                        <strong>
                                            Order Value:
                                        </strong>
                                        ₹${order.orderValue}
                                    </p>

                                    <p>
                                        <strong>
                                            CROPLAND Commission Deducted:
                                        </strong>
                                        ₹${order.commission} (${order.commissionRate}%)
                                    </p>

                                    <p>
                                        <strong>
                                            Farmer Net Payout / Amount Credited:
                                        </strong>
                                        ₹${order.farmerAmount}
                                    </p>

                                </div>

                            `

                            : ""

                        }

                    </div>

                `;

            }).join("");

    }

}


/* =========================
   ACCEPT MULTIPLE ORDER
========================= */

function acceptMultipleOrder(index) {

    let orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];

    if (!orders[index]) {

        alert("Order information not found.");

        return;

    }

    const order = orders[index];

    const quantity =
        Number(order.quantity);

    const price =
        Number(order.price);

    const orderValue =
        quantity * price;


    /* =========================
       COMMISSION
    ========================= */

    let commissionRate;

    if (orderValue < 10000) {

        commissionRate = 1.5;

    } else if (orderValue <= 20000) {

        commissionRate = 3;

    } else {

        commissionRate = 5;

    }


    const commission =
        orderValue * (commissionRate / 100);

    const farmerAmount =
        orderValue - commission;


    /* =========================
       UPDATE PRODUCT STOCK
    ========================= */

    let products =
        JSON.parse(
            localStorage.getItem("farm2landProducts")
        ) || [];


    const productIndex =
        order.productIndex;


    if (
        productIndex !== undefined &&
        products[productIndex]
    ) {

        const availableQuantity =
            Number(
                products[productIndex].quantity
            );

        if (quantity > availableQuantity) {

            alert(
                "Order quantity is greater than current stock."
            );

            return;

        }


        products[productIndex].quantity =
            availableQuantity - quantity;


        localStorage.setItem(
            "farm2landProducts",
            JSON.stringify(products)
        );

    }


    /* =========================
       UPDATE ORDER
    ========================= */

    order.status = "Accepted";

    order.orderValue =
        orderValue;

    order.commissionRate =
        commissionRate;

    order.commission =
        commission;

    order.farmerAmount =
        farmerAmount;


    orders[index] =
        order;


    localStorage.setItem(
        "farm2landOrderRequests",
        JSON.stringify(orders)
    );


    alert(
        "Order accepted successfully! ✅"
    );


    location.reload();

}


/* =========================
   REJECT MULTIPLE ORDER
========================= */

function rejectMultipleOrder(index) {

    let orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];


    if (!orders[index]) {

        alert("Order information not found.");

        return;

    }


    orders[index].status =
        "Rejected";


    localStorage.setItem(
        "farm2landOrderRequests",
        JSON.stringify(orders)
    );


    alert(
        "Order request rejected."
    );


    location.reload();

}


/* =========================
   READY FOR DELIVERY
========================= */

function readyForDeliveryMultipleOrder(index) {

    let orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];


    if (!orders[index]) {

        alert("Order information not found.");

        return;

    }


    orders[index].status =
        "Ready for Delivery";


    localStorage.setItem(
        "farm2landOrderRequests",
        JSON.stringify(orders)
    );


    alert(
        "Order is ready for delivery! 🚚"
    );


    location.reload();

}
/* =========================
   SHOPKEEPER MY ORDERS
========================= */

/* =========================
   SHOPKEEPER MY ORDERS
   STEP 12.14.5
========================= */

const myOrdersContainer =
    document.getElementById("myOrdersContainer");

if (myOrdersContainer) {

    // Get all orders
    const orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];

    if (orders.length > 0) {

        myOrdersContainer.innerHTML =
            orders.map(order => {

                const orderValue =
                    Number(order.quantity) *
                    Number(order.price);

                const orderDate =
                    order.id && !isNaN(new Date(Number(order.id)).getTime())
                        ? new Date(Number(order.id)).toLocaleString()
                        : "N/A";

                const statusClass =
                    (order.status || "Pending").toLowerCase().replace(/\s+/g, "-");

                const financialOrderValue =
                    order.orderValue !== null && order.orderValue !== undefined
                        ? `₹${order.orderValue}`
                        : "Not available yet";

                const financialCommission =
                    order.commission !== null && order.commission !== undefined
                        ? `₹${order.commission}`
                        : "Not available yet";

                const financialCommissionRate =
                    order.commissionRate !== null && order.commissionRate !== undefined
                        ? `${order.commissionRate}%`
                        : "Not available yet";

                const financialFarmerAmount =
                    order.farmerAmount !== null && order.farmerAmount !== undefined
                        ? `₹${order.farmerAmount}`
                        : "Not available yet";

                return `

                <div class="my-order-card" data-status="${order.status}">

                    <h2>${order.productName}</h2>

                    <div class="order-section">
                        <h4>Order Information</h4>
                        <p>
                            <strong>Product Name:</strong>
                            ${order.productName}
                        </p>
                        <p>
                            <strong>Order ID:</strong>
                            CL-${order.id}
                        </p>
                        <p>
                            <strong>Order Date & Time:</strong>
                            ${orderDate}
                        </p>
                        <p>
                            <strong>Order Status:</strong>
                            <span class="status-badge status-${statusClass}">
                                ${order.status}
                            </span>
                        </p>
                    </div>

                    <div class="order-section">
                        <h4>Order Details</h4>
                        <p>
                            <strong>Quantity:</strong>
                            ${order.quantity} kg
                        </p>
                        <p>
                            <strong>Price per kg:</strong>
                            ₹${order.price} / kg
                        </p>
                        <p>
                            <strong>Total Order Value:</strong>
                            ₹${order.orderValue || orderValue}
                        </p>
                    </div>

                    <div class="order-section">
                        <h4>Delivery / Location</h4>
                        <p>
                            <strong>Location:</strong>
                            ${order.location}
                        </p>
                        <p>
                            <strong>Quality:</strong>
                            ${order.quality}
                        </p>
                    </div>

                    <div class="order-section">
                        <h4>Financial Information</h4>
                        <p>
                            <strong>Order Value:</strong>
                            ${financialOrderValue}
                        </p>
                        <p>
                            <strong>CROPLAND Commission:</strong>
                            ${financialCommission}
                        </p>
                        <p>
                            <strong>Commission Rate:</strong>
                            ${financialCommissionRate}
                        </p>
                        <p>
                            <strong>Farmer Net Payout:</strong>
                            ${financialFarmerAmount}
                        </p>
                    </div>


                    <!-- REJECTED ORDER -->

                    ${
                        order.status === "Rejected"
                        ? `

                            <div class="rejected-summary">

                                <h3>
                                    ❌ Order Rejected
                                </h3>

                                <p>
                                    The farmer is unable
                                    to accept this order.
                                </p>

                                <p>
                                    Please browse other
                                    available products.
                                </p>

                            </div>

                          `
                        : ""
                    }


                    <!-- READY FOR DELIVERY -->

                    ${
                        order.status === "Ready for Delivery"
                        ? `

                            <button
                                onclick="markMultipleOrderAsDelivered(${order.id})">

                                Mark as Delivered ✅

                            </button>

                          `
                        : ""
                    }


                    <!-- DELIVERED ORDER -->

                    ${
                        order.status === "Delivered"
                        ? `

                            <div class="delivered-summary">

                                <h3>
                                    📦 Order Delivered Successfully! ✅
                                </h3>

                                <p>
                                    Your order has been
                                    successfully delivered.
                                </p>

                                <p>
                                    <strong>
                                        Order Value:
                                    </strong>

                                    ₹${order.orderValue}
                                </p>

                            </div>

                          `
                        : ""
                    }

                </div>

            `;

        }).join("");

    } else {

        myOrdersContainer.innerHTML = `
            <p>No orders placed yet.</p>
        `;

    }

}


/* =========================
   MARK MULTIPLE ORDER
   AS DELIVERED
========================= */

function markMultipleOrderAsDelivered(orderId) {

    // Get all orders

    let orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];


    // Find selected order

    const orderIndex =
        orders.findIndex(
            order => order.id === orderId
        );


    if (orderIndex === -1) {

        alert("Order information not found.");

        return;

    }


    // Update only selected order

    orders[orderIndex].status =
        "Delivered";


    // Save updated orders

    localStorage.setItem(

        "farm2landOrderRequests",

        JSON.stringify(orders)

    );


    alert(
        "Order marked as delivered successfully! "
    );


    location.reload();

}

/* =========================
   SHOPKEEPER REGISTRATION
========================= */

const shopkeeperRegistrationForm =
    document.getElementById("shopkeeperRegistrationForm");

if (shopkeeperRegistrationForm) {

    shopkeeperRegistrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert("Shopkeeper account created successfully!");

            window.location.href =
                "shopkeeper-dashboard.html";

        }
    );

}

/* =========================
   MARK ORDER AS DELIVERED
========================= */

function markAsDelivered() {

    const savedRequest =
        localStorage.getItem("farm2landOrderRequest");

    if (!savedRequest) {
        alert("Order information not found.");
        return;
    }

    const order = JSON.parse(savedRequest);

    order.status = "Delivered";

    localStorage.setItem(
        "farm2landOrderRequest",
        JSON.stringify(order)
    );

    alert("Order marked as delivered successfully! ✅");

    location.reload();
}
/* =========================
   ESTIMATED ORDER VALUE
========================= */

function calculateEstimatedOrderValue(price) {

    const quantity =
        document.getElementById("requiredQuantity").value;

    const estimatedValue =
        Number(quantity) * Number(price);

    document.getElementById(
        "estimatedOrderValue"
    ).innerHTML = `
        <strong>Estimated Order Value:</strong>
        ₹${estimatedValue}
    `;
}

/* =========================
   MULTIPLE ORDER REQUESTS
   STEP 12.14.3
========================= */

const productDetailsContainer =
    document.getElementById("productDetails");

if (productDetailsContainer) {

    const selectedProduct =
        JSON.parse(
            localStorage.getItem("farm2landProduct")
        );

    if (selectedProduct) {

        productDetailsContainer.innerHTML = `

            <div class="product-details-card">

                <h1>${selectedProduct.name}</h1>

                <p>
                    <strong>Available Quantity:</strong>
                    ${selectedProduct.quantity} kg
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${selectedProduct.price} / kg
                </p>

                <p>
                    <strong>Location:</strong>
                    ${selectedProduct.location}
                </p>

                <p>
                    <strong>Quality:</strong>
                    ${selectedProduct.quality}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${selectedProduct.description}
                </p>

                <label>
                    Required Quantity (kg)
                </label>

                <input
                    type="number"
                    id="requiredQuantity"
                    min="1"
                    max="${selectedProduct.quantity}"
                    placeholder="Enter quantity"
                >

                <p id="estimatedOrderValue">
                    <strong>Estimated Order Value:</strong>
                    ₹0
                </p>

                <button
                    type="button"
                    onclick="requestMultipleOrder()">

                    Request Order

                </button>

            </div>

        `;

        const quantityInput =
            document.getElementById("requiredQuantity");

        quantityInput.addEventListener(
            "input",
            function () {

                const quantity =
                    Number(this.value);

                const price =
                    Number(selectedProduct.price);

                const estimatedValue =
                    quantity * price;

                document.getElementById(
                    "estimatedOrderValue"
                ).innerHTML = `

                    <strong>
                        Estimated Order Value:
                    </strong>

                    ₹${estimatedValue}

                `;

            }
        );

    } else {

        productDetailsContainer.innerHTML = `
            <p>Product information not found.</p>
        `;

    }

}


/* =========================
   CREATE MULTIPLE ORDER
========================= */

function requestMultipleOrder() {

    const selectedProduct =
        JSON.parse(
            localStorage.getItem("farm2landProduct")
        );

    if (!selectedProduct) {

        alert("Product information not found.");

        return;

    }

    const quantityInput =
        document.getElementById("requiredQuantity");

    const quantity =
        Number(quantityInput.value);

    const availableQuantity =
        Number(selectedProduct.quantity);

    if (!quantity || quantity <= 0) {

        alert("Please enter required quantity.");

        return;

    }

    if (quantity > availableQuantity) {

        alert(
            "Required quantity is greater than available stock."
        );

        return;

    }
const order = {

    id: Date.now(),

    productIndex:
        selectedProduct.productIndex,

    productName:
        selectedProduct.name,

    price:
        Number(selectedProduct.price),

    quantity:
        quantity,

    location:
        selectedProduct.location,

    quality:
        selectedProduct.quality,

    status:
        "Pending",

    orderValue:
        null,

    commissionRate:
        null,

    commission:
        null,

    farmerAmount:
        null

};
    

    /* Get existing orders */

    let orders =
        JSON.parse(
            localStorage.getItem(
                "farm2landOrderRequests"
            )
        ) || [];


    /* Add new order */

    orders.push(order);


    /* Save all orders */

    localStorage.setItem(

        "farm2landOrderRequests",

        JSON.stringify(orders)

    );


    alert(
        "Order request sent successfully! ✅"
    );


    window.location.href =
        "my-orders.html";

}
// ========================================
// ORDER STATUS FILTER - 12.14.11
// ========================================

function applyOrderFilter(filterId, containerId) {
    const filter = document.getElementById(filterId);
    const container = document.getElementById(containerId);

    if (!filter || !container) return;

    filter.addEventListener("change", function () {

        const selectedStatus = this.value;
        const cards = container.querySelectorAll("[data-status]");

        if (cards.length === 0) return;

        let visibleCount = 0;

        cards.forEach(card => {

            const cardStatus = card.dataset.status;

            if (selectedStatus === "All" || cardStatus === selectedStatus) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        let noResultsMessage =
            container.querySelector(".no-filter-results");

        if (visibleCount === 0) {

            if (!noResultsMessage) {

                noResultsMessage = document.createElement("p");

                noResultsMessage.className = "no-filter-results";

                noResultsMessage.textContent =
                    "No orders found for this status.";

                container.appendChild(noResultsMessage);
            }

        } else {

            if (noResultsMessage) {
                noResultsMessage.remove();
            }

        }

    });
}


// Farmer Dashboard Filter
applyOrderFilter(
    "farmerOrderFilter",
    "orderRequestContainer"
);


// Shopkeeper My Orders Filter
applyOrderFilter(
    "shopkeeperOrderFilter",
    "myOrdersContainer"
);



// ========================================
// ORDER SEARCH - 12.14.12
// ========================================

function applyOrderSearch(searchId, containerId) {

    const searchInput = document.getElementById(searchId);
    const container = document.getElementById(containerId);

    if (!searchInput || !container) return;

    searchInput.addEventListener("input", function () {

        const searchText = this.value.toLowerCase().trim();

        const cards = container.querySelectorAll("[data-status]");

        if (cards.length === 0) return;

        let visibleCount = 0;

        cards.forEach(card => {

            const productName =
                card.querySelector("h2")?.textContent.toLowerCase() || "";

            const cardText =
                card.textContent.toLowerCase();

            const orderIdMatch =
                cardText.includes(searchText);

            const productMatch =
                productName.includes(searchText);

            if (
                searchText === "" ||
                productMatch ||
                orderIdMatch
            ) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        let noResultsMessage =
            container.querySelector(".no-search-results");

        if (visibleCount === 0) {

            if (!noResultsMessage) {

                noResultsMessage = document.createElement("p");

                noResultsMessage.className =
                    "no-search-results";

                noResultsMessage.textContent =
                    "No orders found.";

                container.appendChild(noResultsMessage);
            }

        } else {

            if (noResultsMessage) {
                noResultsMessage.remove();
            }

        }

    });
}


// Farmer Dashboard Search
applyOrderSearch(
    "farmerOrderSearch",
    "orderRequestContainer"
);


// Shopkeeper My Orders Search
applyOrderSearch(
    "shopkeeperOrderSearch",
    "myOrdersContainer"
);

// ========================================
// COMBINED SEARCH + FILTER - 12.14.13
// ========================================

function applyCombinedOrderControls(
    searchId,
    filterId,
    containerId
) {
    const searchInput =
        document.getElementById(searchId);

    const filter =
        document.getElementById(filterId);

    const container =
        document.getElementById(containerId);

    if (!searchInput || !filter || !container) return;

    function updateOrderDisplay() {

        const searchText =
            searchInput.value.toLowerCase().trim();

        const selectedStatus =
            filter.value;

        const cards =
            container.querySelectorAll("[data-status]");

        let visibleCount = 0;

        cards.forEach(card => {

            const cardStatus =
                card.dataset.status;

            const cardText =
                card.textContent.toLowerCase();

            const statusMatch =
                selectedStatus === "All" ||
                cardStatus === selectedStatus;

            const searchMatch =
                searchText === "" ||
                cardText.includes(searchText);

            if (statusMatch && searchMatch) {

                card.style.display = "";
                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });

        let noResultsMessage =
            container.querySelector(
                ".no-combined-results"
            );

        if (visibleCount === 0 && cards.length > 0) {

            if (!noResultsMessage) {

                noResultsMessage =
                    document.createElement("p");

                noResultsMessage.className =
                    "no-combined-results";

                noResultsMessage.textContent =
                    "No matching orders found.";

                container.appendChild(
                    noResultsMessage
                );
            }

        } else {

            if (noResultsMessage) {
                noResultsMessage.remove();
            }

        }
    }

    searchInput.addEventListener(
        "input",
        updateOrderDisplay
    );

    filter.addEventListener(
        "change",
        updateOrderDisplay
    );
}


// Farmer Dashboard
applyCombinedOrderControls(
    "farmerOrderSearch",
    "farmerOrderFilter",
    "orderRequestContainer"
);


// Shopkeeper My Orders
applyCombinedOrderControls(
    "shopkeeperOrderSearch",
    "shopkeeperOrderFilter",
    "myOrdersContainer"
);

// ========================================
// ORDER SORTING - 12.14.14
// ========================================

function applyOrderSorting(sortId, containerId) {

    const sortSelect =
        document.getElementById(sortId);

    const container =
        document.getElementById(containerId);

    if (!sortSelect || !container) return;

    sortSelect.addEventListener("change", function () {

        const sortType = this.value;

        const cards =
            Array.from(
                container.querySelectorAll("[data-status]")
            );

        cards.sort((a, b) => {

            const orderIdA =
                a.textContent.match(/CL-(\d+)/)?.[1] || 0;

            const orderIdB =
                b.textContent.match(/CL-(\d+)/)?.[1] || 0;

            const valueA =
                Number(
                    a.textContent
                        .match(/Total Order Value:\s*₹([\d.]+)/)?.[1]
                    || 0
                );

            const valueB =
                Number(
                    b.textContent
                        .match(/Total Order Value:\s*₹([\d.]+)/)?.[1]
                    || 0
                );

            if (sortType === "newest") {
                return Number(orderIdB) - Number(orderIdA);
            }

            if (sortType === "oldest") {
                return Number(orderIdA) - Number(orderIdB);
            }

            if (sortType === "highValue") {
                return valueB - valueA;
            }

            if (sortType === "lowValue") {
                return valueA - valueB;
            }

            return 0;
        });

        cards.forEach(card => {
            container.appendChild(card);
        });

    });
}


// Farmer Dashboard
applyOrderSorting(
    "farmerOrderSort",
    "orderRequestContainer"
);


// Shopkeeper My Orders
applyOrderSorting(
    "shopkeeperOrderSort",
    "myOrdersContainer"
);

// ========================================
// ORDER COUNT SUMMARY - 12.14.15
// ========================================

function updateFarmerOrderCounts() {

    const orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];

    const total =
        orders.length;

    const pending =
        orders.filter(order =>
            order.status === "Pending"
        ).length;

    const accepted =
        orders.filter(order =>
            order.status === "Accepted"
        ).length;

    const rejected =
        orders.filter(order =>
            order.status === "Rejected"
        ).length;

    const ready =
        orders.filter(order =>
            order.status === "Ready for Delivery"
        ).length;

    const delivered =
        orders.filter(order =>
            order.status === "Delivered"
        ).length;


    const totalElement =
        document.getElementById("farmerTotalOrders");

    const pendingElement =
        document.getElementById("farmerPendingOrders");

    const acceptedElement =
        document.getElementById("farmerAcceptedOrders");

    const rejectedElement =
        document.getElementById("farmerRejectedOrders");

    const readyElement =
        document.getElementById("farmerReadyOrders");

    const deliveredElement =
        document.getElementById("farmerDeliveredOrders");


    if (totalElement)
        totalElement.textContent = total;

    if (pendingElement)
        pendingElement.textContent = pending;

    if (acceptedElement)
        acceptedElement.textContent = accepted;

    if (rejectedElement)
        rejectedElement.textContent = rejected;

    if (readyElement)
        readyElement.textContent = ready;

    if (deliveredElement)
        deliveredElement.textContent = delivered;
}


// Update counts when page loads
updateFarmerOrderCounts();

// ========================================
// SHOPKEEPER ORDER COUNT SUMMARY
// 12.14.15
// ========================================

function updateShopkeeperOrderCounts() {

    const orders =
        JSON.parse(
            localStorage.getItem("farm2landOrderRequests")
        ) || [];

    const total =
        orders.length;

    const pending =
        orders.filter(order =>
            order.status === "Pending"
        ).length;

    const accepted =
        orders.filter(order =>
            order.status === "Accepted"
        ).length;

    const rejected =
        orders.filter(order =>
            order.status === "Rejected"
        ).length;

    const ready =
        orders.filter(order =>
            order.status === "Ready for Delivery"
        ).length;

    const delivered =
        orders.filter(order =>
            order.status === "Delivered"
        ).length;


    const totalElement =
        document.getElementById("shopkeeperTotalOrders");

    const pendingElement =
        document.getElementById("shopkeeperPendingOrders");

    const acceptedElement =
        document.getElementById("shopkeeperAcceptedOrders");

    const rejectedElement =
        document.getElementById("shopkeeperRejectedOrders");

    const readyElement =
        document.getElementById("shopkeeperReadyOrders");

    const deliveredElement =
        document.getElementById("shopkeeperDeliveredOrders");


    if (totalElement)
        totalElement.textContent = total;

    if (pendingElement)
        pendingElement.textContent = pending;

    if (acceptedElement)
        acceptedElement.textContent = accepted;

    if (rejectedElement)
        rejectedElement.textContent = rejected;

    if (readyElement)
        readyElement.textContent = ready;

    if (deliveredElement)
        deliveredElement.textContent = delivered;
}


// Update counts when page loads
updateShopkeeperOrderCounts();

function applyOrderCountCardClicks(cardSelector, filterId) {
    const cards = document.querySelectorAll(
        `${cardSelector}[data-filter]`
    );

    const filter = document.getElementById(filterId);

    if (!filter) return;

    cards.forEach(card => {
        card.addEventListener("click", function () {

            const selectedFilter = this.dataset.filter || "All";

            filter.value = selectedFilter;

            filter.dispatchEvent(new Event("change"));

            const orderSection = filter.closest("section");

            if (orderSection) {
                orderSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

applyOrderCountCardClicks(
    ".order-count-clickable",
    "farmerOrderFilter"
);

applyOrderCountCardClicks(
    ".order-count-clickable",
    "shopkeeperOrderFilter"
);

function applyOrderCountCardClicks(cardSelector, filterId, containerId) {
    const cards = document.querySelectorAll(
        `${cardSelector}[data-filter]`
    );

    const filter = document.getElementById(filterId);
    const container = document.getElementById(containerId);

    if (!filter) return;

    cards.forEach(card => {
        card.addEventListener("click", function () {

            const selectedFilter = this.dataset.filter || "All";

            filter.value = selectedFilter;

            filter.dispatchEvent(new Event("change"));

            if (container) {
                container.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

applyOrderCountCardClicks(
    ".order-count-clickable",
    "farmerOrderFilter",
    "orderRequestContainer"
);

applyOrderCountCardClicks(
    ".order-count-clickable",
    "shopkeeperOrderFilter",
    "myOrdersContainer"
);