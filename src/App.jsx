import { useEffect, useMemo, useState } from 'react';
import BalanceSummary from './components/BalanceSummary';
import TransactionForm from './components/TransactionForm';
import './styles.css';

const STORAGE_KEY = 'my_transactions';

function readTransactions() {
  try {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    if (!savedTransactions) return [];

    const parsedTransactions = JSON.parse(savedTransactions);
    if (!Array.isArray(parsedTransactions)) {
      throw new Error('Data transaksi tersimpan bukan sebuah daftar.');
    }

    return parsedTransactions.filter(
      (transaction) =>
        transaction &&
        typeof transaction.title === 'string' &&
        Number.isFinite(Number(transaction.amount)) &&
        Number(transaction.amount) > 0 &&
        ['income', 'expense'].includes(transaction.type),
    );
  } catch (error) {
    console.error('Gagal membaca transaksi tersimpan:', error);
    return [];
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTransactionDate(date) {
  if (!date) return 'Tanggal tidak tersedia';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Tanggal tidak tersedia';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function App() {
  const [transactions, setTransactions] = useState(readTransactions);
  const [usdRate, setUsdRate] = useState(null);
  const [rateStatus, setRateStatus] = useState('loading');
  const [storageError, setStorageError] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const controller = new AbortController();

    async function loadExchangeRate() {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Layanan kurs merespons dengan status ${response.status}.`);
        }

        const data = await response.json();
        const rate = data?.rates?.IDR;
        if (data?.result !== 'success' || !Number.isFinite(rate)) {
          throw new Error('Data kurs rupiah tidak tersedia.');
        }

        setUsdRate(rate);
        setRateStatus('ready');
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Gagal mengambil kurs USD:', error);
        setRateStatus('error');
      }
    }

    loadExchangeRate();
    return () => controller.abort();
  }, []);

  const saveTransactions = (nextTransactions) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTransactions));
      setStorageError(false);
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
      setStorageError(true);
    }
  };

  const visibleTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('id-ID');

    return transactions.filter((transaction) => {
      const matchesSearch = transaction.title
        .toLocaleLowerCase('id-ID')
        .includes(normalizedSearch);
      const matchesFilter =
        activeFilter === 'all' || transaction.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, search, transactions]);

  const addTransaction = (newTransaction) => {
    const updatedTransactions = [newTransaction, ...transactions];
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id,
    );
    saveTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
  };

  const [today] = useState(
    () =>
      new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="Dompetku, ke dashboard">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4.5 7.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2H18" />
              <path d="M16 12h4.5v4H16a2 2 0 1 1 0-4Z" />
              <path d="M16.5 14h.01" />
            </svg>
          </span>
          <span className="brand-name">dompet<span>ku</span></span>
        </a>

        <p className="sidebar-label">MENU UTAMA</p>
        <nav className="sidebar-nav" aria-label="Menu utama">
          <a className="nav-link is-active" href="#dashboard">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </svg>
            <span>Dasbor</span>
          </a>
          <a className="nav-link" href="#transactions">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 3.5h7l4 4v13h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
              <path d="M14 3.5v4h4M8 12h8M8 16h8" />
            </svg>
            <span>Transaksi</span>
            {transactions.length > 0 && (
              <span className="nav-count">{transactions.length}</span>
            )}
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon" aria-hidden="true">✦</span>
            <p className="tip-title">Catat, pantau, tumbuh.</p>
            <p className="tip-copy">Kebiasaan kecil hari ini, berdampak besar esok hari.</p>
          </div>
          <div className="profile-card">
            <div className="profile-avatar" aria-hidden="true">A</div>
            <div className="profile-details">
              <strong>Pengguna</strong>
              <span>Keuangan pribadi</span>
            </div>
            <span className="profile-menu" aria-hidden="true">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Halaman</span>
            <span className="breadcrumb-divider">/</span>
            <strong>Dasbor</strong>
          </div>
          <div className="topbar-meta">
            <span className={`rate-pill rate-${rateStatus}`}>
              <span className="status-dot" aria-hidden="true" />
              {rateStatus === 'ready'
                ? `1 USD = ${formatCurrency(usdRate)}`
                : rateStatus === 'loading'
                  ? 'Memuat kurs USD'
                  : 'Kurs USD tidak tersedia'}
            </span>
            <span className="topbar-divider" aria-hidden="true" />
            <time className="today-label">{today}</time>
          </div>
        </header>

        <section className="page-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">RINGKASAN KEUANGAN</p>
            <h1 id="page-title">Selamat datang kembali <span>👋</span></h1>
            <p className="intro-copy">Ini gambaran singkat kondisi keuanganmu hari ini.</p>
          </div>
          <a className="intro-action" href="#add-transaction">
            <span aria-hidden="true">＋</span> Catat transaksi
          </a>
        </section>

        {storageError && (
          <p className="notice notice-error" role="alert">
            Transaksi belum tersimpan di perangkat ini. Periksa ruang penyimpanan browser kamu.
          </p>
        )}

        <BalanceSummary transactions={transactions} formatCurrency={formatCurrency} />

        <section className="workspace-grid" aria-label="Transaksi keuangan">
          <section className="transactions-panel panel" id="transactions">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">AKTIVITAS TERBARU</p>
                <h2>Riwayat transaksi</h2>
              </div>
              <span className="transaction-count">
                {transactions.length} transaksi
              </span>
            </div>

            <div className="transaction-toolbar">
              <label className="search-field">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <input
                  type="search"
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Cari transaksi"
                />
              </label>
              <div className="filter-group" aria-label="Filter transaksi">
                {[
                  ['all', 'Semua'],
                  ['income', 'Masuk'],
                  ['expense', 'Keluar'],
                ].map(([filter, label]) => (
                  <button
                    className={`filter-button${activeFilter === filter ? ' is-selected' : ''}`}
                    key={filter}
                    type="button"
                    aria-pressed={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {visibleTransactions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">
                  {transactions.length === 0 ? '✦' : '⌕'}
                </span>
                <h3>
                  {transactions.length === 0
                    ? 'Belum ada transaksi'
                    : 'Transaksi tidak ditemukan'}
                </h3>
                <p>
                  {transactions.length === 0
                    ? 'Mulai catat pemasukan dan pengeluaranmu di sini.'
                    : 'Coba kata kunci atau filter yang berbeda.'}
                </p>
              </div>
            ) : (
              <ul className="transaction-list">
                {visibleTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'income';

                  return (
                    <li className="transaction-item" key={transaction.id}>
                      <span
                        className={`transaction-icon ${isIncome ? 'icon-income' : 'icon-expense'}`}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24" fill="none">
                          {isIncome ? (
                            <path d="M12 19V5m0 0L6.5 10.5M12 5l5.5 5.5" />
                          ) : (
                            <path d="M12 5v14m0 0 5.5-5.5M12 19l-5.5-5.5" />
                          )}
                        </svg>
                      </span>
                      <div className="transaction-description">
                        <strong>{transaction.title}</strong>
                        <span>{formatTransactionDate(transaction.date)}</span>
                      </div>
                      <div className="transaction-amount">
                        <strong className={isIncome ? 'amount-income' : 'amount-expense'}>
                          {isIncome ? '+' : '−'} {formatCurrency(Number(transaction.amount))}
                        </strong>
                        <span>{isIncome ? 'Pemasukan' : 'Pengeluaran'}</span>
                      </div>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => deleteTransaction(transaction.id)}
                        aria-label={`Hapus transaksi ${transaction.title}`}
                        title="Hapus transaksi"
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="form-panel panel" id="add-transaction">
            <div className="panel-heading form-heading">
              <div>
                <p className="eyebrow">TETAP TERKENDALI</p>
                <h2>Tambah transaksi</h2>
              </div>
              <span className="form-heading-icon" aria-hidden="true">＋</span>
            </div>
            <p className="form-intro">Catat aktivitas keuanganmu agar semuanya tetap terpantau.</p>
            <TransactionForm onAddTransaction={addTransaction} />
          </section>
        </section>

        <footer className="page-footer">
          <span>Dompetku <span aria-hidden="true">·</span> Kelola keuangan dengan lebih bijak.</span>
          <span>Data tersimpan di perangkatmu</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
