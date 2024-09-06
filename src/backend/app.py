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
import hashlib
import base64

load_dotenv()

#config
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
url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, supabase_key)

weights = {
    'respect': 1,
    'honesty': 1,
    'responsibility': 1,
    'empathy': 1,
    'courage': 1,
    'perseverance': 1,
    'gratitude': 1,
    'curiosity': 1,
    'kindness': 1,
    'science and technology': 1
}

@app.route("/generate_vids", methods=['GET', 'POST'])
@cross_origin()
def send_user_data():
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
            total_weight = 0
            for value in data["value_list"]:
                weight = weights[f"{value}"]
                val_sum += (video[f"{value}"] * weight)  # multiply by weight val from weights dict
                total_weight += weight
                val_len += 1
            avg_score = float(val_sum) / float(total_weight)
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
        # salt and hash pwd
        salt = os.urandom(32)
        hashed_pwd = hashlib.pbkdf2_hmac('sha256', data["password"].encode('utf-8'), salt, 100000)
        data["password"] = base64.b64encode(hashed_pwd).decode('utf-8')
        data["salt"] = base64.b64encode(salt).decode('utf-8')
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

# takes in email and password, returns authentication result msg + whole user object for form population if successful
@app.route("/authenticate", methods=['GET', 'POST'])
@cross_origin()
def authenticate():
    data = request.get_json()
    email = data["email"]
    pwd = data["password"]
    try:
        response = supabase.table('users').select('*').eq('email', email).single().execute()
        stored_salt = response.data['salt']
        stored_password_hash = response.data['password']
        salt = base64.b64decode(stored_salt)
        hashed_password = hashlib.pbkdf2_hmac('sha256', pwd.encode('utf-8'), salt, 100000)
        hashed_password_base64 = base64.b64encode(hashed_password).decode('utf-8')
        print(f"Here are the first 10 characters of stored pwd: {stored_password_hash[:11]}")
        print(f"Here are the first 10 characters of entered pwd: {hashed_password_base64[:11]}")
        if hashed_password_base64 == stored_password_hash:
            user_data = response.data
            print(f"Authentication successful.")
            return jsonify({'status': 'success', 'message': 'You are logged in!', 'user_data': user_data})
        else:
            print(f"Authentication failed.")
            return jsonify({'status': 'failure', 'message': 'Password is incorrect'})

    except Exception as e:
        print(f"Authentication failed")
        return jsonify({'status': 'failure', 'message': 'Email is incorrect'})    
# called if we have difference btwn original user data and entered form data
# @app.route("/retrieve_vids", methods=['GET'])
# @cross_origin()
# def retrieve_user_vids():
#     data = request.get_json()

@app.route("/update_watch_history", methods=['GET', 'POST'])
@cross_origin()
def update_watch_history():
    data = request.get_json()  # send over the user_id + video_history list
    user_id = data["user_id"]
    new_video = data["new_video"]
    try:
        response = supabase.table('users').select('video_history').eq('user_id', user_id).single().execute()
        current_video_history = response.data.get('video_history', []) if response.data else []

        # Prepend the new video data to the current video history
        updated_video_history = [new_video] + current_video_history

        # Upsert the 'video_history' column where 'user_id' matches
        try:
            upsert_response = supabase.table('users').upsert({
                'user_id': user_id,
                'video_history': updated_video_history
            }, on_conflict=['user_id']).execute()
            print(f"Upsert successful.")
            return jsonify({'status': 'success', 'message': 'Upserted video watch history'})

        except Exception as e:
            print(f"Unexpected error: {e}")
            return jsonify({'status': 'failure', 'message': 'An unexpected error occurred during video_history upsert'})

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'status': 'failure', 'message': 'An unexpected error occurred during initial retrieval of video_history'})



if __name__ == '__main__':
    app.run(debug=True)
