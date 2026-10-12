document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "croplandDeliveryDemo";

    const demoOrders = [
        {
            id: "CRP1001",
            crop: "Tomatoes",
            quantity: "50 kg",
            farmer: "Ramesh Patil",
            shopkeeper: "Fresh Mart",
            status: "transit",
            date: getDateOffset(2),
            location: "Demo delivery route",
            note: "Sample order currently shown as in transit.",
            steps: [true, true, true, false]
        },
        {
            id: "CRP1002",
            crop: "Onions",
            quantity: "100 kg",
            farmer: "Sunita Deshmukh",
            shopkeeper: "City Grocery",
            status: "confirmed",
            date: getDateOffset(4),
            location: "Demo dispatch location",
            note: "Sample order confirmed. Packing and dispatch are pending.",
            steps: [true, false, false, false]
        },
        {
            id: "CRP1003",
            crop: "Wheat",
            quantity: "200 kg",
            farmer: "Vijay More",
            shopkeeper: "Grain House",
            status: "packed",
            date: getDateOffset(3),
            location: "Demo dispatch location",
            note: "Sample order packed and awaiting dispatch.",
            steps: [true, true, false, false]
        },
        {
            id: "CRP1004",
            crop: "Potatoes",
            quantity: "75 kg",
            farmer: "Anita Jadhav",
            shopkeeper: "Daily Needs Store",
            status: "delivered",
            date: getDateOffset(-1),
            location: "Demo destination",
            note: "This sample order is marked as delivered.",
            steps: [true, true, true, true]
        }
    ];

    const statuses = {
        confirmed: "Order Confirmed",
        packed: "Packed",
        transit: "In Transit",
        delivered: "Delivered"
    };

    const stages = [
        {
            key: "confirmed",
            title: "Order Confirmed",
            description: "The order has been confirmed."
        },
        {
            key: "packed",
            title: "Order Packed",
            description: "The order is prepared for dispatch."
        },
        {
            key: "transit",
            title: "In Transit",
            description: "The order is on its delivery journey."
        },
        {
            key: "delivered",
            title: "Delivered",
            description: "The order has reached its destination."
        }
    ];

    const trackForm = document.getElementById("trackForm");
    const orderSearch = document.getElementById("orderSearch");
    const orderList = document.getElementById("orderList");
    const statusFilter = document.getElementById("statusFilter");
    const trackingDetails = document.getElementById("trackingDetails");
    const searchMessage = document.getElementById("searchMessage");

    function getDateOffset(offset) {
        const date = new Date();
        date.setDate(date.getDate() + offset);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString + "T12:00:00");

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function loadOrders() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

            if (Array.isArray(saved) && saved.length > 0) {
                return saved;
            }
        } catch (error) {
            // Use sample orders if saved demo data cannot be read.
        }

        return demoOrders.map(order => ({ ...order }));
    }

    let orders = loadOrders();

    function updateStats() {
        document.getElementById("totalOrders").textContent = orders.length;

        document.getElementById("transitOrders").textContent =
            orders.filter(order => order.status === "transit").length;

        document.getElementById("deliveredOrders").textContent =
            orders.filter(order => order.status === "delivered").length;
    }

    function createTextElement(tag, className, text) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        return element;
    }

    function renderOrders(list = orders) {
        orderList.replaceChildren();

        const filter = statusFilter.value;

        const filtered = list.filter(order =>
            filter === "all" || order.status === filter
        );

        document.getElementById("emptyOrders").hidden = filtered.length > 0;

        filtered.forEach(order => {
            const card = document.createElement("article");
            card.className = "order-card";

            const info = document.createElement("div");
            const top = document.createElement("div");
            top.className = "order-top";

            top.appendChild(
                createTextElement("h3", "", order.crop)
            );

            top.appendChild(
                createTextElement(
                    "span",
                    `status-pill status-${order.status}`,
                    statuses[order.status] || order.status
                )
            );

            info.appendChild(top);

            const meta = document.createElement("div");
            meta.className = "order-meta";

            [
                `Order ID: ${order.id}`,
                `Quantity: ${order.quantity}`,
                `Estimated delivery: ${formatDate(order.date)}`
            ].forEach(text => {
                meta.appendChild(createTextElement("span", "", text));
            });

            info.appendChild(meta);

            const button = createTextElement("button", "view-btn", "Track Order");
            button.type = "button";

            button.addEventListener("click", () => showOrderDetails(order));

            card.append(info, button);
            orderList.appendChild(card);
        });
    }

    function showOrderDetails(order) {
        trackingDetails.hidden = false;

        document.getElementById("detailTitle").textContent =
            `${order.crop} — ${statuses[order.status] || order.status}`;

        document.getElementById("detailSubtitle").textContent =
            `Tracking reference: ${order.id}`;

        document.getElementById("detailOrderId").textContent = order.id;
        document.getElementById("detailCrop").textContent = order.crop;
        document.getElementById("detailQuantity").textContent = order.quantity;
        document.getElementById("detailDate").textContent = formatDate(order.date);
        document.getElementById("detailFarmer").textContent = order.farmer;
        document.getElementById("detailShopkeeper").textContent = order.shopkeeper;

        const timeline = document.getElementById("timeline");
        timeline.replaceChildren();

        const currentIndex = stages.findIndex(
            stage => stage.key === order.status
        );

        stages.forEach((stage, index) => {
            const item = document.createElement("div");
            item.className = "timeline-step";

            if (index < currentIndex) {
                item.classList.add("completed");
            } else if (index === currentIndex) {
                item.classList.add("current");
            }

            item.appendChild(createTextElement("h4", "", stage.title));

            let description = stage.description;

            if (index < currentIndex) {
                description = "Completed in this demo timeline.";
            } else if (index === currentIndex) {
                description = "Current sample status.";
            } else {
                description = "Not yet completed in this demo.";
            }

            item.appendChild(createTextElement("p", "", description));
            timeline.appendChild(item);
        });

        document.getElementById("deliveryNote").textContent =
            `${order.note} Estimated delivery: ${formatDate(order.date)}.`;

        trackingDetails.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    trackForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = orderSearch.value.trim().toLowerCase();

        const order = orders.find(
            item => String(item.id).toLowerCase() === id
        );

        if (!order) {
            trackingDetails.hidden = true;
            searchMessage.textContent =
                "Order not found in demo data. Try CRP1001, CRP1002, CRP1003 or CRP1004.";
            return;
        }

        searchMessage.textContent = `Found order ${order.id}.`;
        statusFilter.value = "all";
        renderOrders();
        showOrderDetails(order);
    });

    document.getElementById("showAllBtn").addEventListener("click", function () {
        orderSearch.value = "";
        statusFilter.value = "all";
        searchMessage.textContent = "";
        trackingDetails.hidden = true;
        renderOrders();
    });

    statusFilter.addEventListener("change", function () {
        renderOrders();
    });

    updateStats();
    renderOrders();
});