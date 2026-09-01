import { Link } from "react-router-dom";
import VaultIllustration from "../components/VaultIllustration";

const features = [
  {
    title: "Encrypted cloud records",
    body: "Every transaction description is sealed with AES-256-GCM before it ever leaves your session, so the database only ever holds ciphertext.",
  },
  {
    title: "Search without decrypting",
    body: "Keyword search runs against HMAC hashes, not plaintext, letting you find past transactions without exposing them in storage or transit.",
  },
  {
    title: "One card, many banks",
    body: "Link accounts from any number of banks to a single transaction card and pay from any of them through one unified balance view.",
  },
  {
    title: "Multi-bank processing",
    body: "A standardized transaction layer settles payments against the selected bank account while keeping every other account untouched.",
  },
  {
    title: "Full audit trail",
    body: "Every transaction is timestamped, IP-logged, and visible to administrators for compliance, without ever revealing plaintext to the database layer.",
  },
  {
    title: "Role-based access",
    body: "Separate authenticated sessions for cardholders and administrators, backed by JWT and bcrypt-hashed credentials.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">Private Protected Search &middot; MERN Stack</div>
          <h1>One card. Every bank. Records that stay sealed.</h1>
          <p>
            SecureCard links your accounts from multiple banks to a single transaction card, and
            lets you search your transaction history without ever storing or querying plaintext
            financial data.
          </p>
          <div className="actions">
            <Link to="/register" className="btn btn-primary">
              Get started
            </Link>
            <Link to="/user/login" className="btn btn-ghost">
              User login
            </Link>
          </div>
        </div>
        <VaultIllustration />
      </section>

      <section className="features container">
        <h2>What's inside the system</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-cell" key={f.title}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
