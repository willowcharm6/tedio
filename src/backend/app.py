from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from postgrest.exceptions import APIError
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# setting up flask
app = Flask(__name__)
CORS(app)
logger = logging.getLogger(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# setting up DB
load_dotenv()

url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
# youtube_key = os.getenv('YOUTUBE_KEY')
supabase: Client = create_client(url, supabase_key)
# youtube = build('youtube', 'v3', developerKey=youtube_key)  # resource object to interact w/ API

# @app.route("/")
# @cross_origin()
# def homepage():
#     return "<p>Starting page</p>"

@app.route("/send_user_data", methods=['GET', 'POST'])
@cross_origin()
def send_user_data():
    # fake_req = {'age':6}
    print("In send_user_data route")
    data = request.get_json()
    # return jsonify({'status':'success', 'message':'data received'})
    try:
        print("trying to send user_data")
        response = supabase.table('users').insert(data).execute()
        print(f"Supabase response: {response}")
        # if response.status_code in range (200, 299):
        print(f"Inserted user with age {data['age']} successfully")
        print(f"Inserted user with values")
        for i, val in enumerate(data['value_list']):
            print(f'Value {i + 1}: {val}')
        return jsonify({'status':'success', 'message':'data received'})
        # else:
            # return jsonify({'status':'failure', 'message':'SQL error'})
    except APIError as e:
        print(f"APIError: {e.message}")
        return jsonify({'status':'failure', 'message':e.message})
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'status': 'failure', 'message': 'An unexpected error occurred'}) 

@app.route("/values", methods=['GET', 'POST'])
@cross_origin()
def send_values():
    print("Sending values")
    return jsonify({'message': 'values received'})

# TO-DO: write route that gets called by handleSubmit button: age, values -> list of video ids
    # filter videos by age range
    # for each of the given values, sum up the value scores and average them across the number of values
    # add videos ids in order of highest to lowest aggregated value scores

if __name__ == '__main__':
    app.run(debug=True)
