import requests
import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from postgrest.exceptions import APIError
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv()

url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
youtube_key = os.getenv('YOUTUBE_KEY')
supabase: Client = create_client(url, supabase_key)
youtube = build('youtube', 'v3', developerKey=youtube_key)  # resource object to interact w/ API

def get_youtube_video_details(video_ids):
    youtube_details = []
    
    try:
        # retrieve relevant category video info
        # snippet contains basic details about the video
        response = youtube.videos().list(part='id,snippet,contentDetails,statistics', id=','.join(video_ids)).execute()
        for item in response['items']:
            details = {
                'video_id': item['id'],
                'title': item['snippet']['title'],
                'channel_id': item['snippet']['channelId'],
                'tags': item['snippet']['tags'],
                'category_id': item['snippet']['categoryId']
            }
            youtube_details.append(details)
        print(f"Query successful")
    except HttpError as e:
        print(f"An HTTP error occurred: {e.resp.status} - {e.content}")
    
    return youtube_details

def insert_into_supabase(data):
    for video in data:
        print("L43: Starting new video insert")
        try:
            response = supabase.table('videos').insert(video).execute()
            # if response.error:
            #     print(f"Error inserting video {video['video_id']}: {response.error}")
            # else:
            print(f"Inserted video {video['video_id']} successfully")
        except APIError as e:
            # Log the error message to the console
            print(f"APIError: {e.message}")

def main():
    video_ids = ["xBmEWiWkx9I"]  # this will be what we get from the scraper
    video_details = get_youtube_video_details(video_ids)
    insert_into_supabase(video_details)
if __name__ == '__main__':
    main()
