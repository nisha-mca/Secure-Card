import { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => {
      setUsers(data.users);
      setTxns(data.transactions);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Admin dashboard</h1>
        <p>Platform-wide view of registered users and processed transactions.</p>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Registered users</h2>
        </div>
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users registered yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Transactions</h2>
        </div>
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : txns.length === 0 ? (
          <div className="empty-state">No transactions yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={i}>
                  <td>{t.user}</td>
                  <td>{t.bank}</td>
                  <td>&#8377;{t.amount}</td>
                  <td>
                    <span className="badge badge-success">{t.status}</span>
                  </td>
                  <td>{new Date(t.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
