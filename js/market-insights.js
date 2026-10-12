document.addEventListener("DOMContentLoaded", function () {
    const crops = [
        {
            name: "Tomato",
            category: "Vegetable",
            price: 1800,
            trend: "up",
            history: [1400, 1500, 1450, 1600, 1550, 1700, 1800]
        },
        {
            name: "Onion",
            category: "Vegetable",
            price: 2200,
            trend: "down",
            history: [2500, 2450, 2400, 2350, 2300, 2250, 2200]
        },
        {
            name: "Potato",
            category: "Vegetable",
            price: 1600,
            trend: "stable",
            history: [1550, 1600, 1580, 1620, 1590, 1610, 1600]
        },
        {
            name: "Wheat",
            category: "Grain",
            price: 2600,
            trend: "up",
            history: [2300, 2350, 2400, 2380, 2500, 2550, 2600]
        },
        {
            name: "Rice",
            category: "Grain",
            price: 3200,
            trend: "stable",
            history: [3100, 3150, 3180, 3150, 3200, 3190, 3200]
        },
        {
            name: "Banana",
            category: "Fruit",
            price: 2400,
            trend: "up",
            history: [2100, 2200, 2150, 2250, 2300, 2350, 2400]
        },
        {
            name: "Mango",
            category: "Fruit",
            price: 4500,
            trend: "down",
            history: [5200, 5000, 4900, 4800, 4700, 4600, 4500]
        },
        {
            name: "Tur Dal",
            category: "Pulse",
            price: 7500,
            trend: "up",
            history: [6900, 7000, 7100, 7050, 7200, 7400, 7500]
        }
    ];

    const searchInput = document.getElementById("cropSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const tableBody = document.getElementById("cropTableBody");
    const emptyMessage = document.getElementById("emptyMessage");
    const chartCrop = document.getElementById("chartCrop");
    const priceChart = document.getElementById("priceChart");

    const formatPrice = value =>
        "₹" + Number(value).toLocaleString("en-IN");

    function renderStats() {
        const highest = Math.max(...crops.map(crop => crop.price));
        const average = Math.round(
            crops.reduce((sum, crop) => sum + crop.price, 0) / crops.length
        );

        document.getElementById("cropCount").textContent = crops.length;
        document.getElementById("highestPrice").textContent = formatPrice(highest);
        document.getElementById("averagePrice").textContent = formatPrice(average);
    }

    function getFilteredCrops() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        const sort = sortFilter.value;

        let result = crops.filter(crop => {
            const matchesName = crop.name.toLowerCase().includes(query);
            const matchesCategory =
                category === "all" || crop.category === category;

            return matchesName && matchesCategory;
        });

        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }

    function renderTable() {
        const filtered = getFilteredCrops();

        tableBody.replaceChildren();
        emptyMessage.hidden = filtered.length !== 0;

        filtered.forEach(crop => {
            const row = document.createElement("tr");

            const trendLabels = {
                up: "↑ Increasing",
                down: "↓ Decreasing",
                stable: "↔ Stable"
            };

            const trendClasses = {
                up: "trend-up",
                down: "trend-down",
                stable: "trend-stable"
            };

            const cells = [
                { text: crop.name, className: "crop-name" },
                { text: crop.category, className: "" },
                { text: formatPrice(crop.price), className: "" },
                {
                    text: trendLabels[crop.trend],
                    className: trendClasses[crop.trend]
                }
            ];

            cells.forEach(cellData => {
                const cell = document.createElement("td");
                cell.textContent = cellData.text;

                if (cellData.className) {
                    cell.className = cellData.className;
                }

                if (cellData.text === crop.category) {
                    const pill = document.createElement("span");
                    pill.className = "category-pill";
                    pill.textContent = crop.category;
                    cell.replaceChildren(pill);
                }

                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const button = document.createElement("button");

            button.type = "button";
            button.className = "compare-btn";
            button.textContent = "View Trend";

            button.addEventListener("click", function () {
                chartCrop.value = crop.name;
                renderChart();
                document.querySelector(".chart-card").scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });

            actionCell.appendChild(button);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    }

    function populateChartOptions() {
        crops.forEach(crop => {
            const option = document.createElement("option");
            option.value = crop.name;
            option.textContent = crop.name;
            chartCrop.appendChild(option);
        });
    }

    function renderChart() {
        const crop = crops.find(item => item.name === chartCrop.value);

        if (!crop) {
            priceChart.replaceChildren();
            return;
        }

        document.getElementById("chartTitle").textContent =
            crop.name + " Price Trend";

        const values = crop.history;
        const width = 720;
        const height = 260;
        const left = 65;
        const right = 20;
        const top = 20;
        const bottom = 45;

        const min = Math.min(...values) * 0.92;
        const max = Math.max(...values) * 1.08;
        const plotWidth = width - left - right;
        const plotHeight = height - top - bottom;

        const x = index =>
            left + index * (plotWidth / (values.length - 1));

        const y = value =>
            top + ((max - value) / (max - min)) * plotHeight;

        const points = values.map((value, index) =>
            `${x(index)},${y(value)}`
        ).join(" ");

        const grid = [0, 1, 2, 3].map(index => {
            const gridY = top + index * plotHeight / 3;
            const labelValue = max - index * (max - min) / 3;

            return `
                <line x1="${left}" y1="${gridY}"
                      x2="${width - right}" y2="${gridY}"
                      stroke="#e7ddd1" stroke-dasharray="4 4"/>
                <text x="${left - 10}" y="${gridY + 4}"
                      text-anchor="end" font-size="11" fill="#786f65">
                    ${Math.round(labelValue).toLocaleString("en-IN")}
                </text>
            `;
        }).join("");

        const circles = values.map((value, index) => `
            <circle cx="${x(index)}" cy="${y(value)}" r="4"
                    fill="#79543a">
                <title>Week ${index + 1}: ${formatPrice(value)}</title>
            </circle>
        `).join("");

        const labels = values.map((value, index) => `
            <text x="${x(index)}" y="${height - 15}"
                  text-anchor="middle" font-size="11" fill="#786f65">
                W${index + 1}
            </text>
        `).join("");

        priceChart.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}"
                 role="img"
                 aria-label="${crop.name} illustrative weekly prices in rupees per quintal">
                ${grid}
                <polyline points="${points}"
                    fill="none"
                    stroke="#79543a"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
                ${circles}
                ${labels}
            </svg>
        `;
    }

    function resetFilters() {
        searchInput.value = "";
        categoryFilter.value = "all";
        sortFilter.value = "default";
        renderTable();
    }

    searchInput.addEventListener("input", renderTable);
    categoryFilter.addEventListener("change", renderTable);
    sortFilter.addEventListener("change", renderTable);
    chartCrop.addEventListener("change", renderChart);

    document.getElementById("resetFilters").addEventListener(
        "click",
        resetFilters
    );

    renderStats();
    populateChartOptions();
    renderTable();
    renderChart();
});