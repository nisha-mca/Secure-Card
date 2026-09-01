import { useState } from "react";
import api from "../api";

export default function TransactionModal({ bank, onClose, onPaid }) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/transactions/pay", { bank_id: bank._id, amount, desc });
      onPaid();
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-box-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h3>Make transaction</h3>
        <p style={{ marginTop: -10, marginBottom: 16 }}>
          {bank.bankName} &middot; Available &#8377;{bank.balance}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="field">
            <label>Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </div>
          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
