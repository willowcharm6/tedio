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
import openai
from openai import OpenAI

load_dotenv()
url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
print(supabase_key)
supabase: Client = create_client(url, supabase_key)
openai_key = os.getenv('OPENAI_KEY')

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
    print(f"In send_user_data route")
    data = request.get_json()
    print(data)
    try:
        age = int(data["age"])
        # take each value from data["value_list"]
        # for each [value]_score from json body, average it out for the video in a weighted average
        if age <= 4:
            age_category = "preschool"
        elif 5 <= age <= 8:
            age_category = "younger"
        elif 9 <= age <= 12:
            age_category = "older"
        else:
            raise ValueError("Age is outside the valid range for this query (4-12).")
        # Query the Supabase table to get videos matching the age category
        print(age_category)
        response = supabase.table('videos').select('*').eq('age_rating', age_category).execute()
        valid_vids = response.data
        print(f"here is the length of allowed videos: {len(valid_vids)}")
        ranking = {}
        for video in valid_vids:
            val_sum = 0
            val_len = 0
            # total_weight = 0
            for value in data["value_list"]:
                val_sum += video[f"{value}"]  # multiply by weight val from weights dict
                # total_weight += weight_val
                val_len += 1
            avg_score = float(val_sum) / float(val_len)
            ranking[video["video_id"]] = avg_score
        print(f"here is length of value score dict: {len(ranking.keys())}")
        # sort list of video_ids by averaged value_score
        sorted_video_ids = [key for key, value in sorted(ranking.items(), key=lambda item: item[1], reverse=True)]
        # add parameter to data json body called "video_ids"
        print(f"here is length of video_ids sorted by average value score: {len(sorted_video_ids)}")
        data["video_ids"] = sorted_video_ids
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'status': 'failure', 'message': 'An unexpected error occurred when creating list of sorted video_ids'})
    try:
        print(f"trying to send user_data of: {data}")
        response = supabase.table('users').insert(data).execute()
        print(f"Supabase response: {response}")
        # if response.status_code in range (200, 299):
        print(f"Inserted user with age {data['age']} successfully")
        print(f"Inserted user with values")
        for i, val in enumerate(data['value_list']):
            print(f'Value {i + 1}: {val}')
        return jsonify({'status':'success', 'message':'data received', 'video_ids': sorted_video_ids})
        # else:
            # return jsonify({'status':'failure', 'message':'SQL error'})
    except APIError as e:
        print(f"APIError: {e.message}")
        return jsonify({'status':'failure', 'message':e.message})
    except Exception as e:
        print(f"Unexpected error in user data insert: {e}")
        return jsonify({'status': 'failure', 'message': 'An unexpected error occurred when inserting user data'}) 

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
