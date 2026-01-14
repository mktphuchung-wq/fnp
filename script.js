:root {
    --bg-color: #0f172a; /* Navy đậm */
    --card-bg: #1e293b;   /* Navy sáng hơn */
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent: #38bdf8;    /* Xanh dương sáng */
    --success: #4ade80;   /* Xanh lá */
    --danger: #f87171;    /* Đỏ */
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: var(--font-family);
    padding-bottom: 80px; /* Chừa chỗ cho menu dưới */
}

.app-container {
    max-width: 480px;
    margin: 0 auto;
    background-color: var(--bg-color);
    min-height: 100vh;
    position: relative;
}

/* Header */
header {
    padding: 20px;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.total-balance-card {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    padding: 25px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.total-balance-card p { color: #e0e7ff; font-size: 0.9rem; }
.total-balance-card h2 { font-size: 2rem; margin-top: 5px; }

/* Tabs Logic */
.tab-content { display: none; padding: 20px; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Funds Grid */
.funds-grid {
    display: grid;
    gap: 15px;
}

.fund-card {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
}

.fund-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.fund-name { font-weight: bold; }
.fund-percent { font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; }

.progress-bar-bg {
    height: 8px;
    background-color: rgba(255,255,255,0.1);
    border-radius: 4px;
    margin-top: 10px;
    overflow: hidden;
}

.progress-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

/* Buttons & Inputs */
.input-group { margin-bottom: 15px; }
.input-group label { display: block; margin-bottom: 5px; color: var(--text-secondary); }
input, select {
    width: 100%;
    padding: 12px;
    background: var(--card-bg);
    border: 1px solid #334155;
    color: white;
    border-radius: 10px;
    margin-bottom: 10px;
    font-size: 1rem;
}

.primary-btn {
    width: 100%;
    padding: 14px;
    background-color: var(--success);
    color: #064e3b;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
}

.secondary-btn {
    width: 100%;
    padding: 14px;
    background-color: var(--accent);
    color: #0c4a6e;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
}

.desc-text { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 10px; }

/* History List */
#transaction-list { list-style: none; }
.trans-item {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.trans-info h4 { font-size: 1rem; margin-bottom: 4px; }
.trans-info span { font-size: 0.8rem; color: var(--text-secondary); }
.trans-amount { font-weight: bold; }
.trans-amount.neg { color: var(--danger); }
.trans-amount.pos { color: var(--success); }

/* Floating Button */
.fab {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: var(--accent);
    border: none;
    box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);
    font-size: 1.5rem;
    color: #0f172a;
    cursor: pointer;
    z-index: 100;
}

/* Bottom Nav */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: var(--card-bg);
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #334155;
    z-index: 99;
}

.nav-item {
    background: none;
    border: none;
    color: var(--text-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    cursor: pointer;
}

.nav-item i { font-size: 1.2rem; margin-bottom: 4px; }
.nav-item.active { color: var(--accent); }

/* Modal */
.modal {
    display: none;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 200;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: var(--bg-color);
    padding: 25px;
    border-radius: 20px;
    width: 90%;
    max-width: 400px;
    position: relative;
    border: 1px solid #334155;
}
.close-modal {
    position: absolute; right: 20px; top: 15px;
    font-size: 1.5rem; cursor: pointer;
}
