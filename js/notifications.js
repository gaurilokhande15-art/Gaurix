const STORAGE_KEY = "croplandNotifications";

const defaultNotifications = [
    {
        id: "demo-order-1",
        type: "order",
        icon: "📦",
        title: "Order Accepted",
        message: "Your tomato order request has been accepted by the shopkeeper.",
        time: "Demo notification",
        read: false
    },
    {
        id: "demo-order-2",
        type: "order",
        icon: "🚚",
        title: "Order Ready for Delivery",
        message: "Your crop order is marked as ready for delivery.",
        time: "Demo notification",
        read: false
    },
    {
        id: "demo-crop-1",
        type: "crop",
        icon: "🌱",
        title: "Crop Plan Saved",
        message: "Your planned crop details are ready to review.",
        time: "Demo notification",
        read: true
    },
    {
        id: "demo-trader-1",
        type: "trader",
        icon: "🤝",
        title: "Trader Interest",
        message: "A trader has shown interest in your planned crop.",
        time: "Demo notification",
        read: false
    }
];

const notificationList = document.getElementById("notificationList");
const emptyState = document.getElementById("emptyState");
const filterSelect = document.getElementById("notificationFilter");

function loadNotifications() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored !== null) {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.warn("Could not read notifications from localStorage.");
    }

    return defaultNotifications.map(notification => ({ ...notification }));
}

let notifications = loadNotifications();

function saveNotifications() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.warn("Could not save notifications.");
    }
}

function updateSummary() {
    document.getElementById("totalCount").textContent =
        notifications.length;

    document.getElementById("unreadCount").textContent =
        notifications.filter(item => !item.read).length;

    document.getElementById("orderCount").textContent =
        notifications.filter(item => item.type === "order").length;
}

function createActionButton(label, action, id) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.id = id;

    return button;
}

function renderNotifications() {
    notificationList.replaceChildren();

    const filter = filterSelect.value;

    const filtered = notifications.filter(item => {
        if (filter === "unread") return !item.read;
        if (filter === "order") return item.type === "order";
        if (filter === "crop") return item.type === "crop";
        if (filter === "trader") return item.type === "trader";

        return true;
    });

    emptyState.hidden = filtered.length !== 0;

    filtered.forEach(item => {
        const card = document.createElement("article");
        card.className = `notification-item ${item.read ? "" : "unread"}`;

        const icon = document.createElement("div");
        icon.className = "notification-icon";
        icon.textContent = item.icon || "🔔";

        const content = document.createElement("div");
        content.className = "notification-content";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        if (!item.read) {
            const badge = document.createElement("span");
            badge.className = "unread-badge";
            badge.textContent = "Unread";
            heading.appendChild(badge);
        }

        const message = document.createElement("p");
        message.textContent = item.message;

        const time = document.createElement("span");
        time.className = "notification-time";
        time.textContent = item.time || "Recently";

        const actions = document.createElement("div");
        actions.className = "notification-actions";

        if (!item.read) {
            actions.appendChild(
                createActionButton("Mark as Read", "read", item.id)
            );
        }

        actions.appendChild(
            createActionButton("Dismiss", "dismiss", item.id)
        );

        content.append(heading, message, time, actions);
        card.append(icon, content);

        notificationList.appendChild(card);
    });

    updateSummary();
}

filterSelect.addEventListener("change", renderNotifications);

document.getElementById("markAllReadBtn").addEventListener("click", () => {
    notifications = notifications.map(item => ({
        ...item,
        read: true
    }));

    saveNotifications();
    renderNotifications();
});

document.getElementById("clearAllBtn").addEventListener("click", () => {
    const confirmed = window.confirm(
        "Are you sure you want to clear all notifications?"
    );

    if (!confirmed) return;

    notifications = [];
    saveNotifications();
    renderNotifications();
});

notificationList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "read") {
        notifications = notifications.map(item =>
            item.id === id ? { ...item, read: true } : item
        );
    }

    if (action === "dismiss") {
        notifications = notifications.filter(item => item.id !== id);
    }

    saveNotifications();
    renderNotifications();
});

saveNotifications();
renderNotifications();