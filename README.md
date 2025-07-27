# 🏈 NFL Win Totals Calcutta Auction App

This is a real-time React + Firebase web app designed to facilitate a **Calcutta-style auction** of NFL team win totals. Bidders log in, place bids, and manage the auction live with automated timers, bid resets, leaderboard tracking, and payouts — all integrated with Firestore and Firebase Hosting.

## 🚀 Live App

**URL:** [https://nfl-calcutta-auction.web.app](https://nfl-calcutta-auction.web.app)

Only authenticated users approved by the admin can log in and access the app.

---

## 🔑 Features

- 🔐 **Email-based Firebase authentication**
- ✅ **Whitelist access control** (via `allowed_users` Firestore collection)
- 💸 **Real-time bidding system** with automatic high-bid enforcement
- ⏲️ **Countdown timer** that resets with each valid bid
- 📈 **Live leaderboard** with color-coded user summaries
- 📃 **Export teams & bids to CSV**
- 🧑‍⚖️ **Admin controls**:
  - Advance the auction to next team
  - Mark team as sold
  - Add/remove allowed users

---

## 🛠️ Tech Stack

- **React** (frontend framework)
- **Firebase Auth** (email-based sign-in)
- **Firestore** (real-time database)
- **Firebase Hosting** (production deployment)
- **GitHub Actions** (CI/CD deployment pipeline)

---

## 🧪 Local Development

### Prerequisites

- Node.js (18+ recommended)
- Firebase CLI (`npm install -g firebase-tools`)
- GitHub account with repo access

### Setup

```bash
# Clone the repo
git clone https://github.com/gabeneslin/nfl-calcutta-auction.git
cd nfl-calcutta-auction

# Install dependencies
npm install

# Start dev server
npm start
```

## Firebase Setup

Set up Firebase by either:
	•	creating a .env file with your Firebase credentials, or
	•	manually entering the config directly in src/firebase.js
```
// src/firebase.js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```
## Start the App Locally
```
npm start
```
This runs the app in development mode at http://localhost:3000.
## Deployment
This project uses Firebase Hosting with GitHub Actions to deploy automatically when changes are pushed to main.

If deploying manually:
```
npm run build
firebase deploy
```
## 🔐 Access Control
Only users in the allowed_users Firestore collection (with document IDs matching their email addresses) can log in.

Admins can add or remove users via the “Allowed Users Admin” panel.

## 👥 Contributors
	•	@gabeneslin — Creator and Maintainer
 
## 📄 License
This project is licensed under the MIT License.
 

 
