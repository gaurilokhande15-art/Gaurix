document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "croplandEarningsDemoOrders";

    const tableBody = document.getElementById("ordersTableBody");
    const searchInput = document.getElementById("orderSearch");
    const statusFilter = document.getElementById("statusFilter");
    const emptyState = document.getElementById("emptyState");
    const resultsCount = document.getElementById("resultsCount");
    const resetButton = document.getElementById("resetDemoBtn");

    const demoOrders = [
        {
            id: "CP-DEMO-101",
            crop: "Wheat",
            buyer: "Demo Buyer A",
            amount: 12000,
            status: "Delivered"
        },
        {
            id: "CP-DEMO-102",
            crop: "Tomato",
            buyer: "Demo Buyer B",
            amount: 8500,
            status: "Pending"
        },
        {
            id: "CP-DEMO-103",
            crop: "Onion",
            buyer: "Demo Buyer C",
            amount: 18000,
            status: "Delivered"
        },
        {
            id: "CP-DEMO-104",
            crop: "Rice",
            buyer: "Demo Buyer D",
            amount: 15000,
            status: "Accepted"
        },
        {
            id: "CP-DEMO-105",
            crop: "Tomato",
            buyer: "Demo Buyer E",
            amount: 9500,
            status: "Ready for Delivery"
        }
    ];

    let orders = [];

    // Demo commission rule:
    // Under ₹10,000: 1.5%
    // ₹10,000 to ₹20,000: 3%
    // Above ₹20,000: 5%
    // These are the current illustrative CROPLAND demo assumptions.
    function getCommissionRate(amount) {
        if (amount < 10000) {
            return 0.015;
        }

        if (amount <= 20000) {
            return 0.03;
        }

        return 0.05;
    }

    function getCommission(amount) {
        return amount * getCommissionRate(amount);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount);
    }

    function loadDemoOrders() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (
                    Array.isArray(parsed) &&
                    parsed.every(function (order) {
                        return (
                            order &&
                            typeof order.id === "string" &&
                            typeof order.crop === "string" &&
                            typeof order.buyer === "string" &&
                            Number.isFinite(Number(order.amount)) &&
                            Number(order.amount) >= 0 &&
                            typeof order.status === "string"
                        );
                    })
                ) {
                    orders = parsed.map(function (order) {
                        return {
                            ...order,
                            amount: Number(order.amount)
                        };
                    });

                    return;
                }
            }
        } catch (error) {
            console.error("Could not load earnings demo data:", error);
        }

        orders = demoOrders.map(function (order) {
            return { ...order };
        });

        saveDemoOrders();
    }

    function saveDemoOrders() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        } catch (error) {
            console.error("Could not save earnings demo data:", error);
        }
    }

    function updateStats() {
        const deliveredOrders = orders.filter(function (order) {
            return order.status === "Delivered";
        });

        const pendingOrders = orders.filter(function (order) {
            return order.status !== "Delivered";
        });

        const totalSales = deliveredOrders.reduce(function (total, order) {
            return total + order.amount;
        }, 0);

        const commission = deliveredOrders.reduce(function (total, order) {
            return total + getCommission(order.amount);
        }, 0);

        const netEarnings = totalSales - commission;

        document.getElementById("netEarnings").textContent =
            formatCurrency(netEarnings);

        document.getElementById("totalSales").textContent =
            formatCurrency(totalSales);

        document.getElementById("completedOrders").textContent =
            deliveredOrders.length;

        document.getElementById("pendingOrders").textContent =
            pendingOrders.length;

        document.getElementById("breakdownSales").textContent =
            formatCurrency(totalSales);

        document.getElementById("commissionAmount").textContent =
            formatCurrency(commission);

        document.getElementById("breakdownNet").textContent =
            formatCurrency(netEarnings);
    }

    function getStatusClass(status) {
        switch (status) {
            case "Delivered":
                return "delivered";
            case "Pending":
                return "pending";
            case "Accepted":
                return "accepted";
            case "Ready for Delivery":
                return "ready";
            default:
                return "";
        }
    }

    function createCell(text, className) {
        const cell = document.createElement("td");
        cell.textContent = text;

        if (className) {
            cell.className = className;
        }

        return cell;
    }

    function renderOrders() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;

        const filteredOrders = orders.filter(function (order) {
            const matchesSearch =
                order.crop.toLowerCase().includes(query) ||
                order.buyer.toLowerCase().includes(query) ||
                order.id.toLowerCase().includes(query);

            const matchesStatus =
                selectedStatus === "all" ||
                order.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        tableBody.replaceChildren();

        filteredOrders.forEach(function (order) {
            const row = document.createElement("tr");

            row.appendChild(createCell(order.id, "order-id"));
            row.appendChild(createCell(order.crop));
            row.appendChild(createCell(order.buyer));
            row.appendChild(createCell(formatCurrency(order.amount)));

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className =
                "status " + getStatusClass(order.status);

            statusBadge.textContent = order.status;

            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            const netAmount =
                order.status === "Delivered"
                    ? order.amount - getCommission(order.amount)
                    : null;

            row.appendChild(
                createCell(
                    netAmount === null
                        ? "Not finalized"
                        : formatCurrency(netAmount)
                )
            );

            tableBody.appendChild(row);
        });

        emptyState.hidden = filteredOrders.length !== 0;
        tableBody.parentElement.hidden = filteredOrders.length === 0;

        resultsCount.textContent =
            "Showing " + filteredOrders.length +
            " of " + orders.length + " demo orders";
    }

    function renderPage() {
        updateStats();
        renderOrders();
    }

    searchInput.addEventListener("input", renderOrders);
    statusFilter.addEventListener("change", renderOrders);

    resetButton.addEventListener("click", function () {
        const confirmed = window.confirm(
            "Reset the earnings page to its original sample data?"
        );

        if (!confirmed) {
            return;
        }

        orders = demoOrders.map(function (order) {
            return { ...order };
        });

        saveDemoOrders();

        searchInput.value = "";
        statusFilter.value = "all";

        renderPage();
    });

    loadDemoOrders();
    renderPage();
});