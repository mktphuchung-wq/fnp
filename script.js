// --- DỮ LIỆU KHỞI TẠO (Mẫu) ---
const defaultData = {
    fixedCosts: [
        { id: 1, name: 'Thuê nhà', amount: 3000000 },
        { id: 2, name: 'Trả góp', amount: 1500000 }
    ],
    funds: [
        { id: 'f1', name: 'Sinh hoạt phí', percent: 50, balance: 0 },
        { id: 'f2', name: 'Tiết kiệm', percent: 20, balance: 0 },
        { id: 'f3', name: 'Hưởng thụ', percent: 10, balance: 0 },
        { id: 'f4', name: 'Đầu tư', percent: 20, balance: 0 }
    ],
    goals: [
        { id: 'g1', name: 'Mua Laptop', target: 20000000, current: 5000000 }
    ],
    transactions: []
};

// --- QUẢN LÝ APP STATE ---
let appData = JSON.parse(localStorage.getItem('flowfund_v2')) || defaultData;
let currentTransactionType = 'expense'; // 'expense' or 'income'

// --- UTILS ---
const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
const saveData = () => {
    localStorage.setItem('flowfund_v2', JSON.stringify(appData));
    renderAll();
};

// Tính toán chu kỳ (Ngày 10 -> Ngày 9 tháng sau)
const getCycleString = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    let startMonth = currentMonth;
    let startYear = currentYear;
    
    if (currentDay < 10) {
        startMonth = currentMonth - 1;
        if (startMonth === 0) { startMonth = 12; startYear--; }
    }
    
    let endMonth = startMonth + 1;
    let endYear = startYear;
    if (endMonth > 12) { endMonth = 1; endYear++; }

    return `Kỳ: 10/${startMonth} - 09/${endMonth}`;
};

// --- LOGIC CỐT LÕI: XỬ LÝ GIAO DỊCH ---

function handleTransaction(amount, note, fundId, type) {
    if (type === 'expense') {
        // CHI TIÊU: Trừ trực tiếp vào quỹ đã chọn
        const fund = appData.funds.find(f => f.id === fundId);
        if (fund) {
            fund.balance -= amount;
            // Ghi log
            appData.transactions.unshift({
                id: Date.now(), date: new Date().toLocaleDateString('vi-VN'),
                desc: note, amount: amount, type: 'expense', fundName: fund.name
            });
        }
    } else {
        // THU NHẬP: Logic phân bổ phức tạp
        // B1: Tính tổng chi phí cố định
        const totalFixed = appData.fixedCosts.reduce((sum, item) => sum + item.amount, 0);
        
        // B2: Trừ chi phí cố định
        const remaining = amount - totalFixed;
        
        // Ghi log thu nhập tổng
        appData.transactions.unshift({
            id: Date.now(), date: new Date().toLocaleDateString('vi-VN'),
            desc: `${note} (Tổng)`, amount: amount, type: 'income', fundName: 'Nguồn thu'
        });

        // Ghi log đã trừ cố định
        if (totalFixed > 0) {
             appData.transactions.unshift({
                id: Date.now() + 1, date: new Date().toLocaleDateString('vi-VN'),
                desc: 'Trừ Chi phí cố định tự động', amount: totalFixed, type: 'expense', fundName: 'Fixed Costs'
            });
        }

        // B3: Phân bổ phần dư vào các quỹ theo %
        if (remaining > 0) {
            appData.funds.forEach(fund => {
                const allocAmount = (remaining * fund.percent) / 100;
                fund.balance += allocAmount;
            });
        } else {
            alert(`Thu nhập không đủ trả chi phí cố định! Thiếu: ${formatMoney(Math.abs(remaining))}`);
        }
    }
    saveData();
}

// --- RENDER GIAO DIỆN ---

function renderAll() {
    renderHeader();
    renderDashboard();
    renderSettings();
    renderPlans();
    renderHistory();
}

function renderHeader() {
    document.getElementById('current-cycle').innerText = getCycleString();
    
    // Tính tổng số dư thực tế
    const totalBalance = appData.funds.reduce((sum, f) => sum + f.balance, 0);
    document.getElementById('grand-total').innerText = formatMoney(totalBalance);
    
    // Thống kê sơ bộ từ transaction (lọc đơn giản)
    // Lưu ý: Đây là thống kê all-time trong bản demo này, thực tế có thể lọc theo kỳ
    let totalIn = appData.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    let totalOut = appData.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    document.getElementById('stat-income').innerText = formatMoney(totalIn);
    document.getElementById('stat-expense').innerText = formatMoney(totalOut);
}

function renderDashboard() {
    const list = document.getElementById('funds-list');
    list.innerHTML = '';
    
    // Sắp xếp quỹ: Quỹ nào nhiều tiền lên đầu (hoặc tùy ý)
    appData.funds.forEach(fund => {
        // Giả sử max bar là 10tr để hiển thị thanh process cho đẹp
        const maxRef = 10000000; 
        const percentFill = Math.min(100, Math.max(0, (fund.balance / maxRef) * 100));
        
        list.innerHTML += `
            <div class="fund-card" style="border-left-color: ${getColor(fund.id)}">
                <div class="fund-header">
                    <span class="fund-name">${fund.name}</span>
                    <span class="fund-percent">${fund.percent}%</span>
                </div>
                <div style="font-size: 1.5rem; font-weight:bold;">${formatMoney(fund.balance)}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentFill}%; background-color: ${getColor(fund.id)}"></div>
                </div>
            </div>
        `;
    });
}

function renderSettings() {
    // 1. Fixed Costs
    const fixedList = document.getElementById('fixed-cost-list');
    fixedList.innerHTML = '';
    appData.fixedCosts.forEach((item, index) => {
        fixedList.innerHTML += `
            <li>
                <span>${item.name} <small>(${formatMoney(item.amount)})</small></span>
                <button class="btn-delete" onclick="deleteFixed(${index})"><i class="fas fa-trash"></i></button>
            </li>
        `;
    });

    // 2. Funds
    const fundList = document.getElementById('fund-settings-list');
    fundList.innerHTML = '';
    let totalP = 0;
    appData.funds.forEach((item, index) => {
        totalP += item.percent;
        fundList.innerHTML += `
            <li>
                <span>${item.name} <b>${item.percent}%</b></span>
                <button class="btn-delete" onclick="deleteFund(${index})"><i class="fas fa-trash"></i></button>
            </li>
        `;
    });
    
    document.getElementById('total-percent').innerText = totalP + "%";
    document.getElementById('percent-warning').style.display = totalP !== 100 ? 'inline' : 'none';
}

function renderPlans() {
    const list = document.getElementById('goals-list');
    list.innerHTML = '';
    appData.goals.forEach(g => {
        const p = Math.min(100, (g.current / g.target) * 100);
        list.innerHTML += `
            <div class="goal-card">
                <div class="fund-header">
                    <span class="fund-name">${g.name}</span>
                    <small>${formatMoney(g.current)} / ${formatMoney(g.target)}</small>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${p}%; background: var(--accent);"></div>
                </div>
            </div>
        `;
    });
}

function renderHistory() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';
    // Lấy 20 giao dịch gần nhất
    appData.transactions.slice(0, 20).forEach(t => {
        list.innerHTML += `
            <li class="history-item">
                <div class="h-left">
                    <h4>${t.desc}</h4>
                    <small>${t.date} • ${t.fundName}</small>
                </div>
                <div class="amount ${t.type === 'expense' ? 'neg' : 'pos'}">
                    ${t.type === 'expense' ? '-' : '+'}${formatMoney(t.amount)}
                </div>
            </li>
        `;
    });
}

// --- USER ACTIONS ---

// Tabs
function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
}

// Modal Logic
function openTransactionModal() {
    document.getElementById('modal-transaction').style.display = 'flex';
    // Render select options for Funds
    const select = document.getElementById('trans-fund-select');
    select.innerHTML = '';
    appData.funds.forEach(f => {
        select.innerHTML += `<option value="${f.id}">${f.name} (Dư: ${formatMoney(f.balance)})</option>`;
    });
    setType('expense'); // Default
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function setType(type) {
    currentTransactionType = type;
    document.getElementById('btn-expense').className = type === 'expense' ? 'type-btn active' : 'type-btn';
    document.getElementById('btn-income').className = type === 'income' ? 'type-btn active' : 'type-btn';
    
    // Ẩn chọn quỹ nếu là thu nhập
    document.getElementById('fund-selector-group').style.display = type === 'expense' ? 'block' : 'none';
}

// Save Transaction
function saveTransaction() {
    const amount = parseFloat(document.getElementById('trans-amount').value);
    const note = document.getElementById('trans-note').value || 'Không có ghi chú';
    const fundId = document.getElementById('trans-fund-select').value;
    
    if (!amount || amount <= 0) return alert('Nhập số tiền hợp lệ');
    
    handleTransaction(amount, note, fundId, currentTransactionType);
    
    document.getElementById('trans-amount').value = '';
    document.getElementById('trans-note').value = '';
    closeModal('modal-transaction');
}

// Settings Actions
function addFixedCost() {
    const name = document.getElementById('new-fixed-name').value;
    const amount = parseFloat(document.getElementById('new-fixed-amount').value);
    if(name && amount) {
        appData.fixedCosts.push({ id: Date.now(), name, amount });
        document.getElementById('new-fixed-name').value = '';
        document.getElementById('new-fixed-amount').value = '';
        saveData();
    }
}
function deleteFixed(index) { appData.fixedCosts.splice(index, 1); saveData(); }

function addNewFund() {
    const name = document.getElementById('new-fund-name').value;
    const percent = parseFloat(document.getElementById('new-fund-percent').value);
    if(name && percent) {
        appData.funds.push({ id: 'f' + Date.now(), name, percent, balance: 0 });
        document.getElementById('new-fund-name').value = '';
        document.getElementById('new-fund-percent').value = '';
        saveData();
    }
}
function deleteFund(index) {
    if(confirm('Xóa quỹ này sẽ mất số dư trong đó?')) {
        appData.funds.splice(index, 1);
        saveData();
    }
}

// Goal Actions
function openGoalModal() { document.getElementById('modal-goal').style.display = 'flex'; }
function addGoal() {
    const name = document.getElementById('goal-name').value;
    const target = parseFloat(document.getElementById('goal-target').value);
    const current = parseFloat(document.getElementById('goal-current').value) || 0;
    if(name && target) {
        appData.goals.push({ id: 'g'+Date.now(), name, target, current });
        saveData();
        closeModal('modal-goal');
    }
}

function resetAllData() {
    if(confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu về mặc định?')) {
        localStorage.removeItem('flowfund_v2');
        location.reload();
    }
}

// Helper Color
function getColor(id) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let num = id.toString().charCodeAt(id.length - 1);
    return colors[num % colors.length];
}

// Init
renderAll();
