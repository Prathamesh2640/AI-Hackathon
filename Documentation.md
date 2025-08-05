This is an ambitious and well-defined project! Let's build a comprehensive documentation and a phased development plan to ensure we cover all aspects.

We will proceed in three major parts:

**Part 1: Comprehensive Project Documentation**

- Project Overview, Context & High-Level Architecture
- Detailed Database Schema
- Role Definitions & Core Functionalities
- Detailed Process Flows
- Spring Boot API Design Guidelines & Comprehensive Endpoint Reference (Type, Input, Output, Access)
- React Native UI Design Guidelines (Role-based UI, Navigation, State Management)

**Part 2: Dummy Database Records (India-based)**

- A SQL file with `INSERT` statements for all tables, populating them with a good amount of India-based data, designed to test various UI scenarios.

**Part 3: React Native Development Phase 1 Instructions**

- Detailed instructions for a React Native developer, focusing exclusively on building the UI for both Owner and Member roles using hardcoded dummy data for Phase 1. This will include setup, project structure, component breakdown, and specific screens to implement.

---

## Part 1: Comprehensive Project Documentation

### 1. Project Overview, Context & High-Level Architecture

**Project Name:** Library Management System
**Goal:** To develop a React Native mobile application, backed by a Spring Boot API and MySQL database, to manage library operations, book circulation, and member services with two primary roles: 'Owner' (Librarian/Administrator) and 'Member'.

**Core Business Context:**

- **Book Management:** Track books, multiple copies, and their physical location (racks).
- **User Management:** Manage library members and owner/librarian accounts, including payment status.
- **Borrowing/Return:** Facilitate the issue and return of _individual book copies_.
- **Financials:** Manage membership fee collection and overdue fines.
- **Reporting:** Provide comprehensive reports for Owners on user activity, book inventory, and financial performance.
- **Key Rules:**
  - Books can only be borrowed by `is_paid_member` users.
  - Payments are collected by the Librarian/Owner by simply toggling a boolean flag.
  - Borrowing period is 7 days.
  - Fine is Rs. 5/- per day _after_ the due date.

**Technical Stack:**

- **Frontend:** React Native (Mobile Application)
- **Backend:** Spring Boot (RESTful API, Java)
- **Database:** MySQL (Relational Database)
- **Authentication:** JWT (JSON Web Tokens) with Spring Security

**High-Level Architecture:**

```
+---------------------+      REST API      +-----------------------+      JPA/JDBC      +-------------------+
|                     | <----------------> |                       | <----------------> |                   |
|  React Native App   |    (HTTP/HTTPS)    |    Spring Boot API    |     (TCP/IP)       |    MySQL Database |
| (Presentation Layer)|    JSON Payloads   | (Application Layer)   |    SQL Queries     | (Data Layer)      |
|                     | <----------------> |                       | <----------------> |                   |
+---------------------+                    +-----------------------+                    +-------------------+
        ^                                            ^                                            ^
        |                                            |                                            |
        | User Interaction                           | Business Logic                             | Data Storage
        | (Member/Owner)                             | (Auth, Role-Based Access, Borrow/Return,   | (Users, Books, Copies,
        |                                            | Fines, Payments, Reports)                  | Transactions, Fines)
```

### 2. Detailed Database Schema

Based on the provided DDL and ER Diagram:

- **`Members` Table:**

  - `id` (INT, PK, AUTO_INCREMENT): Unique identifier for each member/owner.
  - `name` (VARCHAR(255), NOT NULL): Full name of the user.
  - `email` (VARCHAR(255), NOT NULL, UNIQUE): User's email address, used for login, must be unique.
  - `phone` (VARCHAR(20)): User's phone number.
  - `password_hash` (VARCHAR(255), NOT NULL): Stores the securely hashed password (e.g., BCrypt).
  - `role` (VARCHAR(50), NOT NULL): Defines user's role ('MEMBER', 'OWNER').
  - `is_paid_member` (BOOLEAN, DEFAULT FALSE): _Added for the specific project requirement._ Indicates if a member is currently paid and eligible to borrow.
  - `last_payment_date` (DATETIME): _Added for the specific project requirement._ To track when the last payment was recorded for a member.

- **`Books` Table:**

  - `id` (INT, PK, AUTO*INCREMENT): Unique identifier for a book \_title*.
  - `title` (VARCHAR(255), NOT NULL): Title of the book.
  - `author` (VARCHAR(255), NOT NULL): Author(s) of the book.
  - `genre` (VARCHAR(100)): Subject/Genre of the book (e.g., 'Programming', 'Science').
  - `price` (DECIMAL(10, 2)): Original acquisition price or valuation.
  - `isbn` (VARCHAR(20), NOT NULL, UNIQUE): International Standard Book Number, unique for each book title.

- **`Copies` Table:**

  - `id` (INT, PK, AUTO*INCREMENT): Unique identifier for a \_specific physical copy* of a book.
  - `bookid` (INT, FK): Foreign key referencing `Books.id`. Identifies which book title this copy belongs to.
  - `rack` (INT): The rack number where the copy is located. _Self-correction_: For simplicity, this is an INT as per ERD. In a real-world scenario, this might be a FK to a `Racks` table for more detailed rack management. For now, it's just a number.
  - `status` (VARCHAR(50), NOT NULL): Current status of the copy ('AVAILABLE', 'ISSUED', 'LOST', 'DAMAGED').
  - `copy_identifier` (VARCHAR(50), NOT NULL, UNIQUE): _Added for the specific project requirement_. A unique identifier for the physical copy (e.g., a barcode or specific serial). This will be used for manual entry.

- **`Payments` Table:**

  - `id` (INT, PK, AUTO_INCREMENT): Unique identifier for a payment transaction.
  - `memberid` (INT, FK): Foreign key referencing `Members.id`. The member who made the payment.
  - `amount` (DECIMAL(10, 2), NOT NULL): The amount paid.
  - `type` (VARCHAR(50), NOT NULL): Type of payment ('MEMBERSHIP_FEE', 'FINE_PAYMENT').
  - `payment_date` (DATETIME, NOT NULL): The date and time the payment was made.
  - `due_date` (DATETIME): The date the payment was originally due (e.g., for monthly fees).

- **`IssuerRecord` Table (Renamed to `BorrowingTransactions` for clarity in application logic):**
  - `id` (INT, PK, AUTO_INCREMENT): Unique identifier for each borrowing transaction.
  - `copyid` (INT, FK, NOT NULL): Foreign key referencing `Copies.id`. The specific book copy that was borrowed.
  - `memberid` (INT, FK, NOT NULL): Foreign key referencing `Members.id`. The member who borrowed the copy.
  - `issue_date` (DATETIME, NOT NULL): The date and time the book was issued.
  - `due_date` (DATETIME, NOT NULL): The date by which the book is expected to be returned (issue_date + 7 days).
  - `return_date` (DATETIME): The actual date and time the book was returned (NULL if not yet returned).
  - `fine_amount` (DECIMAL(10, 2), DEFAULT 0.00): The fine calculated at the time of return, if any.
  - `status` (VARCHAR(50), NOT NULL, DEFAULT 'BORROWED'): _Added for application logic_. 'BORROWED', 'RETURNED', 'OVERDUE'.

### 3. Role Definitions & Core Functionalities

#### **A. Roles:**

1.  **Owner (Librarian/Administrator):**

    - **Access:** Full administrative access to the system.
    - **Key Responsibilities:**
      - **User Management:** View all users, manage member payment status (toggle `is_paid_member`), record payments.
      - **Book & Copy Management:** Add/edit/delete book titles, add/edit/delete individual book copies, assign copies to racks, update copy status (e.g., damaged, lost).
      - **Library Operations:** Process book issue (manually, as members request) and return of individual copies, calculate and collect fines.
      - **Monitoring & Reporting:** View comprehensive statistics and reports on:
        - User activity (enrollment, active/inactive members, borrowing patterns).
        - Book inventory (total books/copies, availability, utilization by subject/title).
        - Financial performance (membership fees collected, fines collected, overall revenue, expenses).
        - Overdue books.
        - Track library assets (valuation of books and other library items).

2.  **Member:**
    - **Access:** Limited to personal account information and library book browsing/borrowing.
    - **Key Responsibilities:**
      - **Account Management:** View/edit profile, change password.
      - **Book Discovery:** Search for books by various criteria (title, author, ISBN, subject).
      - **Book Availability:** Check real-time availability of book copies.
      - **Borrowing:** Request to borrow an _available_ book copy (only if `is_paid_member` is TRUE).
      - **History:** View personal borrowing history (past and current).
      - **Fines:** View any outstanding fines.
      - **Payments:** View personal payment history (membership fees, fine payments).

#### **B. Project Functionalities Overview:**

- **Authentication & Authorization:** Secure login for both roles using JWT. Role-based access control ensuring users only access authorized functionalities.
- **User Management:**
  - Member self-registration.
  - Owner can view, activate/deactivate, and manage member payment status.
- **Book Inventory:**
  - Cataloging book titles (title, author, ISBN, genre, price).
  - Managing multiple physical copies per book (unique identifier, rack, status).
- **Borrowing Process:**
  - Member searches for books.
  - Member checks availability of specific copies.
  - Member requests to borrow a specific copy.
  - System checks `is_paid_member` status.
  - If eligible, transaction is recorded, copy status updated.
- **Return Process:**
  - Owner inputs `copy_identifier` for return.
  - System identifies borrowing transaction.
  - Calculates overdue days (if any) and fine.
  - Updates `BorrowingTransaction` with `return_date` and `fine_amount`.
  - Updates `Copy` status to 'AVAILABLE'.
  - If fine applicable, creates a `Fine` record (or updates fine in transaction).
- **Fines & Payments:**
  - Fines are calculated at Rs. 5/- per day for overdue books.
  - Owner records payments (membership fees, fine collections).
  - Members can view their outstanding fines and payment history.
- **Reporting (Owner-specific):**
  - User statistics (total members, active, inactive, growth, avg books/member).
  - Book inventory reports (total books/copies, available, issued, utilization).
  - Financial reports (revenue from fees/fines, expenses, profit/loss trends).
  - Overdue books list.
  - Asset valuation.

### 4. Detailed Process Flows

#### **A. Member Self-Registration:**

1.  User accesses `RegisterScreen.js`.
2.  Fills out `fullName`, `email`, `phone`, `password`, `confirmPassword`.
3.  Submits form.
4.  React Native app sends `POST /api/auth/register` request.
5.  Spring Boot:
    - Validates input (email format, password strength, matching passwords).
    - Checks if email already exists.
    - Hashes password using BCrypt.
    - Creates new `Member` record in `Members` table with `role='MEMBER'` and `is_paid_member=FALSE` (default for new registrations).
    - Returns success message.
6.  React Native: Displays success, redirects to `LoginScreen`.

#### **B. User Login:**

1.  User accesses `LoginScreen.js`.
2.  Enters `email` and `password`.
3.  Submits form.
4.  React Native app sends `POST /api/auth/login` request.
5.  Spring Boot:
    - Authenticates user (verifies email and password hash).
    - Generates a JWT token containing `userId`, `username`, `role`, `isPaidMember` (and possibly other relevant flags).
    - Returns the JWT token and user details.
6.  React Native:
    - Stores the JWT token securely.
    - Reads `role` from the JWT.
    - Navigates to `MemberDashboardScreen` if `role='MEMBER'` or `OwnerDashboardScreen` if `role='OWNER'`.

#### **C. Member Borrowing a Book (via UI):**

1.  Member logs in and navigates to `BookSearchScreen.js`.
2.  Searches for a book, finds it, and goes to `BookDetailsScreen.js`.
3.  Sees "Borrow This Book" button.
4.  Clicks "View All Copies" which leads to `AvailableCopiesScreen.js`.
5.  On `AvailableCopiesScreen.js`, the member sees a list of specific copies.
6.  Clicks "Borrow This Copy" on an `AVAILABLE` copy.
7.  React Native app sends `POST /api/member/borrow/{copyIdentifier}`.
8.  Spring Boot:
    - Authenticates member using JWT.
    - Retrieves the specific `Copy` by `copyIdentifier`.
    - **Crucial Check:** Verifies if the authenticated `Member`'s `is_paid_member` flag is `TRUE`. If `FALSE`, returns error.
    - **Crucial Check:** Verifies if `Copy.status` is 'AVAILABLE'. If not, returns error.
    - Creates a new `BorrowingTransaction` record:
      - `copyid` = selected copy's ID.
      - `memberid` = authenticated member's ID.
      - `issue_date` = current timestamp.
      - `due_date` = `issue_date` + 7 days.
      - `status` = 'BORROWED'.
    - Updates `Copy.status` to 'ISSUED'.
    - Returns success message.
9.  React Native: Displays success/error message. Updates UI to reflect borrowed status.

#### **D. Owner Processing Book Return:**

1.  Owner logs in and navigates to `ProcessReturnScreen` (from Owner Dashboard's quick actions, not provided as HTML but implied from requirements).
2.  Owner enters/scans the `copy_identifier` of the returned book.
3.  Owner confirms the member returning the book (e.g., by selecting from a list of members with that book).
4.  Owner clicks "Process Return".
5.  React Native app sends `POST /api/owner/return` with `copyIdentifier` and `memberId`.
6.  Spring Boot:
    - Authenticates Owner using JWT.
    - Finds the active `BorrowingTransaction` for the given `copyIdentifier` and `memberId` where `return_date` is `NULL`.
    - Calculates `days_overdue = (current_date - due_date)`. If `current_date <= due_date`, `days_overdue = 0`.
    - Calculates `fine_amount = days_overdue * 5.00` (if `days_overdue > 0`).
    - Updates `BorrowingTransaction` record:
      - `return_date` = current timestamp.
      - `fine_amount` = calculated fine.
      - `status` = 'RETURNED' (or 'RETURNED_WITH_FINE' if we want more granular status).
    - Updates `Copy.status` to 'AVAILABLE'.
    - If `fine_amount > 0`:
      - Creates a `Payment` record with `type='FINE_PAYMENT'`, `amount=fine_amount`, `memberid=memberid`, `payment_date=current timestamp`. (Assuming fine is collected immediately on return, as per requirement "should be taken by Librarian while returning book"). If not collected immediately, we'd create a `Fine` record and have a separate endpoint for `collecting` it. Let's make the `Fines` table track _incurred_ fines, and `Payments` table track _collected_ fines, similar to the initial schema. So, if fine > 0, it _incurs_ a fine which is then _collected_ separately.
      - _Revision:_ `fine_amount` in `IssuerRecord` is the fine _incurred_. A separate `Fines` table (which I defined initially, but the ERD didn't explicitly show separate from IssuerRecord's fine) and `Payments` table (`type='FINE_PAYMENT'`) manage the collection. Let's stick to my earlier detailed schema:
        - If `fine_amount > 0`, also create a new record in the `Fines` table (with FK to `BorrowingTransaction`, `user_id`, `amount`, `incurred_date`, `is_paid=FALSE`).
    - Returns confirmation, including fine amount (if any).
7.  React Native: Displays return summary, prompts for fine collection if applicable.

#### **E. Owner Toggles Member Paid Status & Records Payment:**

1.  Owner logs in and navigates to `UserManagementScreen.js`.
2.  Selects a `Member` to view their details (`UserDetailsScreen.js`).
3.  Owner clicks button to `Mark as Paid` / `Record Payment`.
4.  React Native app sends `PUT /api/owner/users/{userId}/update-payment-status` (to toggle `is_paid_member`).
5.  React Native app sends `POST /api/owner/users/{userId}/record-payment` (to add to `Payments` history).
6.  Spring Boot:
    - Authenticates Owner.
    - `PUT /api/owner/users/{userId}/update-payment-status`: Updates `Members.is_paid_member` to `TRUE` and `Members.last_payment_date` to current date for `userId`.
    - `POST /api/owner/users/{userId}/record-payment`: Creates new `Payment` record with `type='MEMBERSHIP_FEE'`, `amount`, `memberid=userId`, `payment_date=current timestamp`, `due_date=next month`.
    - Returns success.
7.  React Native: Updates UI.

### 5. Spring Boot API Design Guidelines & Comprehensive Endpoint Reference

**General Guidelines:**

- **RESTful Principles:** Use standard HTTP methods (GET, POST, PUT, DELETE), meaningful URLs, and standard HTTP status codes.
- **JSON Payloads:** All requests and responses will be in JSON format.
- **Layered Architecture:** Separate concerns into Controller, Service, Repository layers.
- **Spring Security & JWT:**
  - Authentication: `POST /api/auth/login` generates JWT.
  - Authorization: JWT sent in `Authorization: Bearer <token>` header for all protected endpoints.
  - Role-Based Access: Use `@PreAuthorize("hasRole('MEMBER')")` or `@PreAuthorize("hasRole('OWNER')")` on controller methods.
- **Error Handling:** Implement global exception handling to return consistent error responses (e.g., `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).
- **Pagination & Filtering:** For list endpoints, implement pagination (page number, page size) and optional filtering parameters.

---

**API Endpoint Reference:**

#### **A. Common & Authentication Endpoints**

| #   | Endpoint URL                 | HTTP Method | Description                                                       | Access            | Request Body (JSON)                                                                                                                          | Response Body (JSON)                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ---------------------------- | ----------- | ----------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `/api/auth/login`            | `POST`      | Authenticate a user and return a JWT token.                       | `PUBLIC`          | `{ "email": "string", "password": "string" }`                                                                                                | `{"token": "jwt_token_string", "userId": int, "username": "string", "email": "string", "role": "string", "firstName": "string", "lastName": "string", "isPaidMember": boolean, "message": "Login successful"}`                                                                                                                                                                            |
| 2   | `/api/auth/register`         | `POST`      | Register a new member account.                                    | `PUBLIC`          | `{ "firstName": "string", "lastName": "string", "email": "string", "phone": "string", "password": "string" }`                                | `{"message": "User registered successfully.", "userId": int}` or `{"error": "Email already registered."}`                                                                                                                                                                                                                                                                                 |
| 3   | `/api/auth/forgot-password`  | `POST`      | Initiate password reset by sending an email.                      | `PUBLIC`          | `{ "email": "string" }`                                                                                                                      | `{"message": "Password reset instructions sent to your email."}`                                                                                                                                                                                                                                                                                                                          |
| 4   | `/api/user/profile`          | `GET`       | Retrieve the profile details of the authenticated user.           | `MEMBER`, `OWNER` | `(No Request Body)`                                                                                                                          | `{"id": int, "username": "string", "email": "string", "firstName": "string", "lastName": "string", "phone": "string", "role": "string", "isPaidMember": boolean, "libraryCardNumber": "string", "memberSince": "YYYY-MM-DD", "membershipStatus": "string", "nextPaymentDueDate": "YYYY-MM-DD"}` (Fields shown depend on role and data availability)                                       |
| 5   | `/api/user/profile`          | `PUT`       | Update the profile details of the authenticated user.             | `MEMBER`, `OWNER` | `{ "firstName": "string", "lastName": "string", "phone": "string" }` (Email cannot be changed via this endpoint, generally separate process) | `{"message": "Profile updated successfully."}` or `{"error": "Validation failed."}`                                                                                                                                                                                                                                                                                                       |
| 6   | `/api/user/change-password`  | `PUT`       | Change the password for the authenticated user.                   | `MEMBER`, `OWNER` | `{ "currentPassword": "string", "newPassword": "string" }`                                                                                   | `{"message": "Password updated successfully."}` or `{"error": "Invalid current password."}`                                                                                                                                                                                                                                                                                               |
| 7   | `/api/books`                 | `GET`       | Search and list all books with optional filters.                  | `MEMBER`, `OWNER` | `(No Request Body)`                                                                                                                          | Query Params: `query` (title, author, isbn), `category` (title, author, subject, isbn), `subject` (genre), `availability` (true/false), `page` (int), `size` (int)                                                                                                                                                                                                                        | `{"totalResults": int, "books": [{"id": int, "title": "string", "author": "string", "genre": "string", "isbn": "string", "price": decimal, "totalCopies": int, "availableCopies": int, "overallAvailabilityStatus": "string"}, ...], "pagination": {"currentPage": int, "totalPages": int, "totalElements": int, "pageSize": int}}`                                                                                                                                                       |
| 8   | `/api/books/{bookId}`        | `GET`       | Get details of a specific book title and a summary of its copies. | `MEMBER`, `OWNER` | `(No Request Body)`                                                                                                                          | `{"id": int, "title": "string", "author": "string", "genre": "string", "isbn": "string", "price": decimal, "totalCopies": int, "availableCopies": int, "overallAvailabilityStatus": "string", "description": "string", "copiesSummary": [{"copyIdentifier": "string", "rack": int, "status": "string"}, ...], "relatedBooks": [{"id": int, "title": "string", "author": "string"}, ...]}` |
| 9   | `/api/books/{bookId}/copies` | `GET`       | Get all copies for a specific book, with optional filters.        | `MEMBER`, `OWNER` | `(No Request Body)`                                                                                                                          | Query Params: `status` (all, available, issued), `rackId` (int)                                                                                                                                                                                                                                                                                                                           | `{"bookId": int, "bookTitle": "string", "bookAuthor": "string", "totalCopies": int, "availableCopiesCount": int, "issuedCopiesCount": int, "bookPrice": decimal, "racks": [{"id": int, "rackNumber": int},...], "copies": [{"id": int, "copyIdentifier": "string", "rackLocation": int, "status": "string", "condition": "string", "addedDate": "YYYY-MM-DD", "lastBorrowedDate": "YYYY-MM-DD", "issuedToMemberId": int, "issuedToMemberName": "string", "dueDate": "YYYY-MM-DD"}, ...]}` |

#### **B. Member Specific Endpoints**

| #   | Endpoint URL                               | HTTP Method | Description                                                                                           | Access   | Request Body (JSON)                         | Response Body (JSON)                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | `/api/member/dashboard-summary`            | `GET`       | Get all summary data for the member dashboard.                                                        | `MEMBER` | `(No Request Body)`                         | `{"userName": "string", "membershipExpires": "string (YYYY-MM-DD)", "booksCurrentlyBorrowed": int, "totalBooksRead": int, "outstandingFines": decimal, "daysUntilNextReturn": int, "recentActivity": [{"description": "string", "date": "string"}, ...]}`                                                                                                                                                                            |
| 11  | `/api/member/borrow/{copyIdentifier}`      | `POST`      | Request to borrow a specific book copy. Requires member to be paid and copy to be available.          | `MEMBER` | `(No Request Body, copyIdentifier in path)` | `{"message": "Book borrowed successfully.", "transactionId": int}` or `{"error": "string"}` (e.g., "Not a paid member", "Book not available")                                                                                                                                                                                                                                                                                        |
| 12  | `/api/member/borrowed-books`               | `GET`       | Get a list of books currently borrowed by the authenticated member.                                   | `MEMBER` | `(No Request Body)`                         | `{"currentlyBorrowedCount": int, "dueSoonCount": int, "overdueCount": int, "totalOutstandingFines": decimal, "nextReturnDueDate": "YYYY-MM-DD", "borrowedBooks": [{"transactionId": int, "bookTitle": "string", "bookAuthor": "string", "copyIdentifier": "string", "borrowedDate": "YYYY-MM-DD", "dueDate": "YYYY-MM-DD", "daysRemaining": int, "rackLocation": int, "status": "string (GOOD_STANDING, DUE_SOON, OVERDUE)"}, ...]}` |
| 13  | `/api/member/borrow/{transactionId}/renew` | `POST`      | Submit a request to renew a borrowed book. (Note: Librarian manual confirmation is required for now). | `MEMBER` | `(No Request Body, transactionId in path)`  | `{"message": "Renewal request submitted. Please visit the library desk to confirm."}`                                                                                                                                                                                                                                                                                                                                                |
| 14  | `/api/member/borrowing-history`            | `GET`       | Get the complete borrowing history of the authenticated member, with filters and pagination.          | `MEMBER` | `(No Request Body)`                         | Query Params: `page`, `size`, `startDate`, `endDate`, `status` (all, returned, current, overdue), `subject` (genre)                                                                                                                                                                                                                                                                                                                  | `{"totalBooksRead": int, "currentlyBorrowedCount": int, "successfullyReturnedCount": int, "totalFinesPaid": decimal, "favoriteSubject": "string", "totalRecords": int, "transactions": [{"id": int, "bookTitle": "string", "bookAuthor": "string", "issueDate": "YYYY-MM-DD", "dueDate": "YYYY-MM-DD", "returnDate": "YYYY-MM-DD" or null, "status": "string (CURRENT, RETURNED, OVERDUE)", "fineAmount": decimal, "fineStatus": "string (Paid, Pending, N/A)"}, ...], "pagination": {...}}`                                                                                                                      |
| 15  | `/api/member/fines/outstanding-summary`    | `GET`       | Get a summary of outstanding fines for the authenticated member.                                      | `MEMBER` | `(No Request Body)`                         | `{"hasOutstandingFines": boolean, "currentOutstandingAmount": decimal, "totalFinesPaid": decimal, "lateReturnsCount": int, "fineRatePerDay": decimal, "fineCalculationDetails": {"returnPeriod": "string", "fineRate": "string", "gracePeriod": "string", "maximumFine": "string"}, "tipsToAvoidFines": ["string", ...]}`                                                                                                            |
| 16  | `/api/member/fines`                        | `GET`       | Get a list of all fines (outstanding or paid) for the authenticated member.                           | `MEMBER` | `(No Request Body)`                         | Query Params: `isPaid` (true/false)                                                                                                                                                                                                                                                                                                                                                                                                  | `[{"id": int, "borrowingTransactionId": int, "bookTitle": "string", "amount": decimal, "incurredDate": "YYYY-MM-DD", "daysLate": int, "fineRate": decimal, "isPaid": boolean}, ...]`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 17  | `/api/member/payment-history`              | `GET`       | Get the payment history (fees and fines) for the authenticated member, with filters and pagination.   | `MEMBER` | `(No Request Body)`                         | Query Params: `page`, `size`, `startDate`, `endDate`, `type` (all, fee, fine), `amountRange` (all, 0-100, 100-500, 500+)                                                                                                                                                                                                                                                                                                             | `{"totalFeesPaid": decimal, "totalFinesPaid": decimal, "lastPaymentAmount": decimal, "lastPaymentDate": "YYYY-MM-DD", "totalOverallPaid": decimal, "totalTransactions": int, "nextMembershipDueDate": "YYYY-MM-DD", "nextMembershipFeeAmount": decimal, "payments": [{"id": int, "type": "string (FEE, FINE)", "description": "string", "date": "YYYY-MM-DD", "amount": decimal, "transactionId": "string", "validUntil": "YYYY-MM-DD", "paymentMethod": "string", "collectedBy": "string", "bookTitle": "string", "daysLate": int, "fineRate": decimal, "copyIdentifier": "string"}, ...], "pagination": {...}}` |

#### **C. Owner Specific Endpoints**

| #   | Endpoint URL                                      | HTTP Method | Description                                                                                                                                         | Access  | Request Body (JSON)                                                                                                                             | Response Body (JSON)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 18  | `/api/owner/dashboard-summary`                    | `GET`       | Fetches aggregated data for the owner's dashboard overview.                                                                                         | `OWNER` | `(No Request Body)`                                                                                                                             | `{"userName": "string", "currentDateTime": "string", "alerts": [{"type": "string", "message": "string"}], "kpis": [{"label": "string", "value": "string", "trend": "string", "status": "string"}], "revenueTrendData": [{"month": "string", "value": decimal}], "keyBusinessMetrics": [{"label": "string", "value": "string"}], "thisMonthSummary": [{"label": "string", "value": "string"}], "performanceTargets": [{"label": "string", "value": "string", "status": "string"}]}` |
| 19  | `/api/owner/users`                                | `GET`       | List all users (members and owners) with filters and pagination.                                                                                    | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `role` (MEMBER, OWNER), `isPaid` (true/false), `search` (keyword for name/email), `page`, `size`                                                                                                                                                                                                                                                                                                                                                                     | `{"totalUsers": int, "users": [{"id": int, "username": "string", "email": "string", "firstName": "string", "lastName": "string", "role": "string", "isPaidMember": boolean, "lastPaymentDate": "YYYY-MM-DD", "isActive": boolean}, ...], "pagination": {...}}`                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 20  | `/api/owner/users/{userId}`                       | `GET`       | Get detailed information for a specific user.                                                                                                       | `OWNER` | `(No Request Body)`                                                                                                                             | `{"id": int, "username": "string", "email": "string", "firstName": "string", "lastName": "string", "phone": "string", "role": "string", "isPaidMember": boolean, "lastPaymentDate": "YYYY-MM-DD", "isActive": boolean, "memberSince": "YYYY-MM-DD", "totalBooksBorrowed": int, "totalFinesIncurred": decimal, "totalFinesPaid": decimal}`                                                                                                                                          |
| 21  | `/api/owner/users/{userId}/update-payment-status` | `PUT`       | Toggle/set a member's paid status.                                                                                                                  | `OWNER` | `{ "isPaid": boolean }` (Backend will update `lastPaymentDate` if `isPaid` is true)                                                             | `{"message": "Member payment status updated successfully."}`                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 22  | `/api/owner/users/{userId}/record-payment`        | `POST`      | Record a payment (membership fee) for a member.                                                                                                     | `OWNER` | `{ "amount": decimal, "periodCovered": "string (e.g., 'Oct 2023')", "paymentMethod": "string (e.g., 'Cash', 'Online')" }`                       | `{"message": "Payment recorded successfully.", "paymentId": int}` (Also triggers update to `is_paid_member` and `last_payment_date` in `Members` table)                                                                                                                                                                                                                                                                                                                            |
| 23  | `/api/owner/books`                                | `POST`      | Add a new book title to the library.                                                                                                                | `OWNER` | `{ "title": "string", "author": "string", "genre": "string", "isbn": "string", "price": decimal }`                                              | `{"message": "Book added successfully.", "bookId": int}`                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 24  | `/api/owner/books/{bookId}`                       | `PUT`       | Update details of an existing book title.                                                                                                           | `OWNER` | `{ "title": "string", "author": "string", "genre": "string", "isbn": "string", "price": decimal }` (All fields are optional for partial update) | `{"message": "Book updated successfully."}`                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 25  | `/api/owner/books/{bookId}`                       | `DELETE`    | Delete a book title. (Should only allow if no active copies or transactions exist).                                                                 | `OWNER` | `(No Request Body)`                                                                                                                             | `{"message": "Book deleted successfully."}` or `{"error": "Book cannot be deleted due to active copies or transactions."}`                                                                                                                                                                                                                                                                                                                                                         |
| 26  | `/api/owner/book-copies`                          | `POST`      | Add a new physical copy for an existing book.                                                                                                       | `OWNER` | `{ "bookId": int, "copyIdentifier": "string", "rack": int, "status": "AVAILABLE" }` (Status defaults to AVAILABLE)                              | `{"message": "Book copy added successfully.", "copyId": int}`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 27  | `/api/owner/book-copies/{copyId}`                 | `PUT`       | Update details (rack, status, condition) of a specific book copy.                                                                                   | `OWNER` | `{ "rack": int, "status": "string (AVAILABLE, ISSUED, LOST, DAMAGED)", "condition": "string" }` (All fields optional for partial update)        | `{"message": "Book copy updated successfully."}`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 28  | `/api/owner/book-copies/{copyId}`                 | `DELETE`    | Delete a specific book copy. (Should only allow if not currently issued).                                                                           | `OWNER` | `(No Request Body)`                                                                                                                             | `{"message": "Book copy deleted successfully."}` or `{"error": "Book copy cannot be deleted as it is currently issued."}`                                                                                                                                                                                                                                                                                                                                                          |
| 29  | `/api/owner/return`                               | `POST`      | Process the return of a book copy.                                                                                                                  | `OWNER` | `{ "copyIdentifier": "string", "memberId": int }` (The memberId is needed to identify the correct open transaction for that copy)               | `{"message": "Book returned successfully.", "fineDue": decimal, "fineId": int (if fine incurred), "borrowingTransactionId": int}`                                                                                                                                                                                                                                                                                                                                                  |
| 30  | `/api/owner/overdue-books`                        | `GET`       | Get a list of all currently overdue books.                                                                                                          | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `page`, `size`                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `{"totalOverdue": int, "overdueBooks": [{"transactionId": int, "bookTitle": "string", "copyIdentifier": "string", "userName": "string", "borrowDate": "YYYY-MM-DD", "dueDate": "YYYY-MM-DD", "daysOverdue": int, "estimatedFine": decimal}, ...], "pagination": {...}}`                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 31  | `/api/owner/fines/{fineId}/collect`               | `POST`      | Mark an incurred fine as paid.                                                                                                                      | `OWNER` | `(No Request Body)`                                                                                                                             | `{"message": "Fine collected successfully."}`                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 32  | `/api/owner/reports/dashboard-kpis`               | `GET`       | Get aggregated KPI data for the Owner Dashboard. (This is a subset of the full dashboard-summary, but can be useful for individual widget updates.) | `OWNER` | `(No Request Body)`                                                                                                                             | `{"monthlyRevenue": decimal, "monthlyRevenueTrend": "string", "activeMembers": int, "activeMembersTrend": "string", "collectionEfficiency": decimal, "collectionEfficiencyTrend": "string", "totalBooks": int, "totalBooksTrend": "string", "booksInCirculation": int, "booksInCirculationTrend": "string", "assetValue": decimal, "assetValueTrend": "string"}`                                                                                                                   |
| 33  | `/api/owner/reports/user-statistics`              | `GET`       | Get comprehensive user statistics and trends.                                                                                                       | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `dateRange` (month, quarter, year, all), `memberStatus` (all, active, inactive, new), `activityLevel` (all, high, medium, low), `reportType` (summary, detailed, trends)                                                                                                                                                                                                                                                                                             | `{"totalMembers": int, "totalMembersChange": "string", "activeMembers": int, "inactiveMembers": int, "newMembersThisMonth": int, "retentionRate": decimal, "retentionRateChange": "string", "avgBooksPerMember": decimal, "avgBooksPerMemberChange": "string", "memberActivityStatistics": [{"level": "string", "members": int, "percentage": decimal, "avgBooksBorrowed": decimal, "totalRevenue": decimal, "avgRevenuePerMember": decimal}], "memberGrowthTrendData": [...], "memberInsights": {...}, "engagementMetrics": {...}, "revenueAnalysis": {...}, "recentMemberActivity": [{"member": "string", "details": "string", "timeAgo": "string"}]}`                                                                     |
| 34  | `/api/owner/reports/inventory-by-subject`         | `GET`       | Get detailed inventory breakdown by subject category.                                                                                               | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `sortBy` (title, booksCount, copiesCount, utilizationRate, totalValue), `utilization` (high, medium, low, all), `valueRange` (high, medium, low, all)                                                                                                                                                                                                                                                                                                                | `{"subjectCategoriesCount": int, "totalBookTitles": int, "totalCopiesOverall": int, "availableCopiesOverall": int, "currentlyIssuedOverall": int, "avgUtilizationOverall": decimal, "subjects": [{"title": "string", "bookTitlesCount": int, "totalCopies": int, "availableCopies": int, "issuedCopies": int, "utilizationPercentage": decimal, "totalValue": decimal, "avgBookPrice": decimal, "growthRate": decimal, "popularBooksCount": int}], "summaryTableData": {...}}`                                                                                                                                                                                                                                               |
| 35  | `/api/owner/reports/books-by-copies`              | `GET`       | Get detailed analysis of copy distribution and utilization per book title.                                                                          | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `page`, `size`, `subject` (genre), `utilization` (high, medium, low, underutilized, all), `copiesCount` (single, few, many, all), `sortBy` (title, copies, utilization, value), `sortDir` (asc, desc)                                                                                                                                                                                                                                                                | `{"totalBookTitles": int, "totalCopies": int, "avgCopiesPerBook": decimal, "availableCopies": int, "issuedCopies": int, "avgUtilizationOverall": decimal, "books": [{"id": int, "title": "string", "author": "string", "subject": "string", "totalCopies": int, "availableCopies": int, "issuedCopies": int, "utilizationPercentage": decimal, "bookValue": decimal, "totalInvestment": decimal}], "pagination": {...}}`                                                                                                                                                                                                                                                                                                     |
| 36  | `/api/owner/reports/collections`                  | `GET`       | Get comprehensive analysis of fee and fine collection performance.                                                                                  | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD), `type` (all, fee, fine), `period` (daily, weekly, monthly, quarterly)                                                                                                                                                                                                                                                                                                                                              | `{"totalCollections": decimal, "totalCollectionsChange": "string", "membershipFeesTotal": decimal, "membershipFeesChange": "string", "fineCollectionsTotal": decimal, "fineCollectionsChange": "string", "collectionEfficiency": decimal, "collectionEfficiencyChange": "string", "outstandingDues": decimal, "outstandingMembersCount": int, "collectionSummary": [{"dateOrPeriod": "string", "membershipFees": decimal, "fineCollections": decimal, "totalCollected": decimal, "transactions": int, "efficiencyPercentage": decimal}], "analysisMetrics": {...}, "outstandingAnalysis": {...}, "performanceTargets": {...}, "collectionDistributionData": [{"type": "string", "amount": decimal, "percentage": decimal}]}` |
| 37  | `/api/owner/reports/financial`                    | `GET`       | Get comprehensive revenue tracking and financial performance analysis.                                                                              | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD), `reportType` (monthly, quarterly, yearly, custom), `category` (all, revenue, expenses, profit)                                                                                                                                                                                                                                                                                                                     | `{"monthlyRevenue": decimal, "monthlyRevenueChange": "string", "monthlyExpenses": decimal, "monthlyExpensesChange": "string", "netProfit": decimal, "netProfitChange": "string", "profitMargin": decimal, "profitMarginChange": "string", "totalAssets": decimal, "totalAssetsGrowth": "string", "revenueExpenseBreakdown": {...}, "keyFinancialRatios": {...}, "cashFlowAnalysis": {...}, "performanceTargets": {...}, "profitAndLossTrendData": [...]}`                                                                                                                                                                                                                                                                    |
| 38  | `/api/owner/reports/assets`                       | `GET`       | Get comprehensive library inventory valuation and asset tracking analysis.                                                                          | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: `assetType` (all, books, equipment, furniture), `valuationMethod` (cost, current, depreciated), `ageFilter` (all, new, recent, older), `statusFilter` (all, active, damaged, retired)                                                                                                                                                                                                                                                                                | `{"totalAssetValue": decimal, "totalAssetValueChange": "string", "totalBooks": int, "booksAddedThisMonth": "string", "totalCopies": int, "copiesAddedThisMonth": "string", "utilizationRate": decimal, "utilizationRateChange": "string", "avgBookValue": decimal, "assetCategories": [{"category": "string", "quantity": int, "totalValue": decimal, "avgValue": decimal, "utilization": decimal, "growth": decimal}], "assetPerformance": {...}, "investmentAnalysis": {...}, "maintenanceSchedule": {...}, "valuationTrendData": [...]}`                                                                                                                                                                                  |
| 39  | `/api/owner/reports/{reportName}/export/pdf`      | `GET`       | Export a specific report as a PDF file.                                                                                                             | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: Same as the corresponding report GET endpoint                                                                                                                                                                                                                                                                                                                                                                                                                        | File stream (PDF)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 40  | `/api/owner/reports/{reportName}/export/excel`    | `GET`       | Export a specific report as an Excel file.                                                                                                          | `OWNER` | `(No Request Body)`                                                                                                                             | Query Params: Same as the corresponding report GET endpoint                                                                                                                                                                                                                                                                                                                                                                                                                        | File stream (Excel)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

_(Note: `{reportName}` in export URLs would be a path variable like `user-statistics`, `financial`, etc. The backend would need a single controller method to handle these exports dynamically.)_

### 6. React Native UI Design Guidelines

**General Principles:**

- **Component-Based:** Break down UI into small, reusable components (e.g., `Header`, `Card`, `Button`, `Input`, `Table`, `ListItem`).
- **Cross-Platform:** Design with responsiveness in mind for various screen sizes (phones, tablets).
- **Consistent Styling:** Use a consistent theme (colors, fonts, spacing) across the app. Utilize StyleSheet for styling.
- **State Management:**
  - **Local Component State:** For form inputs, toggles, etc.
  - **Context API:** For global state like user authentication status, user role, and potentially theme preferences.
  - **(Later Phases):** Consider a more robust state management library like Zustand or Redux Toolkit for complex shared data (e.g., cached book lists, user report data) if direct Context API becomes cumbersome. For Phase 1, basic state management will suffice for UI interactions.
- **Navigation:** Use `React Navigation` library (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`).
- **Dummy Data:** For Phase 1, all data displayed will be hardcoded within the React Native application using JSON objects or arrays.

**Role-Based UI Development:**

- **Conditional Rendering:** After login (or mocked login in Phase 1), store the `user.role` (e.g., 'MEMBER' or 'OWNER').
- Use conditional rendering (`{userRole === 'OWNER' ? <OwnerNavigator /> : <MemberNavigator />}`) to display the appropriate set of screens and navigation options.
- Within screens, use conditional rendering to show/hide specific elements or actions based on the user's role (e.g., "Manage" button visible only for Owner on book details).

**Navigation Structure:**

- **Authentication Stack:** `Login`, `Register`, `ForgotPassword` screens. No header.
- **Member Tab Navigator:** Main dashboard, search, my books, history, fines, profile.
- **Owner Tab Navigator:** Dashboard, user management, book management, reports.
- **Nested Stacks:** Each tab in the Tab Navigator can have its own Stack Navigator for deeper navigation within that section (e.g., from Book Search to Book Details).

---

## Part 2: Dummy Database Records (India-based)

This SQL script will populate your `library_db` with Indian-centric data, covering various scenarios for testing.

```sql
-- USE library_db; -- Uncomment and replace 'library_db' if you are running this directly in a MySQL client

-- Dummy Data for Library Management System (India-based)

-- Delete existing data in reverse dependency order to avoid foreign key constraints
DELETE FROM IssuerRecord;
DELETE FROM Payments;
DELETE FROM Copies;
DELETE FROM Books;
DELETE FROM Members;

-- Reset AUTO_INCREMENT counters (Optional, useful for clean re-population)
ALTER TABLE Members AUTO_INCREMENT = 1;
ALTER TABLE Books AUTO_INCREMENT = 1;
ALTER TABLE Copies AUTO_INCREMENT = 1;
ALTER TABLE Payments AUTO_INCREMENT = 1;
ALTER TABLE IssuerRecord AUTO_INCREMENT = 1;


-- -----------------------------------------------------
-- Members Data (Indian names, emails, phones)
-- Hashed passwords are 'password123' (use BCrypt hash for production)
-- Generated using a dummy BCrypt hash for "password123": $2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG
-- For real usage, generate unique hashes per user.
-- -----------------------------------------------------
INSERT INTO Members (name, email, phone, password_hash, role, is_paid_member, last_payment_date) VALUES
('Priya Sharma', 'priya.sharma@example.com', '9810123456', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'OWNER', TRUE, '2024-07-28 10:00:00'), -- Owner
('Rahul Singh', 'rahul.singh@example.com', '9920234567', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', TRUE, '2024-08-01 12:30:00'), -- Active Member
('Anjali Gupta', 'anjali.gupta@example.com', '9730345678', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', FALSE, '2024-06-15 11:00:00'), -- Unpaid Member
('Vikram Kumar', 'vikram.kumar@example.com', '9640456789', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', TRUE, '2024-07-20 09:00:00'), -- Active Member
('Deepa Reddy', 'deepa.reddy@example.com', '9550567890', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', TRUE, '2024-08-10 14:00:00'), -- Active Member
('Suresh Patil', 'suresh.patil@example.com', '9460678901', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', FALSE, '2024-05-01 16:00:00'), -- Inactive/Unpaid Member
('Meena Rao', 'meena.rao@example.com', '9370789012', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', TRUE, '2024-08-05 10:00:00'), -- Active Member
('Rajesh Kumar', 'rajesh.kumar@example.com', '9280890123', '$2a$10$C823L7vL1P1bX9Z3v1.A.eO/M.vO.zY9YmG/vO.zY9YmG', 'MEMBER', TRUE, '2024-07-25 11:00:00'); -- Active Member

-- -----------------------------------------------------
-- Books Data (Popular Indian and Global authors/genres)
-- -----------------------------------------------------
INSERT INTO Books (title, author, genre, price, isbn) VALUES
('The Art of Programming', 'Vikram Seth', 'Programming', 850.00, '978-0132350884'),
('Indian History Unveiled', 'Ramachandra Guha', 'History', 620.50, '978-0132350885'),
('Yoga for Inner Peace', 'B.K.S. Iyengar', 'Health', 450.00, '978-0132350886'),
('Algorithms Illustrated', 'S. Chandrashekar', 'Programming', 780.00, '978-0132350887'),
('Spiritual Wisdom of India', 'Swami Vivekananda', 'Spirituality', 300.00, '978-0132350888'),
('Data Science Handbook', 'Anand Rao', 'Technology', 950.00, '978-0132350889'),
('Marvels of Indian Architecture', 'George Michell', 'Art & Culture', 1200.00, '978-0132350890'),
('Introduction to Machine Learning', 'Pratik Mehta', 'Programming', 1100.00, '978-0132350891'),
('The White Tiger', 'Aravind Adiga', 'Fiction', 350.00, '978-0132350892'),
('Mathematics for Engineers', 'R.K. Jain', 'Science', 980.00, '978-0132350893'),
('Indian Mythology Tales', 'Devdutt Pattanaik', 'Mythology', 400.00, '978-0132350894'),
('Python for Beginners', 'Sarika Das', 'Programming', 600.00, '978-0132350895'),
('Fundamentals of Physics', 'H.C. Verma', 'Science', 750.00, '978-0132350896'),
('Great Indian Novels', 'Various Authors', 'Literature', 550.00, '978-0132350897'),
('Basic Chemistry', 'R.D. Sharma', 'Science', 680.00, '978-0132350898');


-- -----------------------------------------------------
-- Copies Data (Multiple copies for popular books, various statuses, Indian rack naming)
-- -----------------------------------------------------
INSERT INTO Copies (bookid, rack, status, copy_identifier) VALUES
(1, 101, 'AVAILABLE', 'PROG-001-A'), -- The Art of Programming
(1, 101, 'ISSUED', 'PROG-001-B'),
(1, 102, 'AVAILABLE', 'PROG-001-C'),
(2, 201, 'AVAILABLE', 'HIST-002-A'), -- Indian History Unveiled
(2, 201, 'ISSUED', 'HIST-002-B'),
(3, 301, 'AVAILABLE', 'HEAL-003-A'), -- Yoga for Inner Peace
(3, 301, 'AVAILABLE', 'HEAL-003-B'),
(3, 302, 'ISSUED', 'HEAL-003-C'),
(4, 103, 'AVAILABLE', 'ALGO-004-A'), -- Algorithms Illustrated
(4, 103, 'ISSUED', 'ALGO-004-B'),
(4, 103, 'AVAILABLE', 'ALGO-004-C'),
(5, 303, 'AVAILABLE', 'SPIR-005-A'), -- Spiritual Wisdom of India
(6, 104, 'AVAILABLE', 'DS-006-A'), -- Data Science Handbook
(7, 202, 'AVAILABLE', 'ARCH-007-A'), -- Marvels of Indian Architecture
(8, 105, 'ISSUED', 'ML-008-A'), -- Introduction to Machine Learning
(8, 105, 'AVAILABLE', 'ML-008-B'),
(9, 304, 'AVAILABLE', 'FIC-009-A'), -- The White Tiger
(10, 203, 'ISSUED', 'MATH-010-A'), -- Mathematics for Engineers
(11, 305, 'AVAILABLE', 'MYTH-011-A'), -- Indian Mythology Tales
(12, 106, 'AVAILABLE', 'PY-012-A'), -- Python for Beginners
(12, 106, 'AVAILABLE', 'PY-012-B'),
(12, 107, 'ISSUED', 'PY-012-C'),
(13, 204, 'AVAILABLE', 'PHY-013-A'), -- Fundamentals of Physics
(14, 306, 'AVAILABLE', 'LIT-014-A'), -- Great Indian Novels
(15, 205, 'AVAILABLE', 'CHEM-015-A'); -- Basic Chemistry


-- -----------------------------------------------------
-- Payments Data (Membership fees and fines)
-- memberid 2 (Rahul Singh) is active, memberid 3 (Anjali Gupta) is unpaid, memberid 6 (Suresh Patil) is inactive/unpaid
-- -----------------------------------------------------
INSERT INTO Payments (memberid, amount, type, payment_date, due_date) VALUES
(2, 500.00, 'MEMBERSHIP_FEE', '2024-08-01 12:30:00', '2024-09-01 00:00:00'), -- Rahul: August fee
(4, 500.00, 'MEMBERSHIP_FEE', '2024-07-20 09:00:00', '2024-08-20 00:00:00'), -- Vikram: July fee
(5, 500.00, 'MEMBERSHIP_FEE', '2024-08-10 14:00:00', '2024-09-10 00:00:00'), -- Deepa: August fee
(7, 500.00, 'MEMBERSHIP_FEE', '2024-08-05 10:00:00', '2024-09-05 00:00:00'), -- Meena: August fee
(8, 500.00, 'MEMBERSHIP_FEE', '2024-07-25 11:00:00', '2024-08-25 00:00:00'), -- Rajesh: July fee

-- Past payments
(2, 500.00, 'MEMBERSHIP_FEE', '2024-07-01 12:00:00', '2024-08-01 00:00:00'),
(2, 500.00, 'MEMBERSHIP_FEE', '2024-06-01 12:00:00', '2024-07-01 00:00:00'),
(4, 500.00, 'MEMBERSHIP_FEE', '2024-06-20 09:00:00', '2024-07-20 00:00:00'),
(5, 500.00, 'MEMBERSHIP_FEE', '2024-07-10 14:00:00', '2024-08-10 00:00:00'),
(7, 500.00, 'MEMBERSHIP_FEE', '2024-07-05 10:00:00', '2024-08-05 00:00:00');

-- Fine Payments
INSERT INTO Payments (memberid, amount, type, payment_date) VALUES
(4, 15.00, 'FINE_PAYMENT', '2024-07-28 15:00:00'), -- Vikram paid a fine
(8, 10.00, 'FINE_PAYMENT', '2024-08-01 16:00:00'); -- Rajesh paid a fine


-- -----------------------------------------------------
-- IssuerRecord (Borrowing Transactions) Data
-- copyid values need to match actual Copies.id.
-- memberid values need to match actual Members.id.
-- Current date for 'today' is assumed to be 2024-08-03
-- -----------------------------------------------------

-- Current Borrowed Books (status: ISSUED in Copies table)
-- Rahul Singh (memberid 2)
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'PROG-001-B'), 2, '2024-07-30 10:00:00', '2024-08-06 10:00:00', NULL, 0.00, 'BORROWED'), -- Due Aug 6, 2024 (good standing)
((SELECT id FROM Copies WHERE copy_identifier = 'HIST-002-B'), 2, '2024-08-01 11:00:00', '2024-08-08 11:00:00', NULL, 0.00, 'BORROWED'); -- Due Aug 8, 2024 (good standing)

-- Deepa Reddy (memberid 5) - due soon
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'HEAL-003-C'), 5, '2024-07-28 14:00:00', '2024-08-04 14:00:00', NULL, 0.00, 'BORROWED'); -- Due Aug 4, 2024 (due soon - 1 day left)

-- Vikram Kumar (memberid 4) - overdue, incurred fine
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'ALGO-004-B'), 4, '2024-07-20 09:00:00', '2024-07-27 09:00:00', NULL, 35.00, 'OVERDUE'); -- Overdue by 7 days (Aug 3 vs Jul 27), fine 35.00

-- Rajesh Kumar (memberid 8) - another currently borrowed
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'ML-008-A'), 8, '2024-08-02 10:00:00', '2024-08-09 10:00:00', NULL, 0.00, 'BORROWED'); -- Due Aug 9, 2024

-- Returned Books (past transactions)
-- Rahul Singh (memberid 2)
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'PROG-001-C'), 2, '2024-07-10 10:00:00', '2024-07-17 10:00:00', '2024-07-17 10:30:00', 0.00, 'RETURNED'),
((SELECT id FROM Copies WHERE copy_identifier = 'PROG-001-A'), 2, '2024-06-20 10:00:00', '2024-06-27 10:00:00', '2024-06-29 11:00:00', 10.00, 'RETURNED'); -- Returned 2 days late, paid fine

-- Vikram Kumar (memberid 4)
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'DS-006-A'), 4, '2024-07-05 10:00:00', '2024-07-12 10:00:00', '2024-07-12 10:00:00', 0.00, 'RETURNED');

-- Rajesh Kumar (memberid 8)
INSERT INTO IssuerRecord (copyid, memberid, issue_date, due_date, return_date, fine_amount, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'PY-012-C'), 8, '2024-07-15 10:00:00', '2024-07-22 10:00:00', '2024-07-24 11:00:00', 10.00, 'RETURNED'); -- Returned 2 days late, paid fine

-- Anjali Gupta (memberid 3) - Has no active borrowings as unpaid.
-- Suresh Patil (memberid 6) - Has no active borrowings as unpaid.

SELECT 'Dummy data inserted successfully!' AS Status;

```
