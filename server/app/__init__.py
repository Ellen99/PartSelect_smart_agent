# /server/app/__init__.py
from flask import Flask
from flask_cors import CORS
import os


def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'fallback-key-for-development')
    app.config['SESSION_COOKIE_NAME'] = 'my_flask_session'
    CORS(app)
    
    from app.routes import chat_agent
    app.register_blueprint(chat_agent)
    
        # Custom error handler
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Not found"}, 404
    
    @app.errorhandler(500)
    def server_error(error):
        return {"error": "Internal server error"}, 500


    return app