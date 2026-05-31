# Author: Anh Phan
from db import get_connection, row_to_dict, rows_to_list
from models.payment import shipment_from_row

_SHIPMENT_STATUSES = ("pending", "packed", "shipped", "in_transit", "delivered")


class ShipmentRepository:
    def track_for_user(self, user_id):
        conn = get_connection()
        try:
            rows = conn.execute(
                "SELECT o.order_id, o.status, s.tracking_number,"
                "       s.shipment_status, s.eta"
                " FROM orders o JOIN shipments s ON o.order_id = s.order_id"
                " WHERE o.user_id = ?"
                " ORDER BY o.order_id DESC",
                (user_id,),
            ).fetchall()
            return rows_to_list(rows)
        finally:
            conn.close()

    def find_by_order(self, order_id):
        conn = get_connection()
        try:
            row = conn.execute(
                "SELECT shipment_id, order_id, tracking_number, shipment_status, eta"
                " FROM shipments WHERE order_id = ?",
                (order_id,),
            ).fetchone()
            return shipment_from_row(row_to_dict(row))
        finally:
            conn.close()

    def update_status(self, order_id, new_status):
        conn = get_connection()
        try:
            existing = conn.execute(
                "SELECT shipment_id FROM shipments WHERE order_id = ?", (order_id,)
            ).fetchone()
            if not existing:
                return None
            conn.execute(
                "UPDATE shipments SET shipment_status = ? WHERE order_id = ?",
                (new_status, order_id),
            )
            if new_status in ("shipped", "delivered"):
                conn.execute(
                    "UPDATE orders SET status = ? WHERE order_id = ?",
                    (new_status, order_id),
                )
            conn.commit()
            return self.find_by_order(order_id)
        finally:
            conn.close()

    @staticmethod
    def valid_statuses():
        return _SHIPMENT_STATUSES
