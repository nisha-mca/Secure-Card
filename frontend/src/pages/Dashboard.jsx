import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import AddAccountModal from "../components/AddAccountModal";
import TransactionModal from "../components/TransactionModal";

export default function Dashboard() {
  const { user } = useAuth();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [payBank, setPayBank] = useState(null);

  async function loadBanks() {
    setLoading(true);
    const { data } = await api.get("/banks");
    setBanks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBanks();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Welcome back{user ? `, ${user.fullName}` : ""}</h1>
        <p>
          Card {user?.cardNumber} is linked to {banks.length} bank account
          {banks.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Linked accounts</h2>
          <button className="btn-small" onClick={() => setShowAddModal(true)}>
            Add new account
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading accounts...</div>
        ) : banks.length === 0 ? (
          <div className="empty-state">
            No banks linked yet. Add your first account to start transacting.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Account number</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {banks.map((b) => (
                <tr key={b._id}>
                  <td>{b.bankName}</td>
                  <td>{b.accountNumber}</td>
                  <td>&#8377;{b.balance}</td>
                  <td>
                    <button className="btn-small secondary" onClick={() => setPayBank(b)}>
                      Make transaction
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            loadBanks();
          }}
        />
      )}

      {payBank && (
        <TransactionModal
          bank={payBank}
          onClose={() => setPayBank(null)}
          onPaid={() => {
            setPayBank(null);
            loadBanks();
          }}
        />
      )}
    </>
  );
}
