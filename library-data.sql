
-- IMPORTANT:
-- 1. Run this script AFTER you have created your database schema (Tables: Members, Books, Racks, Copies, Payments, BorrowingTransactions, Fines).
-- 2. Passwords are set to 'password123' for easy testing. In a real application, ALWAYS hash passwords (e.g., using BCrypt).
-- 3. Replace 'library_db' with your actual database name if different.

-- USE library_db; -- Uncomment and replace if you are not already connected to the database

-- -----------------------------------------------------
-- Clear existing data (optional, but good for clean tests)
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0; -- Temporarily disable foreign key checks to allow dropping tables out of order
TRUNCATE TABLE Fines;
TRUNCATE TABLE BorrowingTransactions;
TRUNCATE TABLE Payments;
TRUNCATE TABLE Copies;
TRUNCATE TABLE Books;
TRUNCATE TABLE Racks;
TRUNCATE TABLE Members;
SET FOREIGN_KEY_CHECKS = 1; -- Re-enable foreign key checks

-- -----------------------------------------------------
-- Insert Data into `Members` Table
-- Includes Owners (Librarians) and Members.
-- Some members are initially paid, some are not.
-- -----------------------------------------------------

-- Owners/Librarians
INSERT INTO Members (first_name, last_name, email, phone, password_hash, role, is_active, is_paid_member, last_payment_date) VALUES
('Priya', 'Sharma', 'priya.sharma@library.com', '9812345678', 'password123', 'OWNER', TRUE, TRUE, NULL),
('Amit', 'Verma', 'amit.verma@library.com', '9923456789', 'password123', 'OWNER', TRUE, TRUE, NULL),
('Deepika', 'Gupta', 'deepika.gupta@library.com', '9734567890', 'password123', 'OWNER', TRUE, TRUE, NULL);

-- Members
INSERT INTO Members (first_name, last_name, email, phone, password_hash, role, is_active, is_paid_member, last_payment_date) VALUES
('Rohan', 'Singh', 'rohan.singh@gmail.com', '8011223344', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-25'),
('Sneha', 'Patel', 'sneha.patel@outlook.in', '7022334455', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-01'),
('Aditya', 'Kumar', 'aditya.kumar@yahoo.co.in', '9133445566', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Pooja', 'Das', 'pooja.das@gmail.com', '9244556677', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-15'),
('Vikram', 'Yadav', 'vikram.yadav@outlook.in', '8355667788', 'password123', 'MEMBER', TRUE, TRUE, '2025-06-20'),
('Neha', 'Reddy', 'neha.reddy@gmail.com', '7466778899', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Rahul', 'Jain', 'rahul.jain@yahoo.co.in', '9577889900', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-05'),
('Shruti', 'Mehta', 'shruti.mehta@gmail.com', '8688990011', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-10'),
('Arjun', 'Sarkar', 'arjun.sarkar@outlook.in', '7799001122', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Kavita', 'Rao', 'kavita.rao@gmail.com', '9800112233', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-10'),
('Suresh', 'Nair', 'suresh.nair@yahoo.co.in', '9011223344', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-28'),
('Mona', 'Chopra', 'mona.chopra@gmail.com', '8122334455', 'password123', 'MEMBER', TRUE, TRUE, '2025-06-15'),
('Gaurav', 'Kumar', 'gaurav.kumar@outlook.in', '7233445566', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Anjali', 'Sharma', 'anjali.sharma@gmail.com', '9344556677', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-03'),
('Rajesh', 'Singh', 'rajesh.singh@yahoo.co.in', '8455667788', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-05'),
('Divya', 'Gupta', 'divya.gupta@gmail.com', '7566778899', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Pranav', 'Mishra', 'pranav.mishra@outlook.in', '9677889900', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-12'),
('Sakshi', 'Agarwal', 'sakshi.agarwal@gmail.com', '8788990011', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-22'),
('Vivek', 'Dubey', 'vivek.dubey@yahoo.co.in', '7899001122', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Meena', 'Devi', 'meena.devi@gmail.com', '9900112233', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-15'),
('Siddharth', 'Joshi', 'siddharth.joshi@outlook.in', '9011223344', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-30'),
('Kiran', 'Kumar', 'kiran.kumar@gmail.com', '8022334455', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Alok', 'Singh', 'alok.singh@yahoo.co.in', '7133445566', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-08'),
('Bhavna', 'Shah', 'bhavna.shah@gmail.com', '9244556677', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-18'),
('Raj', 'Patel', 'raj.patel@outlook.in', '8355667788', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Swati', 'Deshmukh', 'swati.deshmukh@gmail.com', '7466778899', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-20'),
('Manish', 'Sharma', 'manish.sharma@yahoo.co.in', '9577889900', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-27'),
('Priya', 'Malhotra', 'priya.malhotra@gmail.com', '8688990011', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Arvind', 'Thakur', 'arvind.thakur@outlook.in', '7799001122', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-22'),
('Sarika', 'Dubey', 'sarika.dubey@gmail.com', '9800112233', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-02'),
('Tarun', 'Mittal', 'tarun.mittal@yahoo.co.in', '9011223344', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Rina', 'Sinha', 'rina.sinha@gmail.com', '8122334455', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-25'),
('Gautam', 'Reddy', 'gautam.reddy@outlook.in', '7233445566', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-12'),
('Ankita', 'Jain', 'ankita.jain@gmail.com', '9344556677', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Pankaj', 'Gupta', 'pankaj.gupta@yahoo.co.in', '8455667788', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-01'),
('Megha', 'Singh', 'megha.singh@gmail.com', '7566778899', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-08'),
('Nitin', 'Sharma', 'nitin.sharma@outlook.in', '9677889900', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Shreya', 'Kumar', 'shreya.kumar@gmail.com', '8788990011', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-07'),
('Sameer', 'Verma', 'sameer.verma@yahoo.co.in', '7899001122', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-17'),
('Sunita', 'Patel', 'sunita.patel@gmail.com', '9900112233', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Akash', 'Das', 'akash.das@outlook.in', '9011223344', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-09'),
('Disha', 'Yadav', 'disha.yadav@gmail.com', '8022334455', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-24'),
('Viveka', 'Reddy', 'viveka.reddy@yahoo.co.in', '7133445566', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Manoj', 'Jain', 'manoj.jain@gmail.com', '9244556677', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-11'),
('Gita', 'Mehta', 'gita.mehta@outlook.in', '8355667788', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-29'),
('Anil', 'Sarkar', 'anil.sarkar@gmail.com', '7466778899', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Sapna', 'Rao', 'sapna.rao@yahoo.co.in', '9577889900', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-13'),
('Rajeev', 'Nair', 'rajeev.nair@outlook.in', '8688990011', 'password123', 'MEMBER', TRUE, TRUE, '2025-07-07'),
('Simran', 'Chopra', 'simran.chopra@gmail.com', '7799001122', 'password123', 'MEMBER', TRUE, FALSE, NULL), -- Not paid
('Kishore', 'Kumar', 'kishore.kumar@yahoo.co.in', '9800112233', 'password123', 'MEMBER', TRUE, TRUE, '2025-08-18');


-- -----------------------------------------------------
-- Insert Data into `Books` Table (100 Records)
-- Mix of genres, authors, and prices.
-- -----------------------------------------------------
INSERT INTO Books (title, author, genre, price, isbn) VALUES
('Clean Code', 'Robert C. Martin', 'Programming', 2499.00, '978-0132350884'),
('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 'Programming', 1899.00, '978-0201616224'),
('JavaScript: The Good Parts', 'Douglas Crockford', 'Programming', 1299.00, '978-0596517748'),
('Design Patterns', 'Erich Gamma et al.', 'Programming', 3299.00, '978-0201633612'),
('Eloquent JavaScript', 'Marijn Haverbeke', 'Programming', 999.00, '978-1593279509'),
('Introduction to Algorithms', 'Thomas H. Cormen et al.', 'Computer Science', 4500.00, '978-0262033848'),
('Cosmos', 'Carl Sagan', 'Science', 850.00, '978-0345539434'),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'History', 799.00, '978-0062316097'),
('The Selfish Gene', 'Richard Dawkins', 'Science', 1100.00, '978-0198788607'),
('A Brief History of Time', 'Stephen Hawking', 'Science', 650.00, '978-0553380163'),
('To Kill a Mockingbird', 'Harper Lee', 'Literature', 450.00, '978-0446310789'),
('1984', 'George Orwell', 'Literature', 399.00, '978-0451524935'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Literature', 350.00, '978-0743273565'),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', 1500.00, '978-0618053267'),
('The Alchemist', 'Paulo Coelho', 'Fiction', 300.00, '978-0061122415'),
('Wings of Fire', 'A.P.J. Abdul Kalam', 'Autobiography', 350.00, '978-8173711463'),
('The Discovery of India', 'Jawaharlal Nehru', 'History', 600.00, '978-0143031022'),
('Ignited Minds', 'A.P.J. Abdul Kalam', 'Self-Help', 250.00, '978-0143420083'),
('My Experiments with Truth', 'Mahatma Gandhi', 'Autobiography', 200.00, '978-8129111814'),
('Train to Pakistan', 'Khushwant Singh', 'Fiction', 280.00, '978-0143037499'),
('Godan', 'Premchand', 'Fiction', 220.00, '978-8129115782'),
('Malgudi Days', 'R.K. Narayan', 'Fiction', 290.00, '978-0140237517'),
('A Suitable Boy', 'Vikram Seth', 'Fiction', 800.00, '978-0375704924'),
('The God of Small Things', 'Arundhati Roy', 'Fiction', 400.00, '978-0812979657'),
('Algorithms Unlocked', 'Thomas H. Cormen', 'Computer Science', 2100.00, '978-0262518802'),
('Deep Learning', 'Ian Goodfellow et al.', 'Computer Science', 5200.00, '978-0262035613'),
('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'Science Fiction', 550.00, '978-0345391803'),
('Dune', 'Frank Herbert', 'Science Fiction', 650.00, '978-0441172719'),
('The Martian', 'Andy Weir', 'Science Fiction', 700.00, '978-0804139021'),
('Cosmos: A Personal Voyage', 'Carl Sagan', 'Science', 900.00, '978-0345331359'),
('The Elegant Universe', 'Brian Greene', 'Science', 750.00, '978-0393326728'),
('Fahrenheit 451', 'Ray Bradbury', 'Dystopian', 420.00, '978-1451673319'),
('Brave New World', 'Aldous Huxley', 'Dystopian', 380.00, '978-0060850524'),
('The Catcher in the Rye', 'J.D. Salinger', 'Literature', 410.00, '978-0316769174'),
('One Hundred Years of Solitude', 'Gabriel Garcia Marquez', 'Literature', 600.00, '978-0060883287'),
('The Odyssey', 'Homer', 'Classics', 300.00, '978-0140449111'),
('The Ramayana', 'Valmiki', 'Mythology', 500.00, '978-0143100377'),
('The Mahabharata', 'Vyasa', 'Mythology', 700.00, '978-0143100391'),
('India After Gandhi', 'Ramachandra Guha', 'History', 950.00, '978-0330505543'),
('The Argumentative Indian', 'Amartya Sen', 'Essays', 550.00, '978-0374105829'),
('Theory of Everything', 'Stephen Hawking', 'Science', 500.00, '978-1593270407'),
('Relativity: The Special and General Theory', 'Albert Einstein', 'Science', 400.00, '978-0517884089'),
('Calculus: Early Transcendentals', 'James Stewart', 'Mathematics', 3800.00, '978-1305266728'),
('Linear Algebra and Its Applications', 'David C. Lay', 'Mathematics', 3500.00, '978-0321982384'),
('Discrete Mathematics and Its Applications', 'Kenneth Rosen', 'Mathematics', 3200.00, '978-0073383095'),
('The Giver', 'Lois Lowry', 'Young Adult', 400.00, '978-0544340688'),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', 600.00, '978-0590353403'),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 700.00, '978-0345339683'),
('The Diary of a Young Girl', 'Anne Frank', 'Biography', 300.00, '978-0553296985'),
('The Book Thief', 'Markus Zusak', 'Historical Fiction', 500.00, '978-0375842207'),
('Becoming', 'Michelle Obama', 'Biography', 750.00, '978-1524763138'),
('The Road', 'Cormac McCarthy', 'Post-apocalyptic', 480.00, '978-0307387899'),
('Educated', 'Tara Westover', 'Memoir', 620.00, '978-0399590504'),
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Psychology', 900.00, '978-0374533557'),
('Atomic Habits', 'James Clear', 'Self-Help', 450.00, '978-0735211292'),
('The 7 Habits of Highly Effective People', 'Stephen Covey', 'Self-Help', 550.00, '978-0743269513'),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 'Personal Finance', 400.00, '978-0446677457'),
('The Intelligent Investor', 'Benjamin Graham', 'Investing', 800.00, '978-0060555665'),
('Zero to One', 'Peter Thiel', 'Business', 600.00, '978-0804139298'),
('Blitzscaling', 'Reid Hoffman', 'Business', 700.00, '978-1524761428'),
('The Lean Startup', 'Eric Ries', 'Business', 650.00, '978-0307887894'),
('Principles: Life and Work', 'Ray Dalio', 'Business', 1200.00, '978-1501124020'),
('Getting Things Done', 'David Allen', 'Productivity', 500.00, '978-0142000281'),
('Flow: The Psychology of Optimal Experience', 'Mihaly Csikszentmihalyi', 'Psychology', 700.00, '978-0061339202'),
('Quiet: The Power of Introverts', 'Susan Cain', 'Psychology', 600.00, '978-0307352140'),
('Man''s Search for Meaning', 'Viktor Frankl', 'Philosophy', 350.00, '978-0807014295'),
('The Republic', 'Plato', 'Philosophy', 400.00, '978-0486443468'),
('Meditations', 'Marcus Aurelius', 'Philosophy', 380.00, '978-0812968255'),
('Thus Spoke Zarathustra', 'Friedrich Nietzsche', 'Philosophy', 450.00, '978-0486422203'),
('A History of India', 'Romila Thapar', 'History', 700.00, '978-0140138364'),
('The Anarchy', 'William Dalrymple', 'History', 850.00, '978-1408899813'),
('Early Indians', 'Tony Joseph', 'History', 600.00, '978-9386228987'),
('The Preamble', 'Subhash Kashyap', 'Political Science', 300.00, '978-8120729340'),
('Indian Polity', 'M. Lakshmikanth', 'Political Science', 700.00, '978-9352603632'),
('Environmental Studies', 'Erach Bharucha', 'Environmental Science', 500.00, '978-8173715454'),
('Operating System Concepts', 'Abraham Silberschatz et al.', 'Computer Science', 3500.00, '978-1118063330'),
('Computer Networks', 'Andrew S. Tanenbaum', 'Computer Science', 3200.00, '978-0132126953'),
('Database System Concepts', 'Abraham Silberschatz et al.', 'Computer Science', 3600.00, '978-0073523323'),
('The Theory of Computation', 'Michael Sipser', 'Computer Science', 2800.00, '978-1133187790'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell & Peter Norvig', 'AI', 4800.00, '978-0136042594'),
('Machine Learning Yearning', 'Andrew Ng', 'AI', 0.00, '978-0999602331'), -- often free/online
('Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', 'Aurélien Géron', 'AI', 2600.00, '978-1492032649'),
('Physics for Scientists and Engineers', 'Raymond A. Serway', 'Physics', 3900.00, '978-1305262799'),
('Chemistry: The Central Science', 'Theodore L. Brown et al.', 'Chemistry', 3700.00, '978-0134414232'),
('Biology', 'Neil A. Campbell', 'Biology', 4200.00, '978-0321558237'),
('Fundamentals of Physics', 'David Halliday et al.', 'Physics', 3800.00, '978-1118230725'),
('Concepts of Physics', 'H.C. Verma', 'Physics', 750.00, '978-8178670830'), -- Indian author
('Organic Chemistry', 'Paula Yurkanis Bruice', 'Chemistry', 4100.00, '978-0134042831'),
('Inorganic Chemistry', 'Catherine E. Housecroft', 'Chemistry', 4000.00, '978-0273742750'),
('Environmental Chemistry', 'Stanley E. Manahan', 'Environmental Science', 2800.00, '978-1498701889'),
('Ecology: The Economy of Nature', 'Robert E. Ricklefs', 'Biology', 3500.00, '978-1429221319'),
('Mathematics for Economists', 'Carl P. Simon & Lawrence Blume', 'Mathematics', 2500.00, '978-0393957088'),
('Probability and Statistics for Engineering and the Sciences', 'Jay L. Devore', 'Mathematics', 3100.00, '978-1305251809'),
('Beginning Algebra', 'Elayn Martin-Gay', 'Mathematics', 1500.00, '978-0321969248'),
('Precalculus', 'Michael Sullivan', 'Mathematics', 2800.00, '978-0321979070'),
('The Palace of Illusions', 'Chitra Banerjee Divakaruni', 'Fiction', 350.00, '978-0385754921'),
('The White Tiger', 'Aravind Adiga', 'Fiction', 320.00, '978-1416562604'),
('Shiva Trilogy: The Immortals of Meluha', 'Amish Tripathi', 'Mythology', 380.00, '978-9380658742'),
('Revolution 2020', 'Chetan Bhagat', 'Fiction', 250.00, '978-8129118714'),
('India Unbound', 'Gurcharan Das', 'Business', 450.00, '978-0140297047'),
('The Habit of Winning', 'Prakash Iyer', 'Self-Help', 300.00, '978-9380749006'),
('Start-up Nation', 'Dan Senor & Saul Singer', 'Business', 600.00, '978-0446549921'),
('The Monk Who Sold His Ferrari', 'Robin Sharma', 'Self-Help', 300.00, '978-0007204860'),
('Think and Grow Rich', 'Napoleon Hill', 'Self-Help', 280.00, '978-0449214942'),
('Your Next Five Moves', 'Patrick Bet-David', 'Business', 800.00, '978-1949709088'),
('Essentialism: The Disciplined Pursuit of Less', 'Greg McKeown', 'Productivity', 500.00, '978-0804137386'),
('The Power of Habit', 'Charles Duhigg', 'Psychology', 600.00, '978-0812981605'),
('Influence: The Psychology of Persuasion', 'Robert Cialdini', 'Psychology', 700.00, '978-0061241895'),
('The Art of War', 'Sun Tzu', 'Philosophy', 250.00, '978-1590302251'),
('Bhagavad Gita', 'Vyasa', 'Philosophy', 200.00, '978-0140447933'),
('Upanishads', 'Various', 'Philosophy', 300.00, '978-0140447490'),
('The Rig Veda', 'Various', 'Mythology', 600.00, '978-0140449890'),
('Ramayana: A Retelling of the Ancient Epic', 'R.K. Narayan', 'Mythology', 350.00, '978-0143037482'),
('Mahabharata: A Modern Retelling', 'William Buck', 'Mythology', 400.00, '978-0520275817'),
('The History of India', 'John Keay', 'History', 900.00, '978-0802137992'),
('A History of the World in 100 Objects', 'Neil MacGregor', 'History', 1100.00, '978-0141041305'),
('The Silk Roads: A New History of the World', 'Peter Frankopan', 'History', 850.00, '978-1101912117'),
('The Mughal Empire', 'John F. Richards', 'History', 700.00, '978-0521566030'),
('The Argumentative Indian', 'Amartya Sen', 'Economics', 550.00, '978-0374105829'), -- Duplicate, but common in libraries
('An Uncertain Glory: India and its Contradictions', 'Amartya Sen & Jean Dreze', 'Economics', 650.00, '978-0143424104'),
('India: A Portrait', 'Patrick French', 'History', 750.00, '978-0007191461'),
('The Story of My Life', 'Helen Keller', 'Biography', 280.00, '978-0486292493'),
('Long Walk to Freedom', 'Nelson Mandela', 'Autobiography', 500.00, '978-0316323543'),
('Becoming a Data Scientist', 'Various Authors', 'Data Science', 1200.00, '978-1234567890'),
('Practical Statistics for Data Scientists', 'Peter Bruce & Andrew Bruce', 'Data Science', 2000.00, '978-1492072973');


-- -----------------------------------------------------
-- Insert Data into `Racks` Table (10 Records)
-- -----------------------------------------------------
INSERT INTO Racks (rack_number, location_description) VALUES
('A-01', 'Ground Floor, Fiction Section, Row 1'),
('A-02', 'Ground Floor, Fiction Section, Row 2'),
('B-P-01', 'First Floor, Programming Books, Shelf 1'),
('B-P-02', 'First Floor, Programming Books, Shelf 2'),
('C-S-01', 'First Floor, Science Books, Shelf 1'),
('C-S-02', 'First Floor, Science Books, Shelf 2'),
('D-H-01', 'Second Floor, History & Philosophy, Shelf 1'),
('D-H-02', 'Second Floor, History & Philosophy, Shelf 2'),
('E-R-01', 'Reference Section, Row 1'),
('F-C-01', 'Children''s Section, Cabinet 1');


-- -----------------------------------------------------
-- Insert Data into `Copies` Table (300 Records)
-- Distribute copies across books and assign to racks.
-- -----------------------------------------------------
INSERT INTO Copies (book_id, rack_id, copy_identifier, status) VALUES
(1, 3, 'CLEANCODE-C001', 'AVAILABLE'), (1, 3, 'CLEANCODE-C002', 'ISSUED'), (1, 3, 'CLEANCODE-C003', 'AVAILABLE'),
(2, 3, 'PRAGMATICPROG-C001', 'AVAILABLE'), (2, 3, 'PRAGMATICPROG-C002', 'ISSUED'),
(3, 4, 'JAVASCRIPTGOOD-C001', 'AVAILABLE'), (3, 4, 'JAVASCRIPTGOOD-C002', 'ISSUED'), (3, 4, 'JAVASCRIPTGOOD-C003', 'AVAILABLE'), (3, 4, 'JAVASCRIPTGOOD-C004', 'AVAILABLE'),
(4, 4, 'DESIGNPATTERNS-C001', 'ISSUED'), (4, 4, 'DESIGNPATTERNS-C002', 'AVAILABLE'),
(5, 3, 'ELOQUENTJS-C001', 'AVAILABLE'), (5, 3, 'ELOQUENTJS-C002', 'ISSUED'),
(6, 5, 'ALGORITHMS-C001', 'AVAILABLE'), (6, 5, 'ALGORITHMS-C002', 'ISSUED'), (6, 5, 'ALGORITHMS-C003', 'AVAILABLE'),
(7, 6, 'COSMOS-C001', 'AVAILABLE'), (7, 6, 'COSMOS-C002', 'AVAILABLE'),
(8, 7, 'SAPIENS-C001', 'ISSUED'), (8, 7, 'SAPIENS-C002', 'AVAILABLE'), (8, 7, 'SAPIENS-C003', 'AVAILABLE'),
(9, 5, 'SELFISHGENE-C001', 'AVAILABLE'),
(10, 6, 'BRIEFHISTORY-C001', 'ISSUED'), (10, 6, 'BRIEFHISTORY-C002', 'AVAILABLE'),
(11, 1, 'MOCKINGBIRD-C001', 'AVAILABLE'), (11, 1, 'MOCKINGBIRD-C002', 'AVAILABLE'),
(12, 1, '1984-C001', 'AVAILABLE'), (12, 1, '1984-C002', 'ISSUED'),
(13, 2, 'GATSBY-C001', 'AVAILABLE'), (13, 2, 'GATSBY-C002', 'AVAILABLE'),
(14, 2, 'LORDODRINGS-C001', 'AVAILABLE'), (14, 2, 'LORDODRINGS-C002', 'ISSUED'),
(15, 1, 'ALCHEMIST-C001', 'AVAILABLE'), (15, 1, 'ALCHEMIST-C002', 'AVAILABLE'), (15, 1, 'ALCHEMIST-C003', 'ISSUED'),
(16, 7, 'WINGSOFFIRE-C001', 'AVAILABLE'), (16, 7, 'WINGSOFFIRE-C002', 'AVAILABLE'),
(17, 7, 'DISCOVERYOFINDIA-C001', 'ISSUED'), (17, 7, 'DISCOVERYOFINDIA-C002', 'AVAILABLE'),
(18, 8, 'IGNITEDMINDS-C001', 'AVAILABLE'),
(19, 7, 'MYEXPERIMENTS-C001', 'AVAILABLE'), (19, 7, 'MYEXPERIMENTS-C002', 'AVAILABLE'),
(20, 1, 'TRAINTOPAKISTAN-C001', 'ISSUED'), (20, 1, 'TRAINTOPAKISTAN-C002', 'AVAILABLE'),
(21, 2, 'GODAN-C001', 'AVAILABLE'),
(22, 1, 'MALGUDIDAYS-C001', 'AVAILABLE'), (22, 1, 'MALGUDIDAYS-C002', 'ISSUED'),
(23, 1, 'SUITABLEBOY-C001', 'AVAILABLE'), (23, 1, 'SUITABLEBOY-C002', 'AVAILABLE'), (23, 1, 'SUITABLEBOY-C003', 'ISSUED'),
(24, 2, 'GODOFSMALLTHINGS-C001', 'AVAILABLE'), (24, 2, 'GODOFSMALLTHINGS-C002', 'AVAILABLE'),
(25, 5, 'ALGORITHMSUNLOCKED-C001', 'AVAILABLE'), (25, 5, 'ALGORITHMSUNLOCKED-C002', 'ISSUED'),
(26, 5, 'DEEPLEARNING-C001', 'AVAILABLE'), (26, 5, 'DEEPLEARNING-C002', 'AVAILABLE'),
(27, 2, 'HITCHHIKERS-C001', 'ISSUED'), (27, 2, 'HITCHHIKERS-C002', 'AVAILABLE'),
(28, 2, 'DUNE-C001', 'AVAILABLE'), (28, 2, 'DUNE-C002', 'AVAILABLE'),
(29, 1, 'THEMARTIAN-C001', 'AVAILABLE'), (29, 1, 'THEMARTIAN-C002', 'ISSUED'),
(30, 6, 'COSMOSPERSONAL-C001', 'AVAILABLE'), (30, 6, 'COSMOSPERSONAL-C002', 'AVAILABLE'),
(31, 6, 'ELEGANTUNIVERSE-C001', 'ISSUED'), (31, 6, 'ELEGANTUNIVERSE-C002', 'AVAILABLE'),
(32, 1, 'FAHRENHEIT451-C001', 'AVAILABLE'),
(33, 2, 'BRAVENEWWORLD-C001', 'AVAILABLE'), (33, 2, 'BRAVENEWWORLD-C002', 'ISSUED'),
(34, 1, 'CATCHERINRYE-C001', 'AVAILABLE'),
(35, 2, 'HUNDREDYEARS-C001', 'AVAILABLE'), (35, 2, 'HUNDREDYEARS-C002', 'AVAILABLE'), (35, 2, 'HUNDREDYEARS-C003', 'ISSUED'),
(36, 7, 'ODYSSEY-C001', 'AVAILABLE'),
(37, 7, 'RAMAYANA-C001', 'AVAILABLE'), (37, 7, 'RAMAYANA-C002', 'AVAILABLE'),
(38, 8, 'MAHABHARATA-C001', 'AVAILABLE'), (38, 8, 'MAHABHARATA-C002', 'ISSUED'),
(39, 7, 'INDIAAFTERGANDHI-C001', 'AVAILABLE'), (39, 7, 'INDIAAFTERGANDHI-C002', 'AVAILABLE'),
(40, 8, 'ARGUMENTATIVEINDIAN-C001', 'AVAILABLE'), (40, 8, 'ARGUMENTATIVEINDIAN-C002', 'ISSUED'),
(41, 6, 'THEORYOFEVERYTHING-C001', 'AVAILABLE'),
(42, 6, 'RELATIVITY-C001', 'AVAILABLE'), (42, 6, 'RELATIVITY-C002', 'AVAILABLE'),
(43, 9, 'CALCULUS-C001', 'ISSUED'), (43, 9, 'CALCULUS-C002', 'AVAILABLE'),
(44, 9, 'LINEARALGEBRA-C001', 'AVAILABLE'), (44, 9, 'LINEARALGEBRA-C002', 'ISSUED'), (44, 9, 'LINEARALGEBRA-C003', 'AVAILABLE'),
(45, 9, 'DISCRETEMATH-C001', 'AVAILABLE'),
(46, 1, 'THEGIVER-C001', 'AVAILABLE'), (46, 1, 'THEGIVER-C002', 'AVAILABLE'),
(47, 10, 'HARRYPOTTER-C001', 'AVAILABLE'), (47, 10, 'HARRYPOTTER-C002', 'ISSUED'), (47, 10, 'HARRYPOTTER-C003', 'AVAILABLE'), (47, 10, 'HARRYPOTTER-C004', 'AVAILABLE'),
(48, 10, 'THEHOBBIT-C001', 'AVAILABLE'), (48, 10, 'THEHOBBIT-C002', 'ISSUED'),
(49, 8, 'DIARYOFAYOUNGGIRL-C001', 'AVAILABLE'),
(50, 2, 'THEBOOKTHIEF-C001', 'AVAILABLE'), (50, 2, 'THEBOOKTHIEF-C002', 'AVAILABLE'), (50, 2, 'THEBOOKTHIEF-C003', 'ISSUED'),
(51, 8, 'BECOMING-C001', 'AVAILABLE'),
(52, 1, 'THEROAD-C001', 'ISSUED'),
(53, 7, 'EDUCATED-C001', 'AVAILABLE'), (53, 7, 'EDUCATED-C002', 'AVAILABLE'),
(54, 7, 'THINKINGFAST-C001', 'AVAILABLE'), (54, 7, 'THINKINGFAST-C002', 'ISSUED'),
(55, 8, 'ATOMICHABITS-C001', 'AVAILABLE'), (55, 8, 'ATOMICHABITS-C002', 'AVAILABLE'), (55, 8, 'ATOMICHABITS-C003', 'ISSUED'),
(56, 8, '7HABITS-C001', 'AVAILABLE'), (56, 8, '7HABITS-C002', 'AVAILABLE'),
(57, 7, 'RICHDADPOORDAD-C001', 'ISSUED'), (57, 7, 'RICHDADPOORDAD-C002', 'AVAILABLE'),
(58, 7, 'INTELLIGENTINVESTOR-C001', 'AVAILABLE'), (58, 7, 'INTELLIGENTINVESTOR-C002', 'AVAILABLE'),
(59, 8, 'ZEROTOONE-C001', 'AVAILABLE'), (59, 8, 'ZEROTOONE-C002', 'ISSUED'),
(60, 7, 'BLITZSCALING-C001', 'AVAILABLE'),
(61, 8, 'LEANSTARTUP-C001', 'AVAILABLE'), (61, 8, 'LEANSTARTUP-C002', 'ISSUED'),
(62, 7, 'PRINCIPLESLIFE-C001', 'AVAILABLE'), (62, 7, 'PRINCIPLESLIFE-C002', 'AVAILABLE'),
(63, 8, 'GETTINGTHINGSDONE-C001', 'AVAILABLE'),
(64, 7, 'FLOWPSYCH-C001', 'ISSUED'), (64, 7, 'FLOWPSYCH-C002', 'AVAILABLE'),
(65, 8, 'QUIETPOWER-C001', 'AVAILABLE'), (65, 8, 'QUIETPOWER-C002', 'AVAILABLE'),
(66, 7, 'MANSSEARCH-C001', 'AVAILABLE'), (66, 7, 'MANSSEARCH-C002', 'ISSUED'),
(67, 8, 'REPUBLIC-C001', 'AVAILABLE'),
(68, 7, 'MEDITATIONS-C001', 'AVAILABLE'), (68, 7, 'MEDITATIONS-C002', 'ISSUED'),
(69, 8, 'THUSSPZARATHUSTRA-C001', 'AVAILABLE'),
(70, 7, 'HISTORYOFINDIA-C001', 'AVAILABLE'), (70, 7, 'HISTORYOFINDIA-C002', 'AVAILABLE'), (70, 7, 'HISTORYOFINDIA-C003', 'ISSUED'),
(71, 7, 'ANARCHY-C001', 'AVAILABLE'), (71, 7, 'ANARCHY-C002', 'ISSUED'),
(72, 8, 'EARLYINDIANS-C001', 'AVAILABLE'),
(73, 7, 'PREAMBLE-C001', 'AVAILABLE'), (73, 7, 'PREAMBLE-C002', 'AVAILABLE'),
(74, 8, 'INDIANPOLITY-C001', 'ISSUED'), (74, 8, 'INDIANPOLITY-C002', 'AVAILABLE'),
(75, 5, 'ENVIRONMENTAL-C001', 'AVAILABLE'), (75, 5, 'ENVIRONMENTAL-C002', 'AVAILABLE'),
(76, 3, 'OPERATINGSYSTEMS-C001', 'AVAILABLE'), (76, 3, 'OPERATINGSYSTEMS-C002', 'ISSUED'), (76, 3, 'OPERATINGSYSTEMS-C003', 'AVAILABLE'),
(77, 3, 'COMPUTERNETWORKS-C001', 'AVAILABLE'), (77, 3, 'COMPUTERNETWORKS-C002', 'ISSUED'),
(78, 4, 'DATABASESYSTEMS-C001', 'AVAILABLE'), (78, 4, 'DATABASESYSTEMS-C002', 'ISSUED'), (78, 4, 'DATABASESYSTEMS-C003', 'AVAILABLE'),
(79, 4, 'THEORYOFCOMPUTATION-C001', 'AVAILABLE'), (79, 4, 'THEORYOFCOMPUTATION-C002', 'ISSUED'),
(80, 5, 'AIAMODERNAPPROACH-C001', 'AVAILABLE'), (80, 5, 'AIAMODERNAPPROACH-C002', 'ISSUED'), (80, 5, 'AIAMODERNAPPROACH-C003', 'AVAILABLE'),
(81, 5, 'MACHINELEARNINGYEARN-C001', 'AVAILABLE'), (81, 5, 'MACHINELEARNINGYEARN-C002', 'AVAILABLE'),
(82, 6, 'HANDSONML-C001', 'AVAILABLE'), (82, 6, 'HANDSONML-C002', 'ISSUED'),
(83, 6, 'PHYSICSFORENG-C001', 'AVAILABLE'), (83, 6, 'PHYSICSFORENG-C002', 'AVAILABLE'),
(84, 9, 'CHEMISTRYCENTRAL-C001', 'AVAILABLE'), (84, 9, 'CHEMISTRYCENTRAL-C002', 'ISSUED'),
(85, 9, 'BIOLOGYCAMPBELL-C001', 'AVAILABLE'), (85, 9, 'BIOLOGYCAMPBELL-C002', 'AVAILABLE'), (85, 9, 'BIOLOGYCAMPBELL-C003', 'ISSUED'),
(86, 9, 'FUNDAMENTALSPHYSICS-C001', 'AVAILABLE'),
(87, 5, 'CONCEPTFPHYSICS-C001', 'AVAILABLE'), (87, 5, 'CONCEPTFPHYSICS-C002', 'ISSUED'),
(88, 6, 'ORGANICCHEMISTRY-C001', 'AVAILABLE'), (88, 6, 'ORGANICCHEMISTRY-C002', 'AVAILABLE'),
(89, 9, 'INORGANICCHEMISTRY-C001', 'AVAILABLE'), (89, 9, 'INORGANICCHEMISTRY-C002', 'ISSUED'),
(90, 5, 'ENVIRONMENTALCHEM-C001', 'AVAILABLE'), (90, 5, 'ENVIRONMENTALCHEM-C002', 'AVAILABLE'),
(91, 6, 'ECOLOGY-C001', 'AVAILABLE'), (91, 6, 'ECOLOGY-C002', 'ISSUED'),
(92, 9, 'MATHFORECON-C001', 'AVAILABLE'), (92, 9, 'MATHFORECON-C002', 'AVAILABLE'),
(93, 9, 'PROBSTAT-C001', 'ISSUED'), (93, 9, 'PROBSTAT-C002', 'AVAILABLE'),
(94, 10, 'BEGINNINGALGEBRA-C001', 'AVAILABLE'), (94, 10, 'BEGINNINGALGEBRA-C002', 'AVAILABLE'),
(95, 10, 'PRECALCULUS-C001', 'ISSUED'), (95, 10, 'PRECALCULUS-C002', 'AVAILABLE'),
(96, 1, 'PALACEOFILLUSIONS-C001', 'AVAILABLE'), (96, 1, 'PALACEOFILLUSIONS-C002', 'AVAILABLE'), (96, 1, 'PALACEOFILLUSIONS-C003', 'ISSUED'),
(97, 1, 'WHITETIGER-C001', 'AVAILABLE'), (97, 1, 'WHITETIGER-C002', 'ISSUED'),
(98, 2, 'SHIVATILOGY-C001', 'AVAILABLE'), (98, 2, 'SHIVATILOGY-C002', 'AVAILABLE'), (98, 2, 'SHIVATILOGY-C003', 'ISSUED'),
(99, 2, 'REVOLUTION2020-C001', 'AVAILABLE'), (99, 2, 'REVOLUTION2020-C002', 'ISSUED'),
(100, 3, 'INDIAUNBOUND-C001', 'AVAILABLE'), (100, 3, 'INDIAUNBOUND-C002', 'AVAILABLE');

-- Additional copies to reach ~300
INSERT INTO Copies (book_id, rack_id, copy_identifier, status) VALUES
(1, 4, 'CLEANCODE-C004', 'AVAILABLE'),
(2, 4, 'PRAGMATICPROG-C003', 'AVAILABLE'),
(3, 3, 'JAVASCRIPTGOOD-C005', 'AVAILABLE'),
(4, 3, 'DESIGNPATTERNS-C003', 'ISSUED'),
(5, 4, 'ELOQUENTJS-C003', 'AVAILABLE'),
(6, 6, 'ALGORITHMS-C004', 'AVAILABLE'),
(7, 5, 'COSMOS-C003', 'AVAILABLE'),
(8, 8, 'SAPIENS-C004', 'AVAILABLE'),
(9, 6, 'SELFISHGENE-C002', 'AVAILABLE'),
(10, 5, 'BRIEFHISTORY-C003', 'AVAILABLE'),
(11, 2, 'MOCKINGBIRD-C003', 'AVAILABLE'),
(12, 2, '1984-C003', 'AVAILABLE'),
(13, 1, 'GATSBY-C003', 'AVAILABLE'),
(14, 1, 'LORDODRINGS-C003', 'AVAILABLE'),
(15, 2, 'ALCHEMIST-C004', 'AVAILABLE'),
(16, 8, 'WINGSOFFIRE-C003', 'AVAILABLE'),
(17, 8, 'DISCOVERYOFINDIA-C003', 'AVAILABLE'),
(18, 7, 'IGNITEDMINDS-C002', 'AVAILABLE'),
(19, 8, 'MYEXPERIMENTS-C003', 'AVAILABLE'),
(20, 2, 'TRAINTOPAKISTAN-C003', 'AVAILABLE');

-- Repeat pattern for more copies
INSERT INTO Copies (book_id, rack_id, copy_identifier, status) VALUES
(25, 6, 'ALGORITHMSUNLOCKED-C003', 'AVAILABLE'),
(26, 6, 'DEEPLEARNING-C003', 'AVAILABLE'),
(27, 1, 'HITCHHIKERS-C003', 'AVAILABLE'),
(28, 1, 'DUNE-C003', 'AVAILABLE'),
(29, 2, 'THEMARTIAN-C003', 'AVAILABLE'),
(30, 5, 'COSMOSPERSONAL-C003', 'AVAILABLE'),
(31, 5, 'ELEGANTUNIVERSE-C003', 'AVAILABLE'),
(32, 2, 'FAHRENHEIT451-C002', 'AVAILABLE'),
(33, 1, 'BRAVENEWWORLD-C003', 'AVAILABLE'),
(34, 2, 'CATCHERINRYE-C002', 'AVAILABLE'),
(35, 1, 'HUNDREDYEARS-C004', 'AVAILABLE'),
(36, 8, 'ODYSSEY-C002', 'AVAILABLE'),
(37, 8, 'RAMAYANA-C003', 'AVAILABLE'),
(38, 7, 'MAHABHARATA-C003', 'AVAILABLE'),
(39, 8, 'INDIAAFTERGANDHI-C003', 'AVAILABLE'),
(40, 7, 'ARGUMENTATIVEINDIAN-C003', 'AVAILABLE'),
(41, 5, 'THEORYOFEVERYTHING-C002', 'AVAILABLE'),
(42, 5, 'RELATIVITY-C003', 'AVAILABLE'),
(43, 10, 'CALCULUS-C003', 'AVAILABLE'),
(44, 10, 'LINEARALGEBRA-C004', 'AVAILABLE'),
(45, 9, 'DISCRETEMATH-C002', 'AVAILABLE');

-- More copies (to hit ~300 total)
INSERT INTO Copies (book_id, rack_id, copy_identifier, status) VALUES
(50, 1, 'THEBOOKTHIEF-C004', 'AVAILABLE'),
(51, 7, 'BECOMING-C002', 'AVAILABLE'),
(52, 2, 'THEROAD-C002', 'AVAILABLE'),
(53, 8, 'EDUCATED-C003', 'AVAILABLE'),
(54, 8, 'THINKINGFAST-C003', 'AVAILABLE'),
(55, 7, 'ATOMICHABITS-C004', 'AVAILABLE'),
(56, 7, '7HABITS-C003', 'AVAILABLE'),
(57, 8, 'RICHDADPOORDAD-C003', 'AVAILABLE'),
(58, 8, 'INTELLIGENTINVESTOR-C003', 'AVAILABLE'),
(59, 7, 'ZEROTOONE-C003', 'AVAILABLE'),
(60, 8, 'BLITZSCALING-C002', 'AVAILABLE'),
(61, 7, 'LEANSTARTUP-C003', 'AVAILABLE'),
(62, 8, 'PRINCIPLESLIFE-C003', 'AVAILABLE'),
(63, 7, 'GETTINGTHINGSDONE-C002', 'AVAILABLE'),
(64, 8, 'FLOWPSYCH-C003', 'AVAILABLE'),
(65, 7, 'QUIETPOWER-C003', 'AVAILABLE'),
(66, 8, 'MANSSEARCH-C003', 'AVAILABLE'),
(67, 7, 'REPUBLIC-C002', 'AVAILABLE'),
(68, 8, 'MEDITATIONS-C003', 'AVAILABLE'),
(69, 7, 'THUSSPZARATHUSTRA-C002', 'AVAILABLE'),
(70, 8, 'HISTORYOFINDIA-C004', 'AVAILABLE'),
(71, 7, 'ANARCHY-C003', 'AVAILABLE'),
(72, 8, 'EARLYINDIANS-C002', 'AVAILABLE'),
(73, 7, 'PREAMBLE-C003', 'AVAILABLE'),
(74, 8, 'INDIANPOLITY-C003', 'AVAILABLE');

-- More copies (to hit ~300 total)
INSERT INTO Copies (book_id, rack_id, copy_identifier, status) VALUES
(76, 4, 'OPERATINGSYSTEMS-C004', 'AVAILABLE'),
(77, 4, 'COMPUTERNETWORKS-C003', 'AVAILABLE'),
(78, 3, 'DATABASESYSTEMS-C004', 'AVAILABLE'),
(79, 3, 'THEORYOFCOMPUTATION-C003', 'AVAILABLE'),
(80, 6, 'AIAMODERNAPPROACH-C004', 'AVAILABLE'),
(81, 6, 'MACHINELEARNINGYEARN-C003', 'AVAILABLE'),
(82, 5, 'HANDSONML-C003', 'AVAILABLE'),
(83, 5, 'PHYSICSFORENG-C003', 'AVAILABLE'),
(84, 10, 'CHEMISTRYCENTRAL-C003', 'AVAILABLE'),
(85, 10, 'BIOLOGYCAMPBELL-C004', 'AVAILABLE'),
(86, 9, 'FUNDAMENTALSPHYSICS-C002', 'AVAILABLE'),
(87, 6, 'CONCEPTFPHYSICS-C003', 'AVAILABLE'),
(88, 5, 'ORGANICCHEMISTRY-C003', 'AVAILABLE'),
(89, 10, 'INORGANICCHEMISTRY-C003', 'AVAILABLE'),
(90, 6, 'ENVIRONMENTALCHEM-C003', 'AVAILABLE'),
(91, 5, 'ECOLOGY-C003', 'AVAILABLE'),
(92, 10, 'MATHFORECON-C003', 'AVAILABLE'),
(93, 10, 'PROBSTAT-C003', 'AVAILABLE'),
(94, 9, 'BEGINNINGALGEBRA-C003', 'AVAILABLE'),
(95, 9, 'PRECALCULUS-C003', 'AVAILABLE'),
(96, 2, 'PALACEOFILLUSIONS-C004', 'AVAILABLE'),
(97, 2, 'WHITETIGER-C003', 'AVAILABLE'),
(98, 1, 'SHIVATILOGY-C004', 'AVAILABLE'),
(99, 1, 'REVOLUTION2020-C003', 'AVAILABLE'),
(100, 4, 'INDIAUNBOUND-C003', 'AVAILABLE');


-- -----------------------------------------------------
-- Insert Data into `BorrowingTransactions` Table (250 Records)
-- Mix of statuses: BORROWED, RETURNED, OVERDUE.
-- Some returned books will have a fine.
-- -----------------------------------------------------
-- Function to get a random member_id (excluding owners, IDs 1-3)
SET @min_member_id = (SELECT MIN(id) FROM Members WHERE role = 'MEMBER');
SET @max_member_id = (SELECT MAX(id) FROM Members WHERE role = 'MEMBER');
SET @random_member_id = (SELECT FLOOR(RAND() * (@max_member_id - @min_member_id + 1)) + @min_member_id);

-- Current Borrowings (approx. 50 records)
INSERT INTO BorrowingTransactions (copy_id, member_id, issue_date, due_date, status) VALUES
((SELECT id FROM Copies WHERE copy_identifier = 'CLEANCODE-C002'), 4, '2025-08-01 10:00:00', '2025-08-08 10:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'PRAGMATICPROG-C002'), 5, '2025-08-02 11:30:00', '2025-08-09 11:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'JAVASCRIPTGOOD-C002'), 7, '2025-07-30 14:00:00', '2025-08-06 14:00:00', 'BORROWED'), -- Due soon
((SELECT id FROM Copies WHERE copy_identifier = 'SAPIENS-C001'), 8, '2025-08-03 09:15:00', '2025-08-10 09:15:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'BRIEFHISTORY-C001'), 10, '2025-08-01 16:00:00', '2025-08-08 16:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = '1984-C002'), 12, '2025-07-28 09:30:00', '2025-08-04 09:30:00', 'BORROWED'), -- Overdue (will be 1 day overdue if current date is Aug 5)
((SELECT id FROM Copies WHERE copy_identifier = 'LORDODRINGS-C002'), 14, '2025-08-04 10:00:00', '2025-08-11 10:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'ALCHEMIST-C003'), 15, '2025-08-02 13:00:00', '2025-08-09 13:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'DISCOVERYOFINDIA-C001'), 17, '2025-07-29 11:00:00', '2025-08-05 11:00:00', 'BORROWED'), -- Due Today/Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'TRAINTOPAKISTAN-C001'), 20, '2025-08-04 15:00:00', '2025-08-11 15:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'MALGUDIDAYS-C002'), 22, '2025-08-01 10:30:00', '2025-08-08 10:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'SUITABLEBOY-C003'), 23, '2025-07-28 17:00:00', '2025-08-04 17:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'ALGORITHMSUNLOCKED-C002'), 25, '2025-08-03 12:00:00', '2025-08-10 12:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'HITCHHIKERS-C001'), 27, '2025-08-02 09:00:00', '2025-08-09 09:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'THEMARTIAN-C002'), 29, '2025-08-04 14:00:00', '2025-08-11 14:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'ELEGANTUNIVERSE-C001'), 31, '2025-07-27 10:00:00', '2025-08-03 10:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'BRAVENEWWORLD-C002'), 33, '2025-08-01 11:00:00', '2025-08-08 11:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'HUNDREDYEARS-C003'), 35, '2025-07-29 16:00:00', '2025-08-05 16:00:00', 'BORROWED'), -- Due Today/Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'MAHABHARATA-C002'), 38, '2025-08-03 10:30:00', '2025-08-10 10:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'ARGUMENTATIVEINDIAN-C002'), 40, '2025-08-02 09:00:00', '2025-08-09 09:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'CALCULUS-C001'), 43, '2025-07-26 12:00:00', '2025-08-02 12:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'LINEARALGEBRA-C002'), 44, '2025-08-04 11:00:00', '2025-08-11 11:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'HARRYPOTTER-C002'), 47, '2025-08-01 15:00:00', '2025-08-08 15:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'THEHOBBIT-C002'), 48, '2025-07-25 10:00:00', '2025-08-01 10:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'THEBOOKTHIEF-C003'), 50, '2025-08-03 09:00:00', '2025-08-10 09:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'THEROAD-C001'), 52, '2025-07-31 11:00:00', '2025-08-07 11:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'THINKINGFAST-C002'), 54, '2025-08-02 14:00:00', '2025-08-09 14:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'ATOMICHABITS-C003'), 55, '2025-07-28 10:00:00', '2025-08-04 10:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'RICHDADPOORDAD-C001'), 57, '2025-08-01 16:30:00', '2025-08-08 16:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'ZEROTOONE-C002'), 59, '2025-07-29 09:00:00', '2025-08-05 09:00:00', 'BORROWED'), -- Due Today/Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'LEANSTARTUP-C002'), 61, '2025-08-04 10:00:00', '2025-08-11 10:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'FLOWPSYCH-C001'), 64, '2025-08-03 11:00:00', '2025-08-10 11:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'MANSSEARCH-C002'), 66, '2025-07-27 15:00:00', '2025-08-03 15:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'MEDITATIONS-C002'), 68, '2025-08-01 10:00:00', '2025-08-08 10:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'HISTORYOFINDIA-C003'), 70, '2025-07-30 14:00:00', '2025-08-06 14:00:00', 'BORROWED'), -- Due soon
((SELECT id FROM Copies WHERE copy_identifier = 'ANARCHY-C002'), 71, '2025-08-02 11:30:00', '2025-08-09 11:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'INDIANPOLITY-C001'), 74, '2025-07-28 09:30:00', '2025-08-04 09:30:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'OPERATINGSYSTEMS-C002'), 76, '2025-08-03 09:15:00', '2025-08-10 09:15:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'COMPUTERNETWORKS-C002'), 77, '2025-08-01 16:00:00', '2025-08-08 16:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'DATABASESYSTEMS-C002'), 78, '2025-07-29 11:00:00', '2025-08-05 11:00:00', 'BORROWED'), -- Due Today/Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'THEORYOFCOMPUTATION-C002'), 79, '2025-08-04 15:00:00', '2025-08-11 15:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'AIAMODERNAPPROACH-C002'), 80, '2025-08-01 10:30:00', '2025-08-08 10:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'HANDSONML-C002'), 82, '2025-07-28 17:00:00', '2025-08-04 17:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'CHEMISTRYCENTRAL-C002'), 84, '2025-08-03 12:00:00', '2025-08-10 12:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'BIOLOGYCAMPBELL-C003'), 85, '2025-08-02 09:00:00', '2025-08-09 09:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'CONCEPTFPHYSICS-C002'), 87, '2025-08-04 14:00:00', '2025-08-11 14:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'INORGANICCHEMISTRY-C002'), 89, '2025-07-27 10:00:00', '2025-08-03 10:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'ECOLOGY-C002'), 91, '2025-08-01 11:00:00', '2025-08-08 11:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'PROBSTAT-C001'), 93, '2025-07-29 16:00:00', '2025-08-05 16:00:00', 'BORROWED'), -- Due Today/Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'PRECALCULUS-C001'), 95, '2025-08-03 10:30:00', '2025-08-10 10:30:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'PALACEOFILLUSIONS-C003'), 96, '2025-08-02 09:00:00', '2025-08-09 09:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'WHITETIGER-C002'), 97, '2025-07-26 12:00:00', '2025-08-02 12:00:00', 'BORROWED'), -- Overdue
((SELECT id FROM Copies WHERE copy_identifier = 'SHIVATILOGY-C003'), 98, '2025-08-04 11:00:00', '2025-08-11 11:00:00', 'BORROWED'),
((SELECT id FROM Copies WHERE copy_identifier = 'REVOLUTION2020-C002'), 99, '2025-08-01 15:00:00', '2025-08-08 15:00:00', 'BORROWED');

-- Returned Borrowings (approx. 200 records, mix of on-time and overdue)
-- Use a loop or repetitive inserts for more data
DELIMITER //
CREATE PROCEDURE InsertDummyTransactions()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE random_copy_id INT;
    DECLARE random_member_id INT;
    DECLARE issue_dt DATETIME;
    DECLARE due_dt DATETIME;
    DECLARE return_dt DATETIME;
    DECLARE fine_amt DECIMAL(10,2);
    DECLARE days_late INT;
    DECLARE current_year INT DEFAULT 2024;
    DECLARE current_month INT DEFAULT 1;

    WHILE i < 200 DO -- Total 200 returned transactions
        SET random_copy_id = (SELECT id FROM Copies ORDER BY RAND() LIMIT 1);
        SET random_member_id = (SELECT id FROM Members WHERE role = 'MEMBER' ORDER BY RAND() LIMIT 1);

        -- Distribute dates over past year or so
        SET issue_dt = STR_TO_DATE(CONCAT(current_year, '-', current_month, '-', FLOOR(1 + RAND() * 28), ' ', FLOOR(8 + RAND() * 10), ':', FLOOR(RAND() * 59), ':', FLOOR(RAND() * 59)), '%Y-%m-%d %H:%i:%s');
        SET due_dt = DATE_ADD(issue_dt, INTERVAL 7 DAY);

        -- Simulate some overdue returns (approx 20%)
        IF RAND() < 0.2 THEN
            SET days_late = FLOOR(1 + RAND() * 5); -- 1 to 5 days late
            SET return_dt = DATE_ADD(due_dt, INTERVAL days_late DAY);
            SET fine_amt = days_late * 5.00;
        ELSE
            SET return_dt = DATE_ADD(issue_dt, INTERVAL FLOOR(1 + RAND() * 6) DAY); -- Returned on time or early
            SET fine_amt = 0.00;
        END IF;

        INSERT INTO BorrowingTransactions (copy_id, member_id, issue_date, due_date, return_date, fine_amount, status)
        VALUES (random_copy_id, random_member_id, issue_dt, due_dt, return_dt, fine_amt, 'RETURNED');
        
        -- Increment month and year for date distribution
        SET current_month = current_month + 1;
        IF current_month > 12 THEN
            SET current_month = 1;
            SET current_year = current_year + 1;
        END IF;

        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL InsertDummyTransactions();
DROP PROCEDURE InsertDummyTransactions;


-- -----------------------------------------------------
-- Insert Data into `Fines` Table
-- Only for overdue BorrowingTransactions that resulted in a fine.
-- Some are paid, some are not.
-- -----------------------------------------------------
INSERT INTO Fines (borrowing_transaction_id, member_id, amount, incurred_date, is_paid, paid_date, collected_by_user_id)
SELECT 
    bt.id,
    bt.member_id,
    bt.fine_amount,
    bt.return_date, -- Fine incurred at return
    CASE WHEN RAND() < 0.7 THEN TRUE ELSE FALSE END AS is_paid, -- 70% paid
    CASE WHEN RAND() < 0.7 THEN DATE_ADD(bt.return_date, INTERVAL FLOOR(RAND() * 10) DAY) ELSE NULL END AS paid_date, -- Paid within 10 days
    (SELECT id FROM Members WHERE role = 'OWNER' ORDER BY RAND() LIMIT 1) -- Random owner collected
FROM 
    BorrowingTransactions bt
WHERE 
    bt.fine_amount > 0;


-- -----------------------------------------------------
-- Insert Data into `Payments` Table (150 Records)
-- Mix of membership fees and fine payments.
-- -----------------------------------------------------

-- Membership Fee Payments (approx. 100 records)
DELIMITER //
CREATE PROCEDURE InsertDummyMembershipPayments()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE m_id INT;
    DECLARE payment_dt DATETIME;
    DECLARE owner_id INT;
    DECLARE current_month INT DEFAULT 1;
    DECLARE current_year INT DEFAULT 2024;

    -- Get all member IDs
    DROP TEMPORARY TABLE IF EXISTS TempMemberIDs;
    CREATE TEMPORARY TABLE TempMemberIDs AS SELECT id FROM Members WHERE role = 'MEMBER';

    WHILE i < 100 DO
        SET m_id = (SELECT id FROM TempMemberIDs ORDER BY RAND() LIMIT 1);
        SET owner_id = (SELECT id FROM Members WHERE role = 'OWNER' ORDER BY RAND() LIMIT 1);
        SET payment_dt = STR_TO_DATE(CONCAT(current_year, '-', current_month, '-', FLOOR(1 + RAND() * 28), ' ', FLOOR(8 + RAND() * 10), ':', FLOOR(RAND() * 59), ':', FLOOR(RAND() * 59)), '%Y-%m-%d %H:%i:%s');

        INSERT INTO Payments (member_id, amount, type, payment_date, period_covered, collected_by_user_id)
        VALUES (m_id, 500.00, 'MEMBERSHIP_FEE', payment_dt, DATE_FORMAT(payment_dt, '%Y-%m'), owner_id);
        
        -- Mark member as paid if this is their latest payment
        UPDATE Members
        SET is_paid_member = TRUE, last_payment_date = payment_dt
        WHERE id = m_id AND (last_payment_date IS NULL OR last_payment_date < payment_dt);

        SET current_month = current_month + 1;
        IF current_month > 12 THEN
            SET current_month = 1;
            SET current_year = current_year + 1;
        END IF;

        SET i = i + 1;
    END WHILE;

    DROP TEMPORARY TABLE TempMemberIDs;
END //
DELIMITER ;

CALL InsertDummyMembershipPayments();
DROP PROCEDURE InsertDummyMembershipPayments;


-- Fine Payments (insert payments for fines that are marked as paid)
INSERT INTO Payments (member_id, amount, type, payment_date, collected_by_user_id)
SELECT 
    f.member_id,
    f.amount,
    'FINE_PAYMENT',
    f.paid_date,
    f.collected_by_user_id
FROM 
    Fines f
WHERE 
    f.is_paid = TRUE;

-- Update `last_payment_date` for members who paid fines (if it's their latest activity)
UPDATE Members m
JOIN (
    SELECT member_id, MAX(payment_date) AS latest_payment
    FROM Payments
    GROUP BY member_id
) AS latest_p ON m.id = latest_p.member_id
SET m.last_payment_date = latest_p.latest_payment
WHERE m.last_payment_date IS NULL OR m.last_payment_date < latest_p.latest_payment;


SELECT 'Dummy data insertion complete!' AS Status;