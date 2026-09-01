import { useState } from "react";
import api from "../api";

export default function AddAccountModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    bank: "",
    account: "",
    ifsc: "",
    branch: "",
    balance: "",
    type: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/banks", form);
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add account");
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
        <h3>Add bank account</h3>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Bank name</label>
            <input value={form.bank} onChange={update("bank")} required />
          </div>
          <div className="field">
            <label>Account number</label>
            <input value={form.account} onChange={update("account")} required />
          </div>
          <div className="field">
            <label>IFSC code</label>
            <input value={form.ifsc} onChange={update("ifsc")} required />
          </div>
          <div className="field">
            <label>Branch</label>
            <input value={form.branch} onChange={update("branch")} required />
          </div>
          <div className="field">
            <label>Opening balance</label>
            <input type="number" value={form.balance} onChange={update("balance")} required />
          </div>
          <div className="field">
            <label>Account type</label>
            <input value={form.type} onChange={update("type")} placeholder="Savings, Current..." required />
          </div>
          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add account"}
          </button>
        </form>
      </div>
    </div>
  );
}
