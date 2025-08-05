export const memberDashboardData = {
  welcome: {
    name: "John Doe",
    message: "Your membership is active until August 30, 2025",
  },
  kpis: [
    { label: "Books Currently Borrowed", value: "3", trend: "neutral" },
    { label: "Total Books Read", value: "27", trend: "positive" },
    { label: "Outstanding Fines", value: "₹0", trend: "positive" },
    { label: "Days Until Next Return", value: "4", trend: "neutral" },
  ],
  quickActions: [
    {
      title: "Search Books",
      description: "Find your next great read",
      screen: "BookSearch",
    },
    {
      title: "My Books",
      description: "View currently borrowed books",
      screen: "BorrowedBooks",
    },
    {
      title: "Payment History",
      description: "View your transaction history",
      screen: "PaymentHistory",
    },
    {
      title: "Account Settings",
      description: "Update your information",
      screen: "Profile",
    },
  ],
  recentActivity: [
    {
      description: 'Borrowed "The Clean Coder" by Robert Martin',
      time: "2 days ago",
    },
    {
      description: 'Returned "JavaScript: The Good Parts" by Douglas Crockford',
      time: "5 days ago",
    },
    { description: "Paid monthly membership fee (₹500)", time: "1 week ago" },
  ],
};

export const bookSearchData = {
  books: [
    {
      id: "b001",
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      subject: "Programming",
      isbn: "978-0132350884",
      price: "₹2,499",
      availability: "Available",
      copies: 5,
      availableCopies: 3,
    },
    {
      id: "b002",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      subject: "Programming",
      isbn: "978-0201616224",
      price: "₹1,899",
      availability: "Available",
      copies: 3,
      availableCopies: 1,
    },
    {
      id: "b003",
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Gang of Four",
      subject: "Programming",
      isbn: "978-0201633612",
      price: "₹3,299",
      availability: "Issued",
      copies: 2,
      availableCopies: 0,
    },
    {
      id: "b004",
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      subject: "Programming",
      isbn: "978-0596517748",
      price: "₹1,499",
      availability: "Available",
      copies: 4,
      availableCopies: 2,
    },
    {
      id: "b005",
      title: "Refactoring: Improving the Design of Existing Code",
      author: "Martin Fowler",
      subject: "Programming",
      isbn: "978-0201485677",
      price: "₹2,799",
      availability: "Available",
      copies: 3,
      availableCopies: 2,
    },
  ],
  subjects: ["Programming", "Science", "Literature", "History"],
};

export const borrowingHistoryData = {
  currentBorrowings: [
    {
      id: "br001",
      bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      issueDate: "2025-08-03",
      dueDate: "2025-08-10",
      returnDate: "N/A",
      status: "Current",
      fine: "₹0",
    },
    {
      id: "br002",
      bookTitle: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      issueDate: "2025-08-01",
      dueDate: "2025-08-08",
      returnDate: "N/A",
      status: "Current",
      fine: "₹0",
    },
    {
      id: "br003",
      bookTitle: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      issueDate: "2025-07-29",
      dueDate: "2025-08-05",
      returnDate: "N/A",
      status: "Current",
      fine: "₹0",
    },
  ],
  pastBorrowings: [
    {
      id: "br004",
      bookTitle:
        "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Gang of Four",
      issueDate: "2025-07-15",
      dueDate: "2025-07-22",
      returnDate: "2025-07-25",
      status: "Returned",
      fine: "₹15 (Paid)",
    },
    {
      id: "br005",
      bookTitle: "Refactoring: Improving the Design of Existing Code",
      author: "Martin Fowler",
      issueDate: "2025-07-01",
      dueDate: "2025-07-08",
      returnDate: "2025-07-07",
      status: "Returned",
      fine: "₹0",
    },
    {
      id: "br006",
      bookTitle: "Code Complete",
      author: "Steve McConnell",
      issueDate: "2025-06-10",
      dueDate: "2025-06-17",
      returnDate: "2025-06-16",
      status: "Returned",
      fine: "₹0",
    },
    {
      id: "br007",
      bookTitle: "You Don't Know JS: Scope & Closures",
      author: "Kyle Simpson",
      issueDate: "2025-05-20",
      dueDate: "2025-05-27",
      returnDate: "2025-05-30",
      status: "Returned",
      fine: "₹10 (Paid)",
    },
  ],
};

export const personalFinesData = {
  totalFines: "₹0",
  fines: [],
};

export const borrowedBooksData = {
  books: [
    {
      id: "br001",
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      status: "Good Standing",
      dueDate: "2025-08-10",
      copyId: "#001",
      borrowedDate: "2025-08-03",
      daysRemaining: "7 days",
      rackLocation: "Rack 2",
    },
    {
      id: "br002",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      status: "Good Standing",
      dueDate: "2025-08-08",
      copyId: "#003",
      borrowedDate: "2025-08-01",
      daysRemaining: "5 days",
      rackLocation: "Rack 1",
    },
    {
      id: "br003",
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      status: "Due Soon",
      dueDate: "2025-08-05",
      copyId: "#002",
      borrowedDate: "2025-07-29",
      daysRemaining: "2 days",
      rackLocation: "Rack 3",
    },
  ],
  reminder:
    "You have 1 book due within the next 2 days. Please plan to return it on time to avoid fines.",
};

export const outstandingFinesData = {
  totalFines: "₹0",
  totalFinesPaid: "₹25",
  lateReturns: "2",
  fineRate: "₹5 per day overdue",
  calculation: "Fine Amount = (Days Overdue) × ₹5",
  example:
    "If a book due on August 5th is returned on August 8th, the fine would be 3 days × ₹5 = ₹15",
  tips: [
    "Set calendar reminders 2 days before your book's due date",
    'Check your "My Borrowed Books" page regularly to track due dates',
    "Visit the library early if you can't finish reading within 7 days",
    "Ask the librarian about renewal options for books you need longer",
    "Plan your reading schedule when borrowing multiple books",
    "Keep your contact information updated for overdue notifications",
  ],
};

export const paymentHistoryData = {
  totalFeesPaid: "₹6,500",
  totalFinesPaid: "₹25",
  lastPayment: "₹500 (Jul 30, 2025)",
  totalPaid: "₹6,525",
  nextPaymentDue: "Next membership fee of ₹500 is due on August 30, 2025",
  transactions: [
    {
      id: "txn001",
      description: "Monthly Membership Fee",
      date: "2025-07-30",
      amount: "₹500",
      type: "Fee",
      transactionId: "TXN202507301523",
      validUntil: "2025-08-30",
      paymentMethod: "Cash",
      collectedBy: "Librarian",
    },
    {
      id: "txn002",
      description: "Late Return Fine",
      date: "2025-07-25",
      amount: "₹15",
      type: "Fine",
      book: "Design Patterns (Gang of Four)",
      daysLate: "3 days",
      fineRate: "₹5/day",
      copyId: "#004",
    },
    {
      id: "txn003",
      description: "Monthly Membership Fee",
      date: "2025-06-30",
      amount: "₹500",
      type: "Fee",
      transactionId: "TXN202506301245",
      validUntil: "2025-07-30",
      paymentMethod: "Cash",
      collectedBy: "Librarian",
    },
    {
      id: "txn004",
      description: "Monthly Membership Fee",
      date: "2025-05-30",
      amount: "₹500",
      type: "Fee",
      transactionId: "TXN202505301834",
      validUntil: "2025-06-30",
      paymentMethod: "Cash",
      collectedBy: "Librarian",
    },
    {
      id: "txn005",
      description: "Late Return Fine",
      date: "2025-05-30",
      amount: "₹10",
      type: "Fine",
      book: "You Don't Know JS (Kyle Simpson)",
      daysLate: "2 days",
      fineRate: "₹5/day",
      copyId: "#007",
    },
  ],
};

export const profileData = {
  memberId: "LIB001234",
  memberSince: "Jan 2023",
  status: "Active",
  nextPayment: "2025-08-30",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+91-9876543210",
  membershipType: "Standard",
  joinDate: "2023-01-15",
};

export const changePasswordData = {
  requirements: [
    "At least 8 characters long",
    "Contains at least one uppercase letter",
    "Contains at least one lowercase letter",
    "Contains at least one number",
  ],
};

export const bookDetailsData = {
  title: "Clean Code: A Handbook of Agile Software Craftsmanship",
  author: "Robert C. Martin",
  availability: "Available - 3 copies in library",
  isbn: "978-0132350884",
  subject: "Programming",
  price: "₹2,499",
  totalCopies: "5 copies",
  description: `
    Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.
    Noted software expert Robert C. Martin presents a revolutionary paradigm with Clean Code: A Handbook of Agile Software Craftsmanship. Martin has teamed up with his colleagues from Object Mentor to distill their best agile practice of cleaning code "on the fly" into a book that will instill within you the values of a software craftsman and make you a better programmer—but only if you work at it.
  `,
  availableCopies: [
    { id: "#001", rack: "Rack 2", status: "Available" },
    { id: "#002", rack: "Rack 2", status: "Available" },
    { id: "#003", rack: "Rack 2", status: "Available" },
  ],
  relatedBooks: [
    "The Pragmatic Programmer by Andrew Hunt",
    "Refactoring by Martin Fowler",
    "Code Complete by Steve McConnell",
  ],
};

export const availableCopiesData = {
  title: "Clean Code: A Handbook of Agile Software Craftsmanship",
  author: "Robert C. Martin",
  totalCopies: "5",
  available: "3",
  issued: "2",
  price: "₹2,499",
  copies: [
    {
      id: "#001",
      status: "Available",
      rackLocation: "Rack 2",
      condition: "Good",
      addedDate: "2023-01-15",
      lastBorrowed: "2025-07-10",
    },
    {
      id: "#002",
      status: "Available",
      rackLocation: "Rack 2",
      condition: "Excellent",
      addedDate: "2023-01-15",
      lastBorrowed: "Never",
    },
    {
      id: "#003",
      status: "Available",
      rackLocation: "Rack 2",
      condition: "Good",
      addedDate: "2024-03-10",
      lastBorrowed: "2025-06-05",
    },
    {
      id: "#004",
      status: "Issued",
      rackLocation: "Rack 2",
      condition: "Fair",
      issuedTo: "Member #1025",
      dueDate: "2025-08-10",
    },
    {
      id: "#005",
      status: "Issued",
      rackLocation: "Rack 3",
      condition: "Good",
      issuedTo: "Member #1087",
      dueDate: "2025-08-08",
      overdue: "2 days",
    },
  ],
};
