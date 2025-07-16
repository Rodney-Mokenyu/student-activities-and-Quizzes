"use strict";
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // Your code here
    console.log('DOM fully loaded and parsed');
    // get table elements
    const tableOverlayDiv = document.getElementById('tables-overlay');
    const table_1 = document.getElementById("table1");
    const cards = document.querySelectorAll('.card');
    const tables = document.querySelectorAll('.table');
    // Show table overlay on card click
    /* document.querySelectorAll('.card-btn').forEach(card => {
         card.addEventListener('click', function() {
             const tableId = this.getAttribute('data-table');
             document.getElementById('tables-overlay').style.display = 'block';
             document.querySelectorAll('#tables-overlay table').forEach(tbl => tbl.classList.add('d-none'));
             document.getElementById(tableId).classList.remove('d-none');
         });
     });*/
    // table-overlay close button
    (_a = document.getElementById('close-table-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        if (tableOverlayDiv) {
            tableOverlayDiv.classList.toggle('d-none');
        }
        else {
            console.error("Overlay div not found");
        }
        document.querySelectorAll('#tables-overlay table').forEach(tbl => tbl.classList.add('d-none'));
    });
    // FUNCTIONS
    function showTable(index) {
        var _a;
        const tableOverlayDiv = document.getElementById('tables-overlay');
        const tables = document.querySelectorAll('.table');
        // Show overlay
        tableOverlayDiv === null || tableOverlayDiv === void 0 ? void 0 : tableOverlayDiv.classList.remove("d-none");
        // Hide all tables
        tables.forEach(tbl => tbl.classList.add("d-none"));
        // Show the one at this index
        (_a = tables[index]) === null || _a === void 0 ? void 0 : _a.classList.remove("d-none");
    }
    // Helper function to call fetch() based on  table's url
    function fetchTableData(table_Url, table) {
        let spinner = null;
        let spinnerTimeout;
        // Schedule spinner to show only if loading takes longer than 200ms
        spinnerTimeout = window.setTimeout(() => {
            var _a;
            spinner = document.createElement("div");
            spinner.className = "spinner-border text-primary";
            spinner.setAttribute("role", "status");
            spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
            (_a = table.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(spinner, table);
        }, 200);
        fetch(table_Url)
            .then(response => {
            clearTimeout(spinnerTimeout); // Cancel spinner if fetch is fast
            if (!response.ok)
                throw new Error("Failed to load JSON file");
            return response.json();
        })
            .then((data) => {
            var _a;
            const tbody = document.createElement("tbody");
            data.forEach((item) => {
                const tr = document.createElement("tr");
                const tdNumber = document.createElement("td");
                tdNumber.textContent = item.Number.toString();
                const tdName = document.createElement("td");
                tdName.textContent = item["Student Name"];
                const tdScore = document.createElement("td");
                tdScore.textContent = item.Score !== null ? item.Score.toString() : '';
                const tdRemark = document.createElement("td");
                tdRemark.innerHTML = getBadge(item.Score);
                tr.appendChild(tdNumber);
                tr.appendChild(tdName);
                tr.appendChild(tdScore);
                tr.appendChild(tdRemark);
                tbody.appendChild(tr);
            });
            (_a = table.querySelector("tbody")) === null || _a === void 0 ? void 0 : _a.remove();
            table.appendChild(tbody);
        })
            .catch(error => {
            alert("Error loading or processing JSON: " + error.message);
        })
            .then(() => {
            if (spinner)
                spinner.remove(); // Remove spinner only if it was shown
        });
    }
    // Helper function to return a badge based on score
    function getBadge(score) {
        if (score === null || score === undefined) {
            return '<span class="badge bg-secondary">N/A</span>';
        }
        else if (score == 20) {
            return '<span class="badge bg-success">Excellent</span>';
        }
        else if (score >= 16) {
            return '<span class="badge bg-success">Very good</span>';
        }
        else if (score >= 13) {
            return '<span class="badge bg-warning text-dark">Good</span>';
        }
        else if (score >= 10) {
            return '<span class="badge bg-warning text-dark">you can do beter</span>';
        }
        else if (score >= 8) {
            return '<span class="badge bg-info text-dark">Work hard</span>';
        }
        else {
            return '<span class="badge bg-danger">Work harder</span>';
        }
    }
    // Fetching all tables from their various json files
    const tableDataUrls = [
        "./testData/grade_1.json",
        "./testData/grade_2.json",
        "./testData/grade_3.json",
        "./testData/grade_4.json",
        "./testData/grade_5.json",
        "./testData/grade_6.json", // <-- FIXED
    ];
    // Grade 6 json table
    /*   fetch("tests/testData/grade_6.json")
        .then(response => {
            if (!response.ok) {
            throw new Error('Failed to load JSON file');
            }
            return response.json();
        })
        .then((data:Student[]) => {
            // Reference to table (assumes table already exists in HTML)
            const table = document.querySelector("table");

            // Create tbody
            const tbody = document.createElement("tbody");

            // Loop through each item and build a table row
            data.forEach((item:Student) => {
            const tr = document.createElement("tr");

            // Number cell
            const tdNumber = document.createElement("td");
            tdNumber.textContent = item.Number.toString();

            // Name cell
            const tdName = document.createElement("td");
            tdName.textContent = item["Student Name"];

            // Score cell
            const tdScore = document.createElement("td");
            tdScore.textContent = item.Score !== null ? item.Score.toString() : '';

            // Remark cell
            const tdRemark = document.createElement("td");
            tdRemark.innerHTML = getBadge(item.Score);

            // Append all cells to the row
            tr.appendChild(tdNumber);
            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            tr.appendChild(tdRemark);

            // Append the row to tbody
            tbody.appendChild(tr);
            });

            // Append tbody to table
            if (table) {
                table.appendChild(tbody);
                } else {
                console.error("Table element not found in the DOM.");
            }

        })  */
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            showTable(i); // Show the correct table
            const targetTable = tables[i];
            const url = tableDataUrls[i];
            if (targetTable && url) {
                fetchTableData(url, targetTable);
            }
            else {
                console.error("Table or URL not found for index:", i);
            }
        });
    });
});
