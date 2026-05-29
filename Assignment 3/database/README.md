Vanpraseth Tuy - Database Part

Database used: SQLite  
Database file: bookstore.db

What is included

- schema.sql
- sample_data.sql
- api_queries.sql
- bookstore.db
- database_report_section.txt
- message_to_group.txt

Tables

- users
- categories
- books
- inventory
- carts
- cart_items
- orders
- order_items
- payments
- invoices
- shipments
- sales_report_view

Supported features

1. Customer registration and login
2. Book browsing and searching
3. Book detail and stock display
4. Shopping cart add/update/delete
5. Checkout and order creation
6. Payment confirmation
7. Invoice and receipt generation
8. Shipment tracking
9. Inventory management
10. Sales reporting

How to run

Open terminal in this folder and run:

sqlite3 bookstore.db

Then test:

.tables
SELECT * FROM books;
SELECT * FROM users;
SELECT * FROM sales_report_view;

Rebuild database

sqlite3 bookstore.db < schema.sql
sqlite3 bookstore.db < sample_data.sql
