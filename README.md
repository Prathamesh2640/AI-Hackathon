# Library Management System (LMS)

A comprehensive, full-stack Library Management System built with a React Native mobile front-end and a Node.js (Express) back-end, powered by a MySQL database. The system provides role-based access for 'Owners' (Librarians/Admins) and 'Members' (Library Patrons).

## Table of Contents

- [Features](#features)
  - [Common Features](#common-features)
  - [Member Features](#member-features)
  - [Owner Features](#owner-features)
- [System Architecture](#system-architecture)
  - [Frontend (React Native)](#frontend-react-native)
  - [Backend (Node.js & Express)](#backend-nodejs--express)
  - [Database (MySQL)](#database-mysql)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Member Routes](#member-routes)
  - [Owner Routes](#owner-routes)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [How to Run](#how-to-run)

## Features

### Common Features
- **User Authentication:** Secure registration and login for members and owners using JWT (JSON Web Tokens).
- **Role-Based Access Control:** The UI and API access are strictly controlled based on user roles ('Owner' or 'Member').

### Member Features
- **Dashboard:** A personalized dashboard with a summary of currently borrowed books, outstanding fines, and total books read.
- **Book Catalog:** Search and filter the entire library catalog by title, author, or ISBN.
- **Book Details:** View detailed information about any book, including its availability status and the number of copies.
- **Borrowing:** Request to borrow available books (requires an active, paid membership).
- **Loan Management:** View currently borrowed books and their due dates.
- **History:** Access a complete history of all past borrowings.
- **Fine Management:** View and (simulate) payment of any outstanding fines for overdue books.
- **Profile Management:** Update personal information (full name, email) and change account password.
- **Payment History:** View a record of all transactions, including membership fees and fine payments.

### Owner Features
- **Business Dashboard:** A high-level overview of key library metrics: monthly revenue, total members, asset value, outstanding dues, and more.
- **User Management:** View a list of all members and manage their paid membership status.
- **Book Operations:**
  - **Issue/Return:** A dedicated interface to issue books to members and process returns.
  - **Fine Calculation:** Automatic calculation of fines (₹5/day) upon returning an overdue book.
  - **Fine Collection:** Manually mark fines as collected.
- **Inventory Management:**
  - Add new book titles to the catalog.
  - Add individual physical copies for each book with a unique identifier.
- **Comprehensive Reporting:**
  - **Financial Reports:** Track monthly revenue, expenses, and net profit.
  - **Collection Reports:** Analyze fee and fine collection performance.
  - **Asset Reports:** Get an overview of the library's total asset value and a breakdown by category.
  - **User Statistics:** View metrics on member growth, activity levels, and retention.
  - **Inventory Reports:** Analyze the library's collection with subject-wise and book-wise copy breakdowns.

## System Architecture

The project is a monorepo-style full-stack application with a clear separation between the client and server.

### Frontend (React Native)
- **Framework:** React Native (managed by Expo).
- **Navigation:** `react-navigation/stack` for screen transitions.
- **State Management:** React Context API (`AuthContext`) for global authentication state.
- **API Communication:** `axios` for all HTTP requests to the backend.

### Backend (Node.js & Express)
- **Framework:** Express.js.
- **Authentication:** JWT for securing API endpoints. Passwords are encrypted using `bcryptjs`.
- **Database Interaction:** Sequelize ORM for modeling and querying the MySQL database.
- **Validation:** Server-side validation for incoming requests.
- **Middleware:** Custom middleware for JWT verification (`protect`) and role-based authorization (`isOwner`).

### Database (MySQL)
- A relational database schema to logically store users, books, copies, borrowings, and payments.
- Utilizes foreign key constraints to maintain data integrity.

## Project Structure
```
LibraryApp/
├── express-server/         # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── react-native-app/       # React Native Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   └── styles/
│   └── App.js
│
└── README.md
```

## Database Schema
The database consists of the following tables:
- `Users`: Stores information for both Owners and Members.
- `Categories`: Book genres (e.g., 'Programming').
- `Racks`: Physical locations of book copies.
- `Books`: General information about a book title.
- `BookCopies`: Represents individual physical copies of a book.
- `Borrowings`: Tracks each loan, including issue/due/return dates and fines.
- `Payments`: Records all financial transactions (fees and fines).

*(For the complete DDL and DML, see the provided `database.sql` file in the project setup phase.)*

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication
- `POST /auth/register`: Register a new member.
- `POST /auth/login`: Log in a user and receive a JWT.

### Member Routes
*Protected by JWT*
- `GET /member/dashboard/summary/:memberId`: Get KPIs for the member dashboard.
- `GET /member/books/search`: Search for books.
- `GET /member/books/:bookId`: Get details for a single book.
- `POST /member/borrow/:copyId`: Request to borrow a book copy.
- `GET /member/borrowing-history/:memberId`: Get the user's complete borrowing history.
- `GET /member/fines/:memberId`: Get the user's outstanding fines.
- `POST /member/fines/:borrowingId/pay`: Mark a fine as paid.
- `GET /member/payments`: Get the user's payment history.
- `PUT /member/profile`: Update user profile information.
- `PUT /member/profile/change-password`: Change the user's password.

### Owner Routes
*Protected by JWT and Owner Role*
- `GET /owner/stats/users`: Get user statistics for reports.
- `GET /owner/members`: Get a list of all members.
- `PUT /owner/members/:memberId/paid-status`: Update a member's paid status.
- `POST /owner/books`: Add a new book title.
- `POST /owner/book-copies`: Add a new physical copy of a book.
- `POST /owner/borrow/issue/:copyId/:memberId`: Issue a book to a member.
- `POST /owner/borrow/return/:copyId`: Process a book return and calculate fines.
- `GET /owner/borrowings/overdue`: Get a list of all overdue books.
- `POST /owner/fines/collect/:borrowingId`: Mark a fine as collected.
- `GET /owner/reports/*`: Various endpoints to fetch data for all owner-level reports.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
- Node.js (v14 or later) & npm
- A running MySQL Server instance
- Expo Go app on a physical device OR an Android/iOS emulator
- A code editor (e.g., VS Code)
- A REST API client like Postman (for backend testing)

### Database Setup
1.  Create a new database in your MySQL server: `CREATE DATABASE library_system;`.
2.  Execute the entire SQL script from the `database.sql` file provided during setup. This will create all tables and seed them with initial data.
3.  Update the database credentials in `express-server/config/config.js` to match your MySQL setup.

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd express-server
    ```
2.  Install all required dependencies:
    ```bash
    npm install
    ```
3.  Start the backend server:
    ```bash
    node server.js
    ```
4.  The server should now be running on `http://localhost:5000`.

### Frontend Setup
1.  Navigate to the frontend directory in a **new terminal window**:
    ```bash
    cd react-native-app
    ```
2.  Install all required dependencies:
    ```bash
    npm install
    ```
3.  The `src/api/axiosConfig.js` file is configured to automatically detect the server's IP address. If you encounter connection issues, you may need to manually set your computer's local network IP address in this file.

## How to Run

1.  **Start the Backend:** Ensure the Express server is running (see Backend Setup).
2.  **Start the Frontend:** In the `react-native-app` directory, run:
    ```bash
    npx expo start
    ```
3.  **Launch the App:**
    - **On an Emulator:** Press `a` (for Android) or `i` (for iOS) in the terminal where Expo is running.
    - **On a Physical Device:** Open the Expo Go app on your phone (connected to the same Wi-Fi as your computer) and scan the QR code displayed in the terminal.

The app will build and launch, presenting you with the login screen. You can use the pre-seeded credentials from `database.sql` to log in:
- **Owner:** `username: owner`, `password: password123`
- **Member (Paid):** `username: johndoe`, `password: password123`
- **Member (Unpaid):** `username: janesmith`, `password: password123`
