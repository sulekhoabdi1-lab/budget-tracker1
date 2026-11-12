
const BUDGET = 2000;

const form = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const totalExpensesElement = document.getElementById("total-expenses");
const remainingElement = document.getElementById("remaining");
const budgetElement = document.getElementById("budget");
const expenseList = document.getElementById("expense-list");
const recordCount = document.getElementById("record-count");
const message = document.getElementById("message");

let expenses = [];

try {
    expenses = JSON.parse(localStorage.getItem("budgetExpenses")) || [];
    if (!Array.isArray(expenses)) expenses = [];
} catch {
    expenses = [];
}

function saveExpenses() {
    localStorage.setItem("budgetExpenses", JSON.stringify(expenses));
}

function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function updateSummary() {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remaining = BUDGET - total;

    budgetElement.textContent = formatMoney(BUDGET);
    totalExpensesElement.textContent = formatMoney(total);
    remainingElement.textContent = formatMoney(remaining);

    remainingElement.classList.toggle("over-budget", remaining < 0);
}

function renderExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-row";
        cell.textContent = "No expenses added yet.";

        row.appendChild(cell);
        expenseList.appendChild(row);
    }

    expenses.forEach((item) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const categoryCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "category";
        badge.textContent = item.category;
        categoryCell.appendChild(badge);

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(item.date);

        const amountCell = document.createElement("td");
        amountCell.className = "amount";
        amountCell.textContent = formatMoney(item.amount);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteExpense(item.id);
        });

        actionCell.appendChild(deleteButton);
        row.append(nameCell, categoryCell, dateCell, amountCell, actionCell);
        expenseList.appendChild(row);
    });

    recordCount.textContent = expenses.length + " Records";
    updateSummary();
}

function deleteExpense(id) {
    expenses = expenses.filter(item => item.id !== id);
    saveExpenses();
    renderExpenses();
    message.textContent = "Expense deleted successfully.";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = expenseInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!name || !category || !date || !Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Please enter valid details.";
        return;
    }

    const newExpense = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(newExpense);
    saveExpenses();
    renderExpenses();

    form.reset();
    message.textContent = "Expense added successfully!";
});

renderExpenses();
