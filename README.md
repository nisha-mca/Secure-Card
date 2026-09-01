# SecureCard — Private Protected Search over Encrypted Cloud Records
### Single Transaction Card using Multi-Bank Account Processing System (MERN Stack)

This is a MERN-stack (MongoDB, Express, React, Node.js) rebuild of the project described in
`Document_from_Nisha.pdf`. It keeps the same modules and database design from the report but
implements them with a Node/Express API, MongoDB via Mongoose, and a React (Vite) frontend,
instead of the original Flask/MySQL stack.

## Modules implemented

1. **User Registration & Authentication** — bcrypt-hashed passwords, JWT sessions, one card
   number issued per user (`CARD<mobile>`).
2. **Data Encryption Module** (`backend/utils/crypto.js`) — AES-256-GCM encrypts every
   transaction description before it is stored; a keyed HMAC produces the searchable
   `keyword_hash` values, so the plaintext description never touches the database or a query.
3. **Cloud Storage Module** — MongoDB collections (`users`, `banks`, `transactions`, `admins`)
   store only ciphertext + hashes, mirroring the report's database design in Section 6.2.
4. **Private Search Module** — `/api/transactions/search` hashes the incoming keyword and
   matches it against stored `keywordHashes`, then decrypts only the matching rows for display.
5. **Single Transaction Card Module** — each user gets one card number that all linked banks
   settle against.
6. **Multi-Bank Processing Module** — users can link any number of bank accounts and choose
   which one a transaction debits from.

## Project structure

```
secure-card-mern/
  backend/     Express API, MongoDB models, JWT auth, encryption utilities
  frontend/    React (Vite) client
```

## Running it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI, JWT_SECRET, AES_SECRET_KEY, HMAC_SECRET_KEY
node seedAdmin.js         # creates admin / admin123 (change the password after first login)
npm run dev                # or: npm start
```

The API runs on `http://localhost:5000` and expects a MongoDB instance reachable at
`MONGO_URI` (local `mongod` or a MongoDB Atlas connection string both work).

**Important:** `AES_SECRET_KEY` must be a 64-character hex string (32 bytes). Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend
(configured in `vite.config.js`).

## Default admin login

After running `node seedAdmin.js`:
- Username: `admin`
- Password: `admin123`

Change this password (or edit `seedAdmin.js`) before using this outside a local demo.

## Notes on the "hero image"

The home page includes a custom SVG illustration (`frontend/src/components/VaultIllustration.jsx`)
of a padlock inside a hex vault, orbited by four linked bank nodes — built directly in code so
there's no external image file to manage, matching the "Encrypted Cloud Record Protection" theme
from the original report's homepage slider.
