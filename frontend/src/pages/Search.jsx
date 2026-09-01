import { useState } from "react";
import api from "../api";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/transactions/search", { keyword });
      setResults(data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Search transactions</h1>
        <p>
          Your search term is hashed before it reaches the database — matches are made against
          keyword hashes, not stored plaintext.
        </p>
      </div>

      <div className="panel">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            placeholder="Search by description keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {!searched ? (
          <div className="empty-state">Enter a keyword to search your encrypted records.</div>
        ) : results.length === 0 ? (
          <div className="empty-state">No transactions matched "{keyword}".</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.bank}</td>
                  <td>&#8377;{r.amount}</td>
                  <td>{r.description}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
