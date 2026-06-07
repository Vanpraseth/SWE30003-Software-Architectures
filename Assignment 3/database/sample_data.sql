PRAGMA foreign_keys = ON;

INSERT INTO users (full_name, email, password, role)
VALUES
('Van Tuy', 'van@example.com', 'password123', 'customer'),
('Admin User', 'admin@example.com', 'admin123', 'admin'),
('Store Employee', 'employee@example.com', 'staff123', 'employee');

INSERT INTO categories (category_name)
VALUES
('Programming'),
('Cybersecurity'),
('Business'),
('Fiction');

INSERT INTO books (title, author, description, price, category_id)
VALUES
('Python Basics', 'John Smith', 'Beginner Python programming book.', 49.99, 1),
('Network Security', 'Alice Brown', 'Introduction to network security concepts.', 69.99, 2),
('Business Strategy', 'Mark Lee', 'A practical business strategy guide.', 39.99, 3),
('The Silent Library', 'Emma White', 'A fiction story set inside an old bookstore.', 24.99, 4),
('Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship for writing readable, maintainable code.', 55.00, 1),
('The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Classic guide to software development best practices and career growth.', 59.99, 1),
('Introduction to Algorithms', 'Thomas H. Cormen', 'Comprehensive textbook covering a broad range of algorithms in depth.', 89.99, 1),
('The Web Application Hacker''s Handbook', 'Dafydd Stuttard', 'In-depth guide to finding and exploiting security flaws in web applications.', 74.99, 2),
('The Art of Invisibility', 'Kevin Mitnick', 'How to stay safe and private online by the world''s most famous hacker.', 34.99, 2),
('The Lean Startup', 'Eric Ries', 'How modern companies use continuous innovation to build successful businesses.', 32.99, 3),
('Zero to One', 'Peter Thiel', 'Notes on startups and how to build companies that create new things.', 29.99, 3),
('1984', 'George Orwell', 'A dystopian novel about totalitarianism, surveillance, and the loss of individual freedom.', 19.99, 4),
('Dune', 'Frank Herbert', 'Epic science fiction saga of politics, religion, and survival on a desert planet.', 22.99, 4);

INSERT INTO inventory (book_id, stock_quantity, low_stock_threshold)
VALUES
(1, 10, 3),
(2, 5, 3),
(3, 8, 3),
(4, 2, 3),
(5, 12, 3),
(6, 9, 3),
(7, 4, 3),
(8, 7, 3),
(9, 6, 3),
(10, 15, 3),
(11, 11, 3),
(12, 20, 3),
(13, 8, 3);

INSERT INTO carts (user_id)
VALUES (1);

INSERT INTO cart_items (cart_id, book_id, quantity)
VALUES
(1, 1, 2),
(1, 2, 1);

INSERT INTO orders (user_id, delivery_address, total_price, status)
VALUES
(1, 'Hawthorn VIC 3122', 169.97, 'paid');

INSERT INTO order_items (order_id, book_id, quantity, unit_price, subtotal)
VALUES
(1, 1, 2, 49.99, 99.98),
(1, 2, 1, 69.99, 69.99);

INSERT INTO payments (order_id, amount, payment_method, payment_status)
VALUES
(1, 169.97, 'card', 'processed');

INSERT INTO invoices (order_id, receipt_message)
VALUES
(1, 'Payment processed successfully. Invoice and receipt generated.');

INSERT INTO shipments (order_id, tracking_number, shipment_status, eta)
VALUES
(1, 'TRK10001', 'pending', '3-5 business days');
