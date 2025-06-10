# Daira Website (MERN Project)

Welcome to the Daira-Website project! This is a MERN stack application with a main project and two submodules:
- **daira-ems-client**: React frontend
- **daira-ems-backend**: Node.js/Express backend

---

## Project Structure

```
Daira-Website/
│
├── daira-ems-client/     # React frontend (client)
├── daira-ems-backend/    # Node.js/Express backend (server)
└── README.md             # Project documentation
```

---

## Environment Variables

You’ll need to set up environment variables for both frontend and backend.  
**Never commit your real credentials or secrets to version control.**  
Copy `.env.example` to `.env` in both the frontend (`daira-ems-client`) and backend (`daira-ems-backend`) directories and fill in your real values.

### Example Frontend `.env` (in `daira-ems-client/`):

```
REACT_APP_ADMIN_BACKEND_ROUTE=/backend/admin
REACT_APP_ADMIN_ROUTE=/admin
REACT_APP_INVITATION_ROUTE=/invitation
REACT_APP_SITE_KEY=your_recaptcha_site_key_here
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_SOCIETY_ROUTE=/society
```

### Example Backend `.env` (in `daira-ems-backend/`):

```
NODE_ENV=development
MONGO=mongodb+srv://username:password@cluster0.mongodb.net/dbname?retryWrites=true&w=majority&appName=Cluster0
BACKEND_PORT=3000
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
ADMIN_ROUTE=/backend/admin
JWT_EXPIRATION=1hr
DAIRA_GMAIL_USERNAME=your_email@example.com
DAIRA_GMAIL_PASSWORD=your_email_password
```

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/Ahmed0Raza/Daira-Website.git
cd Daira-Website
```

---

### 2. Setup the Backend

```sh
cd daira-ems-backend
cp .env.example .env    # Edit .env to add your real values
npm install
npm start               # Or: npm run dev (if using nodemon)
```

- By default, backend runs on [http://localhost:3000](http://localhost:3000)

---

### 3. Setup the Frontend

```sh
cd ../daira-ems-client
cp .env.example .env    # Edit .env to add your real values
npm install
npm start
```

- By default, frontend runs on [http://localhost:3001](http://localhost:3001)

---

## How to Run in Development

1. Start backend (`daira-ems-backend`) first.
2. Start frontend (`daira-ems-client`) next.
3. Both services should connect automatically if your environment variables are set correctly.

---

## How to Run in Production

- Build the frontend:  
  ```sh
  npm run build
  ```
- Deploy the build folder and backend to your production server.
- Update all URLs and credentials in your `.env` files for production.

---

## Security Notice

**Never share real credentials, secret keys, or passwords publicly or in your codebase.**  
Always use `.env` files for secret configuration and add `.env` to your `.gitignore`.

---

## License

MIT (or your chosen license)

---

## Contact

For issues, please open a GitHub issue or contact the repository owner.
