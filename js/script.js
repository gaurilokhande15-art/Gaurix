

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

                return `

                    <div class="order-request-card">

                        <h3>
                            🌾 ${order.productName}
                        </h3>

                        <p>
                            <strong>Quantity:</strong>
                            ${order.quantity} kg
                        </p>

                        <p>
                            <strong>Price:</strong>
                            ₹${order.price} / kg
                        </p>

                        <p>
                            <strong>Order Value:</strong>
                            ₹${order.orderValue || orderValue}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${order.location}
                        </p>

                        <p>
                            <strong>Quality:</strong>
                            ${order.quality}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${order.status}
                        </p>


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
            orders.map(order => `

                <div class="my-order-card">

                    <h2>${order.productName}</h2>

                    <p>
                        <strong>Quantity:</strong>
                        ${order.quantity} kg
                    </p>

                    <p>
                        <strong>Price:</strong>
                        ₹${order.price} / kg
                    </p>

                    <p>
                        <strong>Order Value:</strong>
                        ₹${
                            order.orderValue ||
                            (order.quantity * order.price)
                        }
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${order.location}
                    </p>

                    <p>
                        <strong>Quality:</strong>
                        ${order.quality}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${order.status}
                    </p>


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

            `).join("");

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