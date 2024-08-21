import requests
import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from postgrest.exceptions import APIError
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import openai
from openai import OpenAI

load_dotenv()

url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
youtube_key = os.getenv('YOUTUBE_KEY')
supabase: Client = create_client(url, supabase_key)
youtube = build('youtube', 'v3', developerKey=youtube_key)  # resource object to interact w/ API
formatter = TextFormatter()
openai_key = os.getenv('OPENAI_KEY')

def get_youtube_video_details(video_ids):
    youtube_details = []
    
    try:
        # retrieve relevant category video info
        # snippet contains basic details about the video
        response = youtube.videos().list(part='id,snippet,contentDetails,statistics', id=','.join(video_ids)).execute()  # API call to get other info about given youtube video
        for item in response['items']:
            transcript = YouTubeTranscriptApi.get_transcript(item['id'])
            formatted_transcript = formatter.format_transcript(transcript)
            print("This is transcript" + formatted_transcript)
            details = {
                'video_id': item['id'],
                'title': item['snippet']['title'],
                'channel_id': item['snippet']['channelId'],
                'tags': item['snippet']['tags'],
                'transcript': transcript,
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

def rate_videos(video_ids):
    client = OpenAI(api_key=openai_key)
    value_list = ["kindness", "cooperation", "honesty"]  # hard-coded
    age = 12  # hard-coded
    # fetch transcript data based on each video id
    for video_id in video_ids:
        try:
            response = supabase.table('videos').select("transcript").eq("video_id", video_id).execute()
            data = response.data
            if data:
                transcript = data[0]['transcript']
                # value_list = data[0]['value_list']
                # age = data[0]['age']

        except APIError as e:
            print(f"API Error: {e.message}")
            return

    prompt = f"""
        
        On a scale from 1 to 10, rate how much the following YouTube video transcript promotes each of these values for a child aged {age}.

        Transcript:
        {transcript}

        Values:
        {value_list}

        Output:
        Provide a dictionary that maps each value to its corresponding score. 
    """

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role":"user", "content":prompt}
        ]
    )
    print(completion.choices[0].message.content)




def main():
    video_ids = ["STUDDsT6lYI"]  # this will be what we get from the scraper
    video_details = get_youtube_video_details(video_ids)
    insert_into_supabase(video_details)
    rate_videos(video_ids)

if __name__ == '__main__':
    main()
