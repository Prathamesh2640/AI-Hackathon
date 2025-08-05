const bcrypt = require("bcryptjs");
const {
  sequelize,
  User,
  Category,
  Rack,
  Book,
  BookCopy,
  Borrowing,
  Payment,
} = require("./models");

const seedDatabase = async () => {
  try {
    // This will drop all tables and re-create them. Use with caution in production!
    await sequelize.sync({ force: true });
    console.log("Database synced!");

    // --- Hashing Passwords ---
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash("password123", salt);

    // --- Seeding Data ---
    // 1. Users
    const users = await User.bulkCreate(
      [
        {
          username: "owner",
          password_hash,
          email: "owner@library.com",
          role: "Owner",
          full_name: "Mr. James Wilson",
          is_paid_member: true,
          last_payment_date: new Date(),
        },
        {
          username: "johndoe",
          password_hash,
          email: "john.doe@email.com",
          role: "Member",
          full_name: "John Doe",
          is_paid_member: true,
          last_payment_date: new Date(),
        },
        {
          username: "janesmith",
          password_hash,
          email: "jane.smith@email.com",
          role: "Member",
          full_name: "Jane Smith",
          is_paid_member: false,
          last_payment_date: null,
        },
        {
          username: "alice",
          password_hash,
          email: "alice.wonder@email.com",
          role: "Member",
          full_name: "Alice Wonder",
          is_paid_member: true,
          last_payment_date: "2025-07-15 10:00:00",
        },
      ],
      { returning: true }
    );
    console.log("Users seeded.");

    // 2. Categories
    const categories = await Category.bulkCreate(
      [
        { category_name: "Programming" },
        { category_name: "Science" },
        { category_name: "Literature" },
        { category_name: "History" },
        { category_name: "Mathematics" },
      ],
      { returning: true }
    );
    console.log("Categories seeded.");

    // 3. Racks
    const racks = await Rack.bulkCreate(
      [
        { rack_name: "A1", location_description: "First floor, East wing" },
        { rack_name: "A2", location_description: "First floor, East wing" },
        { rack_name: "B1", location_description: "First floor, West wing" },
      ],
      { returning: true }
    );
    console.log("Racks seeded.");

    // 4. Books
    const books = await Book.bulkCreate(
      [
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          publication_year: 2008,
          isbn: "978-0132350884",
          category_id: categories[0].category_id,
          average_value: 2499.0,
        },
        {
          title: "The Pragmatic Programmer",
          author: "Andrew Hunt",
          publication_year: 1999,
          isbn: "978-0201616224",
          category_id: categories[0].category_id,
          average_value: 1899.0,
        },
        {
          title: "A Brief History of Time",
          author: "Stephen Hawking",
          publication_year: 1988,
          isbn: "978-0553380163",
          category_id: categories[1].category_id,
          average_value: 1200.0,
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          publication_year: 1960,
          isbn: "978-0061120084",
          category_id: categories[2].category_id,
          average_value: 850.0,
        },
        {
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          publication_year: 2011,
          isbn: "978-0062316097",
          category_id: categories[3].category_id,
          average_value: 1500.0,
        },
      ],
      { returning: true }
    );
    console.log("Books seeded.");

    // 5. BookCopies
    const copies = await BookCopy.bulkCreate(
      [
        {
          book_id: books[0].book_id,
          copy_identifier: "CC-001",
          rack_id: racks[0].rack_id,
          status: "Issued",
        },
        {
          book_id: books[0].book_id,
          copy_identifier: "CC-002",
          rack_id: racks[0].rack_id,
          status: "Available",
        },
        {
          book_id: books[1].book_id,
          copy_identifier: "PP-001",
          rack_id: racks[0].rack_id,
          status: "Available",
        },
        {
          book_id: books[2].book_id,
          copy_identifier: "BHT-001",
          rack_id: racks[1].rack_id,
          status: "Available",
        },
        {
          book_id: books[2].book_id,
          copy_identifier: "BHT-002",
          rack_id: racks[1].rack_id,
          status: "Damaged",
        },
        {
          book_id: books[3].book_id,
          copy_identifier: "TKM-001",
          rack_id: racks[2].rack_id,
          status: "Available",
        },
        {
          book_id: books[4].book_id,
          copy_identifier: "SP-001",
          rack_id: racks[2].rack_id,
          status: "Issued",
        },
      ],
      { returning: true }
    );
    console.log("BookCopies seeded.");

    // 6. Borrowings
    await Borrowing.bulkCreate([
      {
        copy_id: copies[0].copy_id,
        member_id: users[1].user_id,
        issue_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        copy_id: copies[6].copy_id,
        member_id: users[3].user_id,
        issue_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        copy_id: copies[1].copy_id,
        member_id: users[1].user_id,
        issue_date: "2025-07-01 10:00:00",
        due_date: "2025-07-08 10:00:00",
        return_date: "2025-07-10 11:00:00",
        fine_amount: 10.0,
        fine_paid: true,
        overdue_days_at_return: 2,
      },
    ]);
    console.log("Borrowings seeded.");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
