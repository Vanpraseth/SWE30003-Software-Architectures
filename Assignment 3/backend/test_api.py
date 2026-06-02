"""
Runs all API scenarios using Flask's built-in test client.
No server needed — just run this file directly.
"""
import json
import server as application

client = application.app.test_client()


def show(label, resp):
    try:
        body = resp.get_json()
    except Exception:
        body = resp.data.decode()
    print(f"\n[{resp.status_code}] {label}")
    print(json.dumps(body, indent=2)[:600])


print("=" * 55)
print("FAVOURITE BOOKS API - EXECUTION EVIDENCE")
print("=" * 55)

# --- Public catalogue ---
show("Browse all books (public, no login)", client.get("/api/books"))
show("Search q=security", client.get("/api/books?q=security"))
show("Book detail id=1", client.get("/api/books/1"))
show("Book detail id=999 (not found)", client.get("/api/books/999"))

# --- Registration validation ---
show("Register VALID", client.post("/api/auth/register", json={
    "full_name": "Test User", "email": "test@example.com", "password": "secret1"}))
show("Register invalid email (expect 400)", client.post("/api/auth/register", json={
    "full_name": "Bad", "email": "notanemail", "password": "secret1"}))
show("Register short password (expect 400)", client.post("/api/auth/register", json={
    "full_name": "Bad", "email": "x@y.com", "password": "12"}))
show("Register blank name (expect 400)", client.post("/api/auth/register", json={
    "full_name": "", "email": "z@y.com", "password": "secret1"}))

# --- Login ---
show("Login wrong password (expect 401)", client.post("/api/auth/login", json={
    "email": "test@example.com", "password": "wrong"}))
login = client.post("/api/auth/login", json={
    "email": "test@example.com", "password": "secret1"})
show("Login VALID", login)
token = login.get_json()["token"]
H = {"Authorization": f"Bearer {token}"}

# --- Cart (auth) ---
show("View cart without token (expect 401)", client.get("/api/cart"))
show("Add book 1 x2 to cart", client.post("/api/cart/items",
     json={"book_id": 1, "quantity": 2}, headers=H))
show("Add book 4 x5 - only 2 in stock (expect 409)", client.post(
     "/api/cart/items", json={"book_id": 4, "quantity": 5}, headers=H))
show("Add book 4 x1 (ok)", client.post("/api/cart/items",
     json={"book_id": 4, "quantity": 1}, headers=H))
show("Update book 1 -> qty 3 (change of mind)", client.patch(
     "/api/cart/items/1", json={"quantity": 3}, headers=H))
show("Update book 4 -> qty 0 (removal)", client.patch(
     "/api/cart/items/4", json={"quantity": 0}, headers=H))
show("View cart", client.get("/api/cart", headers=H))

# --- Checkout ---
show("Checkout no address (expect 400)", client.post("/api/orders",
     json={}, headers=H))
show("Checkout VALID", client.post("/api/orders",
     json={"delivery_address": "Hawthorn VIC 3122"}, headers=H))
show("Order history", client.get("/api/orders", headers=H))
show("Order detail id=1", client.get("/api/orders/1", headers=H))

# --- Admin ---
admin = client.post("/api/auth/login", json={
    "email": "admin@example.com", "password": "admin123"})
AH = {"Authorization": f"Bearer {admin.get_json()['token']}"}
show("Customer hits admin route (expect 403)", client.post(
     "/api/admin/books", json={"title": "X", "price": 10}, headers=H))
show("Admin add book", client.post("/api/admin/books", json={
     "title": "Clean Code", "author": "R. Martin", "description": "Craftsmanship",
     "price": 55.00, "category_id": 1, "stock": 7}, headers=AH))
show("Admin add book invalid price (expect 400)", client.post(
     "/api/admin/books", json={"title": "Bad", "price": -5}, headers=AH))
show("Admin set stock book 1 -> 20", client.patch(
     "/api/admin/books/1/stock", json={"quantity": 20}, headers=AH))

# --- Shipment tracking ---
show("Customer tracks shipments", client.get("/api/shipments/track", headers=H))
show("Admin marks order 1 shipped", client.patch(
     "/api/admin/shipments/1", json={"status": "shipped"}, headers=AH))
show("Admin invalid shipment status (expect 400)", client.patch(
     "/api/admin/shipments/1", json={"status": "teleported"}, headers=AH))
show("Admin shipment for missing order (expect 404)", client.patch(
     "/api/admin/shipments/999", json={"status": "shipped"}, headers=AH))
show("Customer re-tracks (status now shipped)", client.get(
     "/api/shipments/track", headers=H))

# --- Reports ---
show("Admin sales report", client.get("/api/admin/reports/sales", headers=AH))
show("Admin sales report bad date (expect 400)", client.get(
     "/api/admin/reports/sales?from=31-05-2026", headers=AH))
show("Admin low-stock report", client.get(
     "/api/admin/reports/low-stock", headers=AH))
show("Customer hits reports (expect 403)", client.get(
     "/api/admin/reports/sales", headers=H))

print("\n" + "=" * 55)
print("ALL SCENARIOS EXECUTED")
print("=" * 55)
