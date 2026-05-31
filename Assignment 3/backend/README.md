# Backend API

## Built With
Python 3, Flask 3, Flask-CORS, SQLite

## How to Run

1. Install dependencies: pip install -r requirements.txt

2. Start the server: python server.py

3. API runs at http://localhost:5000

4. To test all endpoints: python test_api.py

## Sample Logins

Customer — van@example.com / password123

Admin — admin@example.com / admin123

## Endpoints

Public
POST   /api/auth/register       Create a new customer account
POST   /api/auth/login          Login and receive a token
GET    /api/books               Browse all books, add ?q= to search by keyword
GET    /api/books/{id}          Get details of a single book

Customer
GET    /api/cart                        View current cart
POST   /api/cart/items                  Add a book to cart
PATCH  /api/cart/items/{book_id}        Update quantity (set 0 to remove)
DELETE /api/cart/items/{book_id}        Remove a book from cart
POST   /api/orders                      Checkout and place order
GET    /api/orders                      View order history
GET    /api/orders/{id}                 View a specific order and shipment
GET    /api/shipments/track             Track all shipments

Admin
POST   /api/admin/books                     Add a new book
PUT    /api/admin/books/{id}                Edit a book
DELETE /api/admin/books/{id}                Delete a book
PATCH  /api/admin/books/{id}/stock          Update stock quantity
PATCH  /api/admin/shipments/{order_id}      Update shipment status
GET    /api/admin/reports/sales             Sales report, add ?from=&to= for date range
GET    /api/admin/reports/low-stock         Books below stock threshold
