// --- Cấu hình Quỹ mặc định ---
const defaultFunds = [
    { id: 'f1', name: 'Thiết yếu', percent: 50, balance: 0, color: '#f87171' }, // Đỏ nhạt
    { id: 'f2', name: 'Giáo dục', percent: 10, balance: 0, color: '#fbbf24' },  // Vàng
    { id: 'f3', name: 'Hưởng thụ', percent: 10, balance: 0, color: '#c084fc' }, // Tím
    { id: 'f4', name: 'Đầu tư', percent: 20, balance: 0, color: '#4ade80' },    // Xanh lá
    { id: 'f5', name: 'Thiện nguyện', percent: 10, balance: 0, color: '#38bdf8' } // Xanh dương
];

// --- State Management ---
let funds = JSON.parse(localStorage.getItem('flowfund_funds')) || defaultFunds;
let transactions = JSON.parse(localStorage.getItem('flowfund_trans')) || [];

// --- Utilities ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const saveData = () => {
    localStorage.setItem('flowfund_funds', JSON.stringify(funds));
    localStorage.setItem('flowfund_trans', JSON.stringify(transactions));
    renderApp();
};

// --- Core Logic ---

// 1. Phân bổ thu nhập (Logic cốt lõi)
function allocateIncome(amount) {
    if (amount <= 0) return alert("Vui lòng nhập số tiền hợp lệ!");

    funds.forEach(fund => {
        const amountToAdd = (amount * fund.percent) / 100;
        fund.balance += amountToAdd;
    });

    addTransaction(`Phân bổ thu nhập`, amount, 'income', 'Tất cả');
    saveData();
    alert("Đã phân bổ thành công!");
    document.getElementById('income-input').value = '';
}

// 2. Chốt kỳ & Tái phân bổ (Logic Rollover)
function rolloverFunds() {
    const confirmRollover = confirm("Bạn có chắc muốn gom toàn bộ số dư hiện tại để phân bổ lại như thu nhập mới?");
    if (!confirmRollover) return;

    let totalRemaining = 0;
    funds.forEach(fund => {
        totalRemaining += fund.balance;
        fund.balance = 0; // Reset về 0
    });

    // Lấy thêm tiền từ input nếu có (Ví dụ: Lương mới + Số dư cũ)
    const newIncomeInput = parseFloat(document.getElementById('income-input').value) || 0;
    const totalToAllocate = totalRemaining + newIncomeInput;

    if (totalToAllocate > 0) {
        funds.forEach(fund => {
            const amountToAdd = (totalToAllocate * fund.percent) / 100;
            fund.balance += amountToAdd;
        });
        
        addTransaction(`Tái phân bổ cuối kỳ (Dư cũ: ${formatCurrency(totalRemaining)})`, totalToAllocate, 'income', 'System');
        alert(`Đã tái phân bổ tổng: ${formatCurrency(totalToAllocate)}`);
    } else {
        alert("Không có số dư để tái phân bổ.");
    }
    
    document.getElementById('income-input').value = '';
    saveData();
}

// 3. Thêm giao dịch chi tiêu
function addTransaction(desc, amount, type, fundName) {
    const trans = {
        id: Date.now(),
        date: new Date().toLocaleDateString('vi-VN'),
        desc,
        amount,
        type,
        fundName
    };
    transactions.unshift(trans); // Thêm vào đầu mảng
}

// --- DOM Rendering ---

function renderApp() {
    renderDashboard();
    renderHistory();
    renderSelectOptions();
}

function renderDashboard() {
    const fundsContainer = document.getElementById('funds-container');
    const totalBalanceEl = document.getElementById('total-balance');
    
    let totalBalance = 0;
    fundsContainer.innerHTML = '';

    funds.forEach(fund => {
        totalBalance += fund.balance;

        const card = document.createElement('div');
        card.className = 'fund-card';
        card.innerHTML = `
            <div class="fund-header">
                <span class="fund-name" style="color: ${fund.color}">${fund.name}</span>
                <span class="fund-percent">${fund.percent}%</span>
            </div>
            <h3>${formatCurrency(fund.balance)}</h3>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${Math.min(100, (fund.balance > 0 ? 50 : 0))}%; background-color: ${fund.color}"></div>
            </div>
        `;
        fundsContainer.appendChild(card);
    });

    totalBalanceEl.innerText = formatCurrency(totalBalance);
}

function renderHistory() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    transactions.slice(0, 10).forEach(t => { // Chỉ hiện 10 giao dịch gần nhất
        const li = document.createElement('li');
        li.className = 'trans-item';
        li.innerHTML = `
            <div class="trans-info">
                <h4>${t.desc}</h4>
                <span>${t.date} • ${t.fundName}</span>
            </div>
            <div class="trans-amount ${t.type === 'income' ? 'pos' : 'neg'}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
        `;
        list.appendChild(li);
    });
}

function renderSelectOptions() {
    const select = document.getElementById('expense-fund-select');
    select.innerHTML = '';
    funds.forEach(fund => {
        const option = document.createElement('option');
        option.value = fund.id;
        option.innerText = `${fund.name} (Còn: ${formatCurrency(fund.balance)})`;
        select.appendChild(option);
    });
}

// --- Event Listeners ---

// Navigation Tabs
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// Allocate Button
document.getElementById('allocate-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('income-input').value);
    allocateIncome(amount);
});

// Rollover Button
document.getElementById('rollover-btn').addEventListener('click', rolloverFunds);

// Modal Logic
const modal = document.getElementById('transaction-modal');
const fab = document.getElementById('fab-add');
const closeBtn = document.querySelector('.close-modal');

fab.onclick = () => { renderSelectOptions(); modal.style.display = "flex"; }
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// Save Expense
document.getElementById('save-transaction-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const desc = document.getElementById('expense-desc').value;
    const fundId = document.getElementById('expense-fund-select').value;

    if (!amount || amount <= 0) return alert("Nhập số tiền hợp lệ");

    const fund = funds.find(f => f.id === fundId);
    if (fund) {
        fund.balance -= amount;
        addTransaction(desc, amount, 'expense', fund.name);
        saveData();
        modal.style.display = "none";
        // Clear inputs
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-desc').value = '';
    }
});

// Reset Data (Cho mục đích test)
document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm('Xóa toàn bộ dữ liệu?')) {
        localStorage.removeItem('flowfund_funds');
        localStorage.removeItem('flowfund_trans');
        location.reload();
    }
});

// Init
renderApp();
