export const memberData = [
  {
    id: "2",
    name: "John Doe",
    email: "member@example.com",
    borrowedBooks: [
      {
        title: "Introduction to Algorithms",
        dueDate: "2025-08-10",
        copyId: "1-2",
      },
      {
        title: "Introduction to Algorithms",
        dueDate: "2025-07-30",
        copyId: "1-5",
      },
      { title: "Clean Code", dueDate: "2025-08-05", copyId: "2-3" },
    ],
    fines: [
      {
        bookTitle: "Introduction to Algorithms",
        amount: 30,
        reason: "Overdue by 6 days",
        status: "Unpaid",
      },
    ],
  },
];
