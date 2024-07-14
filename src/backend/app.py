from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import logging


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
logger = logging.getLogger(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def homepage():
    return "<p>Starting page</p>"

@app.route("/age")#, methods=['POST'])
# @cross_origin()
def send_age():
    logger.info("Sending age")
    return jsonify({'message': 'age received'})
    # return "<p>I sent age!</p>"

@app.route("/values")#, methods=['POST'])
# @cross_origin()
def send_values():
    logger.info("Sending values")
    return jsonify({'message': 'values received'})

if __name__ == '__main__':
    app.run(debug=True)
