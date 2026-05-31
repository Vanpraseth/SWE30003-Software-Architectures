# Author: Anh Phan
from flask import Flask, jsonify
from flask_cors import CORS

from services.auth_service import ValidationError
from services.catalogue_service import StockError
from routes.routes import ALL_BLUEPRINTS


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.errorhandler(ValidationError)
    def _handle_validation(e):
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(StockError)
    def _handle_stock(e):
        return jsonify({"error": str(e)}), 409

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    for bp in ALL_BLUEPRINTS:
        app.register_blueprint(bp)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
