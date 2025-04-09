# /server/app/__init__.py
from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config['SESSION_COOKIE_NAME'] = 'my_flask_session'
    
    CORS(app)  # Enable CORS for all routes
    from . import routes
    app.register_blueprint(routes.bp)
    return app