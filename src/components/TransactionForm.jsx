import { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const numericAmount = Number(amount);
    if (!trimmedTitle || !Number.isFinite(numericAmount) || numericAmount <= 0) return;

    onAddTransaction({
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: trimmedTitle,
      amount: numericAmount,
      type,
      date: new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
    setType('expense');
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span className="field-label">Nama transaksi</span>
        <input
          autoComplete="off"
          maxLength={70}
          name="title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Contoh: Belanja bulanan"
          required
          type="text"
          value={title}
        />
      </label>

      <label className="form-field">
        <span className="field-label">Nominal transaksi</span>
        <span className="amount-input-wrap">
          <span className="currency-prefix">Rp</span>
          <input
            inputMode="numeric"
            min="1"
            name="amount"
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0"
            required
            step="1"
            type="number"
            value={amount}
          />
        </span>
      </label>

      <label className="form-field">
        <span className="field-label">Kategori</span>
        <select
          name="type"
          onChange={(event) => setType(event.target.value)}
          value={type}
        >
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
      </label>

      <button className="submit-button" type="submit">
        <span aria-hidden="true">＋</span> Simpan transaksi
      </button>
      <p className="form-footnote">
        Data transaksi tersimpan otomatis di browser kamu.
      </p>
    </form>
  );
}

export default TransactionForm;
