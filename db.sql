-- SQL script to create the database schema based on the provided ER Diagram

-- Important Considerations:
-- 1.  Field Naming: Some field names from the ERD are slightly adjusted for clarity
--     and consistency with modern database/application development conventions (e.g., 'name' to 'title', 'subject' to 'genre', 'passwd' to 'password_hash', 'txtime' to 'payment_date').
-- 2.  Data Types: 'int' maps to INT, 'varchar' to VARCHAR(255) (a common default),
--     'decimal' to DECIMAL(10,2), 'datetime' to DATETIME.
-- 3.  Constraints: PRIMARY KEY, AUTO_INCREMENT, NOT NULL, UNIQUE are added
--     where appropriate based on the ERD's PK/FK markings and implied business logic.
-- 4.  Foreign Keys: ON DELETE RESTRICT ON UPDATE CASCADE is a common and safe default
--     for relationships where you don't want to accidentally delete child records,
--     but allow parent ID updates.

-- Ensure you have a database created, e.g.: CREATE DATABASE library_db;
-- And configured your Spring Boot application to connect to it.

-- Use the database you've created (e.g., 'library_db')
-- USE library_db;

-- Drop tables in reverse order of dependency to avoid foreign key constraint issues
DROP TABLE IF EXISTS IssuerRecord;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Copies;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Members;

-- -----------------------------------------------------
-- Table `Members`
-- Represents users of the library, including both 'MEMBER' and 'OWNER' roles.
-- -----------------------------------------------------
CREATE TABLE Members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL, -- Corresponds to 'name' in ERD. For application, this might be a full name or username.
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20), -- Phone number, max 20 characters for international formats
    password_hash VARCHAR(255) NOT NULL, -- Renamed from 'passwd' for security best practice (stores hashed passwords)
    role VARCHAR(50) NOT NULL -- Stores user roles, e.g., 'MEMBER', 'OWNER'
);

-- -----------------------------------------------------
-- Table `Books`
-- Represents unique book titles in the library (e.g., "Clean Code").
-- -----------------------------------------------------
CREATE TABLE Books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL, -- Renamed from 'name' to 'title' for clarity
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100), -- Renamed from 'subject' to 'genre' for clarity
    price DECIMAL(10, 2), -- Price of the book title (can be for valuation)
    isbn VARCHAR(20) NOT NULL UNIQUE -- ISBN (International Standard Book Number)
);

-- -----------------------------------------------------
-- Table `Copies`
-- Represents individual physical copies of a book.
-- -----------------------------------------------------
CREATE TABLE Copies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bookid INT NOT NULL, -- Foreign Key to the Books table
    rack INT, -- As per ERD, this is an INT. In a more detailed system, this would be a FK to a separate 'Racks' table.
    status VARCHAR(50) NOT NULL, -- Current status of the copy (e.g., 'AVAILABLE', 'ISSUED', 'LOST', 'DAMAGED')
    
    CONSTRAINT fk_copies_bookid
        FOREIGN KEY (bookid)
        REFERENCES Books (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `Payments`
-- Records all financial transactions made by members (e.g., membership fees, fine payments).
-- -----------------------------------------------------
CREATE TABLE Payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    memberid INT NOT NULL, -- Foreign Key to the Members table
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Type of payment, e.g., 'MEMBERSHIP_FEE', 'FINE_PAYMENT'
    payment_date DATETIME NOT NULL, -- Renamed from 'txtime' to 'payment_date' for clarity
    due_date DATETIME, -- The date the payment was due (e.g., for monthly membership fees)
    
    CONSTRAINT fk_payments_memberid
        FOREIGN KEY (memberid)
        REFERENCES Members (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `IssuerRecord` (Borrowing Transactions)
-- Records each instance of a book copy being borrowed and returned.
-- -----------------------------------------------------
CREATE TABLE IssuerRecord (
    id INT PRIMARY KEY AUTO_INCREMENT,
    copyid INT NOT NULL, -- Foreign Key to the Copies table (the specific physical copy)
    memberid INT NOT NULL, -- Foreign Key to the Members table (the borrower)
    issue_date DATETIME NOT NULL, -- The date the book was issued
    due_date DATETIME NOT NULL, -- The date the book is due for return (7 days after issue_date)
    return_date DATETIME, -- The actual date the book was returned (NULL if not yet returned)
    fine_amount DECIMAL(10, 2) DEFAULT 0.00, -- The fine incurred for this specific borrowing transaction
    
    CONSTRAINT fk_issuerrecord_copyid
        FOREIGN KEY (copyid)
        REFERENCES Copies (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    CONSTRAINT fk_issuerrecord_memberid
        FOREIGN KEY (memberid)
        REFERENCES Members (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Optional: Add a comment to indicate the purpose of the script
SELECT 'Database schema created successfully!' AS Status;