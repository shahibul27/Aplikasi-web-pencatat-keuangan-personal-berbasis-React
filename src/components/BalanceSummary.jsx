function BalanceSummary({ transactions, formatCurrency }) {
  const { totalIncome, totalExpense } = transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === 'income') {
        totals.totalIncome += Number(transaction.amount);
      } else if (transaction.type === 'expense') {
        totals.totalExpense += Number(transaction.amount);
      }

      return totals;
    },
    { totalIncome: 0, totalExpense: 0 },
  );
  const balance = totalIncome - totalExpense;

  return (
    <section className="summary-grid" aria-label="Ringkasan saldo">
      <article className="balance-card">
        <div className="balance-card-content">
          <div className="balance-card-label">
            <span className="balance-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4.5 7.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2H18" />
                <path d="M16 12h4.5v4H16a2 2 0 1 1 0-4Z" />
              </svg>
            </span>
            <span>Total saldo</span>
          </div>
          <p className="balance-value">{formatCurrency(balance)}</p>
          <p className="balance-caption">
            {balance >= 0
              ? 'Kamu sedang berada di jalur yang baik.'
              : 'Pengeluaranmu lebih besar dari pemasukan.'}
          </p>
        </div>
        <div className="balance-decoration" aria-hidden="true">
          <svg viewBox="0 0 250 120" fill="none">
            <path d="M2 102c29-3 32-32 58-30s31 27 56 13 30-45 54-39 37 26 78-36" />
            <path d="M2 119c29-3 32-32 58-30s31 27 56 13 30-45 54-39 37 26 78-36" />
          </svg>
          <span className="decoration-orb" />
        </div>
        <span className="balance-card-corner" aria-hidden="true">IDR</span>
      </article>

      <article className="stat-card income-card">
        <div className="stat-card-top">
          <span className="stat-icon stat-icon-income" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5m0 0L6.5 10.5M12 5l5.5 5.5" />
            </svg>
          </span>
          <span className="stat-label">Total pemasukan</span>
        </div>
        <p className="stat-value">{formatCurrency(totalIncome)}</p>
        <p className="stat-caption">Akumulasi pemasukan tercatat</p>
      </article>

      <article className="stat-card expense-card">
        <div className="stat-card-top">
          <span className="stat-icon stat-icon-expense" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m0 0 5.5-5.5M12 19l-5.5-5.5" />
            </svg>
          </span>
          <span className="stat-label">Total pengeluaran</span>
        </div>
        <p className="stat-value">{formatCurrency(totalExpense)}</p>
        <p className="stat-caption">Akumulasi pengeluaran tercatat</p>
      </article>
    </section>
  );
}

export default BalanceSummary;
