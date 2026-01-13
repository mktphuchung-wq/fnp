// Dữ liệu lưu trữ
let funds = JSON.parse(localStorage.getItem('funds')) || [
  { name: 'Chi tiêu hàng ngày', balance: 0, allocated: 0 },
  { name: 'Tiết kiệm', balance: 0, allocated: 0 },
  { name: 'Du lịch', balance: 0, allocated: 0 },
  { name: 'Khác', balance: 0, allocated: 0 }
];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentIncome = parseFloat(localStorage.getItem('currentIncome')) || 0;

// Hàm lưu dữ liệu
function saveData() {
  localStorage.setItem('funds', JSON.stringify(funds));
  localStorage.setItem('transactions', JSON.stringify(transactions));
  localStorage.setItem('currentIncome', currentIncome);
}

// Cập nhật tổng quan
function updateDashboard() {
  const totalExpense = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
  const balance = currentIncome - totalExpense;

  document.getElementById('total-income').textContent = currentIncome.toLocaleString('vi-VN') + ' ₫';
  document.getElementById('total-expense').textContent = totalExpense.toLocaleString('vi-VN') + ' ₫';
  document.getElementById('balance').textContent = balance.toLocaleString('vi-VN') + ' ₫';

  const overview = document.getElementById('funds-overview');
  overview.innerHTML = '';
  funds.forEach(f => {
    const pct = currentIncome > 0 ? (f.allocated / currentIncome * 100).toFixed(0) : 0;
    const used = f.allocated - f.balance;
    const usedPct = f.allocated > 0 ? (used / f.allocated * 100).toFixed(0) : 0;
    overview.innerHTML += `
      <div class="fund-card">
        <p><strong>${f.name}</strong> - ${f.balance.toLocaleString('vi-VN')} ₫</p>
        <p>Đã phân bổ: ${f.allocated.toLocaleString('vi-VN')} ₫ (${pct}%)</p>
        <div class="progress"><div class="progress-bar" style="width:${usedPct}%"></div></div>
      </div>`;
  });

  // Giao dịch gần nhất
  const recent = document.getElementById('recent-transactions');
  recent.innerHTML = transactions.slice(-5).reverse().map(t => `
    <li class="${t.type}">
      ${t.date}: ${t.amount.toLocaleString('vi-VN')} ₫ - ${t.category} (${t.note ? t.note : ''})
    </li>`).join('');
}

// Cập nhật danh sách quỹ & chọn quỹ cho giao dịch
function updateFundsList() {
  const list = document.getElementById('funds-list');
  list.innerHTML = funds.map(f => `
    <div class="fund-card">
      <p><strong>${f.name}</strong> - ${f.balance.toLocaleString('vi-VN')} ₫</p>
      <p>Đã phân bổ: ${f.allocated.toLocaleString('vi-VN')} ₫</p>
    </div>`).join('');

  const select = document.getElementById('trans-fund');
  select.innerHTML = '<option value="">Chọn quỹ</option>' + funds.map(f => `<option value="${f.name}">${f.name}</option>`).join('');
}

// Xử lý tab
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const tab = btn.dataset.tab;
    document.getElementById(tab).classList.add('active');
    btn.classList.add('active');
  });
});

// Nhập thu nhập
document.getElementById('income-form').addEventListener('submit', e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('income-amount').value);
  if (isNaN(amount) || amount <= 0) return alert('Số tiền không hợp lệ');
  currentIncome += amount;
  const source = document.getElementById('income-source').value;
  transactions.push({ date: new Date().toLocaleDateString('vi-VN'), amount, type: 'income', category: source, note: 'Thu nhập mới' });
  saveData();
  updateDashboard();
  updateFundsList();

  // Chuẩn bị phân bổ
  const allocate = document.getElementById('allocate-fields');
  allocate.innerHTML = funds.map(f => `
    <label>${f.name} (% hoặc số tiền):</label>
    <input type="number" class="alloc-input" data-name="${f.name}" min="0" placeholder="0" />
  `).join('');
  document.getElementById('allocate-form').style.display = 'block';
  document.getElementById('income-form').reset();
});

// Phân bổ quỹ
document.getElementById('allocate-form').addEventListener('submit', e => {
  e.preventDefault();
  let totalAlloc = 0;
  document.querySelectorAll('.alloc-input').forEach(input => {
    const val = parseFloat(input.value) || 0;
    const name = input.dataset.name;
    const fund = funds.find(f => f.name === name);
    fund.allocated += val;
    fund.balance += val;
    totalAlloc += val;
  });
  if (totalAlloc > currentIncome) {
    alert('Tổng phân bổ vượt quá thu nhập!');
    return;
  }
  saveData();
  updateDashboard();
  updateFundsList();
  alert('Phân bổ thành công!');
  document.getElementById('allocate-form').style.display = 'none';
});

// Thêm giao dịch
document.getElementById('transaction-form').addEventListener('submit', e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('trans-amount').value);
  if (isNaN(amount) || amount <= 0) return alert('Số tiền không hợp lệ');
  const type = document.getElementById('trans-type').value;
  const category = document.getElementById('trans-category').value;
  const fundName = document.getElementById('trans-fund').value;
  const note = document.getElementById('trans-note').value;

  if (type === 'expense' && !fundName) return alert('Chọn quỹ cho chi tiêu');

  if (type === 'expense') {
    const fund = funds.find(f => f.name === fundName);
    if (fund.balance < amount) return alert('Quỹ không đủ!');
    fund.balance -= amount;
  }

  transactions.push({
    date: new Date().toLocaleDateString('vi-VN'),
    amount,
    type,
    category,
    fund: fundName || '',
    note
  });
  saveData();
  updateDashboard();
  updateFundsList();
  document.getElementById('all-transactions').innerHTML = transactions.map(t => `
    <li class="${t.type}">
      ${t.date}: ${t.amount.toLocaleString('vi-VN')} ₫ - ${t.category} (${t.note ? t.note : ''}) ${t.fund ? `[${t.fund}]` : ''}
    </li>`).join('');
  document.getElementById('transaction-form').reset();
});

// Kết thúc kỳ
document.getElementById('end-period').addEventListener('click', () => {
  if (confirm('Kết thúc kỳ? Số dư sẽ được giữ lại và cộng vào thu nhập kỳ sau.')) {
    funds.forEach(f => {
      currentIncome += f.balance; // Cộng dư vào thu nhập kỳ mới
      f.balance = 0; // Reset quỹ cho kỳ mới
    });
    saveData();
    updateDashboard();
    updateFundsList();
    alert('Kỳ đã kết thúc. Số dư được chuyển sang thu nhập kỳ mới.');
  }
});

// Khởi tạo ban đầu
updateDashboard();
updateFundsList();
document.getElementById('allocate-form').style.display = 'none';
