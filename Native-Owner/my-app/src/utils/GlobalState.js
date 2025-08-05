import React, { createContext, useState, useContext } from "react";
import { Alert } from "react-native";

const GlobalContext = createContext();

const initialUsers = [
  {
    id: "1",
    email: "owner@example.com",
    password: "owner123",
    role: "owner",
    isPaid: true,
  },
  {
    id: "2",
    email: "member@example.com",
    password: "member123",
    role: "member",
    isPaid: true,
  },
];

const initialBooks = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    subject: "Programming",
    price: "₹1200",
    totalCopies: 5,
    availableCopies: 3,
    copies: [
      {
        id: "1-1",
        status: "Available",
        rack: "Rack 1",
        condition: "Good",
        addedDate: "2023-01-10",
        lastBorrowed: "2025-07-15",
      },
      {
        id: "1-2",
        status: "Issued",
        rack: "Rack 1",
        condition: "Good",
        issuedTo: "2",
        dueDate: "2025-08-10",
        overdue: 0,
      },
      {
        id: "1-3",
        status: "Available",
        rack: "Rack 1",
        condition: "Good",
        addedDate: "2023-01-10",
        lastBorrowed: "2025-06-20",
      },
      {
        id: "1-4",
        status: "Available",
        rack: "Rack 1",
        condition: "Good",
        addedDate: "2023-01-10",
        lastBorrowed: "2025-05-10",
      },
      {
        id: "1-5",
        status: "Issued",
        rack: "Rack 1",
        condition: "Good",
        issuedTo: "2",
        dueDate: "2025-07-30",
        overdue: 6,
      },
    ],
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    subject: "Programming",
    price: "₹800",
    totalCopies: 3,
    availableCopies: 2,
    copies: [
      {
        id: "2-1",
        status: "Available",
        rack: "Rack 2",
        condition: "Excellent",
        addedDate: "2023-02-15",
        lastBorrowed: "2025-07-01",
      },
      {
        id: "2-2",
        status: "Available",
        rack: "Rack 2",
        condition: "Excellent",
        addedDate: "2023-02-15",
        lastBorrowed: "2025-06-15",
      },
      {
        id: "2-3",
        status: "Issued",
        rack: "Rack 2",
        condition: "Excellent",
        issuedTo: "2",
        dueDate: "2025-08-05",
        overdue: 0,
      },
    ],
  },
];

const initialBorrowings = [
  {
    id: "b1",
    userId: "2",
    bookId: "1",
    copyId: "1-2",
    issueDate: "2025-08-03",
    dueDate: "2025-08-10",
    status: "Borrowed",
    fine: 0,
  },
  {
    id: "b2",
    userId: "2",
    bookId: "1",
    copyId: "1-5",
    issueDate: "2025-07-23",
    dueDate: "2025-07-30",
    status: "Overdue",
    fine: 30,
  },
  {
    id: "b3",
    userId: "2",
    bookId: "2",
    copyId: "2-3",
    issueDate: "2025-07-29",
    dueDate: "2025-08-05",
    status: "Borrowed",
    fine: 0,
  },
];

const initialFines = [
  {
    id: "f1",
    userId: "2",
    bookId: "1",
    copyId: "1-5",
    amount: 30,
    reason: "Overdue by 6 days",
    status: "Unpaid",
    date: "2025-08-05",
  },
];

export const GlobalProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [books, setBooks] = useState(initialBooks);
  const [borrowings, setBorrowings] = useState(initialBorrowings);
  const [fines, setFines] = useState(initialFines);

  const togglePaidStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isPaid: !user.isPaid } : user
      )
    );
    Alert.alert("Success", `User ${userId} paid status toggled`);
  };

  const addBook = (bookData) => {
    const newBook = {
      id: String(books.length + 1),
      ...bookData,
      copies: [],
      availableCopies: 0,
    };
    setBooks([...books, newBook]);
    Alert.alert("Success", "Book added successfully");
  };

  const addCopy = (bookId, copyData) => {
    setBooks(
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              totalCopies: book.totalCopies + 1,
              availableCopies: book.availableCopies + 1,
              copies: [
                ...book.copies,
                {
                  id: `${bookId}-${book.copies.length + 1}`,
                  status: "Available",
                  ...copyData,
                },
              ],
            }
          : book
      )
    );
    Alert.alert("Success", "Copy added successfully");
  };

  const borrowBook = (userId, bookId, copyId) => {
    const user = users.find((u) => u.id === userId);
    if (!user.isPaid) {
      Alert.alert("Error", "User is not a paid member");
      return false;
    }
    setBooks(
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              availableCopies: book.availableCopies - 1,
              copies: book.copies.map((copy) =>
                copy.id === copyId
                  ? {
                      ...copy,
                      status: "Issued",
                      issuedTo: userId,
                      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                      overdue: 0,
                    }
                  : copy
              ),
            }
          : book
      )
    );
    setBorrowings([
      ...borrowings,
      {
        id: `b${borrowings.length + 1}`,
        userId,
        bookId,
        copyId,
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "Borrowed",
        fine: 0,
      },
    ]);
    Alert.alert("Success", "Book borrowed successfully");
    return true;
  };

  const returnBook = (bookId, copyId) => {
    const borrowing = borrowings.find(
      (b) =>
        b.bookId === bookId && b.copyId === copyId && b.status !== "Returned"
    );
    if (!borrowing) {
      Alert.alert("Error", "No active borrowing found");
      return false;
    }
    const today = new Date();
    const dueDate = new Date(borrowing.dueDate);
    const overdueDays = Math.max(
      0,
      Math.floor((today - dueDate) / (24 * 60 * 60 * 1000))
    );
    const fine = overdueDays * 5;

    setBooks(
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              availableCopies: book.availableCopies + 1,
              copies: book.copies.map((copy) =>
                copy.id === copyId
                  ? {
                      ...copy,
                      status: "Available",
                      issuedTo: null,
                      dueDate: null,
                      overdue: 0,
                      lastBorrowed: new Date().toISOString().split("T")[0],
                    }
                  : copy
              ),
            }
          : book
      )
    );

    setBorrowings(
      borrowings.map((b) =>
        b.id === borrowing.id
          ? {
              ...b,
              status: "Returned",
              returnDate: new Date().toISOString().split("T")[0],
              fine,
            }
          : b
      )
    );

    if (fine > 0) {
      setFines([
        ...fines,
        {
          id: `f${fines.length + 1}`,
          userId: borrowing.userId,
          bookId,
          copyId,
          amount: fine,
          reason: `Overdue by ${overdueDays} days`,
          status: "Unpaid",
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    Alert.alert(
      "Success",
      `Book returned${fine > 0 ? ` with ₹${fine} fine` : ""}`
    );
    return true;
  };

  const payFine = (fineId) => {
    setFines(
      fines.map((fine) =>
        fine.id === fineId ? { ...fine, status: "Paid" } : fine
      )
    );
    Alert.alert("Success", "Fine paid successfully");
  };

  const calculateOverdueFines = () => {
    const today = new Date();
    setBorrowings(
      borrowings.map((b) => {
        if (b.status === "Borrowed") {
          const dueDate = new Date(b.dueDate);
          const overdueDays = Math.max(
            0,
            Math.floor((today - dueDate) / (24 * 60 * 60 * 1000))
          );
          if (
            overdueDays > 0 &&
            !fines.find(
              (f) =>
                f.bookId === b.bookId &&
                f.copyId === b.copyId &&
                f.status === "Unpaid"
            )
          ) {
            setFines([
              ...fines,
              {
                id: `f${fines.length + 1}`,
                userId: b.userId,
                bookId: b.bookId,
                copyId: b.copyId,
                amount: overdueDays * 5,
                reason: `Overdue by ${overdueDays} days`,
                status: "Unpaid",
                date: new Date().toISOString().split("T")[0],
              },
            ]);
            return { ...b, status: "Overdue", fine: overdueDays * 5 };
          }
          return b;
        }
        return b;
      })
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        users,
        books,
        borrowings,
        fines,
        togglePaidStatus,
        addBook,
        addCopy,
        borrowBook,
        returnBook,
        payFine,
        calculateOverdueFines,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
