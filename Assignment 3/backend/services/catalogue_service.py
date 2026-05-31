# Author: Anh Phan
from repositories.book_repo import BookRepository
from repositories.cart_repo import CartRepository
from services.auth_service import ValidationError


class CatalogueService:
    def __init__(self):
        self.books = BookRepository()

    def browse(self):
        return [b.to_dict() for b in self.books.list_all()]

    def search(self, term):
        if not term or not term.strip():
            return [b.to_dict() for b in self.books.list_all()]
        return [b.to_dict() for b in self.books.search(term.strip())]

    def details(self, book_id):
        book = self.books.find_by_id(book_id)
        return book.to_dict() if book else None

    def add_book(self, title, author, description, price, category_id, stock):
        if not title or not title.strip():
            raise ValidationError("Title required.")
        price = _positive_number(price, "Price")
        stock = _non_negative_int(stock, "Stock")
        book_id = self.books.create(title.strip(), author, description, price,
                                    category_id, stock)
        if book_id is None:
            raise ValidationError("Failed to add book.")
        book = self.books.find_by_id(book_id)
        return book.to_dict() if book else None

    def edit_book(self, book_id, title, author, description, price, category_id):
        if not self.books.find_by_id(book_id):
            return None
        if not title or not title.strip():
            raise ValidationError("Title required.")
        price = _positive_number(price, "Price")
        self.books.update(book_id, title.strip(), author, description, price, category_id)
        book = self.books.find_by_id(book_id)
        return book.to_dict() if book else None

    def remove_book(self, book_id):
        if not self.books.find_by_id(book_id):
            return False
        self.books.delete(book_id)
        return True

    def set_stock(self, book_id, quantity):
        quantity = _non_negative_int(quantity, "Stock quantity")
        if not self.books.find_by_id(book_id):
            return None
        self.books.set_stock(book_id, quantity)
        book = self.books.find_by_id(book_id)
        return book.to_dict() if book else None


class StockError(Exception):
    pass


class CartService:
    def __init__(self):
        self.carts = CartRepository()
        self.books = BookRepository()

    def view(self, user_id):
        cart_id = self.carts.get_cart_id(user_id)
        items = self.carts.view(cart_id)
        total = round(sum(i["subtotal"] for i in items), 2)
        return {"items": items, "total": total}

    def add(self, user_id, book_id, quantity):
        quantity = _non_negative_int(quantity, "Quantity")
        if quantity < 1:
            raise ValidationError("Quantity min 1.")
        book = self.books.find_by_id(book_id)
        if not book:
            return None
        if not book.in_stock(quantity):
            raise StockError(f"Only {book.stock_quantity} in stock.")
        cart_id = self.carts.get_cart_id(user_id)
        self.carts.add_item(cart_id, book_id, quantity)
        return self.view(user_id)

    def update(self, user_id, book_id, quantity):
        quantity = _non_negative_int(quantity, "Quantity")
        cart_id = self.carts.get_cart_id(user_id)
        if quantity < 1:
            self.carts.remove_item(cart_id, book_id)
            return self.view(user_id)
        book = self.books.find_by_id(book_id)
        if book and not book.in_stock(quantity):
            raise StockError(f"Only {book.stock_quantity} in stock.")
        if not self.carts.update_quantity(cart_id, book_id, quantity):
            return None
        return self.view(user_id)

    def remove(self, user_id, book_id):
        cart_id = self.carts.get_cart_id(user_id)
        self.carts.remove_item(cart_id, book_id)
        return self.view(user_id)


def _positive_number(value, label):
    try:
        v = float(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{label} must be a number.")
    if v <= 0:
        raise ValidationError(f"{label} must be > 0.")
    return round(v, 2)


def _non_negative_int(value, label):
    try:
        v = int(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{label} must be a whole number.")
    if v < 0:
        raise ValidationError(f"{label} cannot be negative.")
    return v
