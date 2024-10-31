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
from youtube_transcript_api._errors import *
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
            transcript = ''
            try:
                transcript = YouTubeTranscriptApi.get_transcript(item['id'])
                formatted_transcript = formatter.format_transcript(transcript)
                details = {
                    'video_id': item['id'],
                    'title': item['snippet']['title'],
                    'channel_id': item['snippet']['channelId'],
                    # 'tags': item['snippet']['tags'],
                    'transcript': transcript,
                    'category_id': item['snippet']['categoryId'],
                    'thumbnail': item['snippet']['thumbnails']['high']['url']
                }
                youtube_details.append(details)
                print(f"Query successful")
            except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable, TooManyRequests, YouTubeRequestFailed) as e:
                print(f"didn't find transcript")
            # print("This is transcript" + formatted_transcript)
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
    # TO-DO: Create value list from existing columns in DB
    value_list = [
        "Respect",
        "Honesty",
        "Responsibility",
        "Empathy",
        "Courage",
        "Perseverance",
        "Gratitude",
        "Curiosity",
        "Kindness",
        "Science and Technology",
        "Storytime and Reading",
        "Arts and DIY Projects",
        "Historical Adventures",
        "Geography",
        "Coding and Technology",
        "Active Movement",
        "Language Learning",
        "Nature and Wildlife",
        "Cooking",
        "Phonics",
        "Vocabulary",
        "Kids' Songs and Sing-alongs",
        "Exploration",
        "Problem Solving",
        "Diversity",
        "Storytelling",
        "Reduce, reuse, recycle",
        "Ecosystems",
        "Biographies",
        "Family Activities",
        "Teamwork",
        "Safety and Life Skills",
        "Inspirational Stories"
    ]

    # age = 12  # hard-coded
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

    # TO-DO: change the below prompt to give an age range instead of just a number
        # what the prompt should include: Also recommend an appropriate age rating out of the following labels based on the following YouTube video transcript: preschool (age 4 and under), younger (age 5-8), and older (age 9-12)

        prompt = f"""
            On a scale from 1 to 10, rate how much the following YouTube video transcript promotes each of these values.
            
            Given the following rubric, analyze the provided video transcript and determine its appropriate age category: 'preschool (age 4 and under)', 'younger (ages 5-8)', or 'older (ages 9-12)'.

            Rubric:

            1. Content Appropriateness:
            - Preschool: Simple concepts (colors, numbers, shapes, animals, basic stories), clear and direct messaging, themes of kindness, sharing, basic safety, bright and colorful visuals.
            - Younger: More complex concepts (problem-solving, friendship, basic science, early history), introduction of cause-and-effect relationships, themes of teamwork, curiosity, exploration, detailed and relatable animations.
            - Older: In-depth topics (science experiments, historical events, social issues), introduction of abstract concepts, themes of empathy, leadership, social justice, realistic visuals, mature animation styles.

            2. Video Length:
            - Preschool: 1-5 minutes, quick pacing to maintain attention.
            - Younger: 5-10 minutes, allows for more story development.
            - Older: 10-20 minutes, delves into detailed explanations.

            3. Source/Channel Reliability:
            - All categories: Reputable, child-friendly sources, content rated for the respective age group.

            4. Depth of Content:
            - Preschool: Very light, focused on basic concepts.
            - Younger: Moderate, introduces slightly complex ideas.
            - Older: Deeper exploration, encourages critical thinking.

            5. Language:
            - Preschool: Simple, clear, repetitive, basic vocabulary.
            - Younger: Slightly advanced, introduction of new vocabulary, clear but not overly complex.
            - Older: Complex sentences, advanced vocabulary, expands understanding.

            6. Engagement:
            - Preschool: Interactive elements (songs, dances, questions), gentle participation.
            - Younger: Stories that encourage problem-solving, interactive thinking or small activities.
            - Older: Intellectually challenging, encourages questions and real-world connections, could include quizzes or discussion prompts.

            Analyze the transcript based on these criteria and return the most appropriate age category.

            Additional Scoring Guidelines for Specific Values:
            - **Respect:** Consider respect for self and others as central. Topics on boundaries should be highlighted, as they may influence scoring across sections 1-10.
            - **Historical Adventures:** Expand "history" to include significant movements and biographies that encourage complex, multifaceted understandings over singular events.
            - **Geography:** Critically assess content that challenges borders and colonial/imperialist views; also consider how geography and ecosystems have evolved over time and the reasons for these changes.
            - **Active Movement:** Active engagement in physical activity is essential and may include dance or similar expressions of movement.
            - **Reduce, Reuse, Recycle:** Emphasize all phases of this process, from reduction to recycling.
            - **Ecosystems:** Integrate Indigenous Ways of Knowing (IWOK) into discussions on STEM and ecosystems, considering cultural perspectives within environmental science.
            - **Biographies:** Look for interactive elements such as activities where kids might create auto-biographies (through voice-to-text or as a project with peers/parents), fostering teamwork and self-expression.

            Transcript:
            {transcript}

            Values:
            {value_list}

            Output:
            Respond in the following JSON format but without the 'json' prefix before the dictionary:
            {{
                "value_dict": {{
                    "respect": "insert score",
                    "honesty": "insert score",
                    "responsibility": "insert score",
                    "empathy": "insert score",
                    "courage": "insert score",
                    "perseverance": "insert score",
                    "gratitude": "insert score",
                    "curiosity": "insert score",
                    "kindness": "insert score",
                    "science and technology": "insert score",
                    "storytime and reading": "insert score",
                    "arts and DIY projects": "insert score",
                    "historical adventures": "insert score",
                    "geography": "insert score",
                    "coding and technology": "insert score",
                    "active movement": "insert score",
                    "language learning": "insert score",
                    "nature and wildlife": "insert score",
                    "cooking": "insert score",
                    "phonics": "insert score",
                    "vocabulary": "insert score",
                    "kids' songs and sing-alongs": "insert score",
                    "exploration": "insert score",
                    "problem solving": "insert score",
                    "diversity": "insert score",
                    "storytelling": "insert score",
                    "reduce, reuse, recycle": "insert score",
                    "ecosystems": "insert score",
                    "biographies": "insert score",
                    "family activities": "insert score",
                    "teamwork": "insert score",
                    "safety and life skills": "insert score",
                    "inspirational stories": "insert score"
                }},
                "age_rating": "insert age category label in lowercase without the parenthetical age range"
            }}

            Provide a dictionary that maps each value to its corresponding score.
            Provide the recommended age category label.
"""


        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role":"user", "content":prompt, "response_format":"tyoe"}
            ]
        )
        print(f"at L126: {completion.choices[0].message.content}")
        # TO-DO: iterate thru json output and insert value scores for each value and age rating into DB
        output_dict = json.loads(completion.choices[0].message.content)
        try:
            response = supabase.table('videos').update([
            {'age_rating': output_dict['age_rating']} 
            ]).eq('video_id', video_id).execute()
        except APIError as e:
            print(f"API Error: {e.message}")
            return
        
        try:
            for value, value_score in output_dict["value_dict"].items():
                print(value)
                print(value_score)
                response = supabase.table('videos').update([
                {value: value_score} 
                ]).eq('video_id', video_id).execute()
        except APIError as e:
            print(f"API Error: {e.message}")
            return
        print("success")
    
    # print(output_dict["age_rating"])
    # for value, value_score in output_dict["value_dict"].items():
    #     print(value)
    #     print(value_score)



def main():
    video_ids = [    "1iM-uYX-9Pc", "UI8RX8810hs", "oVJl4FWVP0s", "Z3AeX8SJFt8", "64LZLSgdpSk", "RFSgpeEfQH0",     "rYAPyUxWoqY", "4ZF-oesVO0k", "83sRp4vjzPU", "JlhUh-Cu72E", "4gT-hoQUTcA", "2cwTTMMmDjY",     "0TZSaVr4zB4", "rvet0T6omns", "YuyYK_5oCDU", "f_Zn05fpAAI", "m8_99s290Ig", "mmeFf9cx2qw",     "N0cP2IsL2X8", "hWElhJKNE1U", "zAGOlUCBjIk", "T1FhyfsfpBs", "z0J09l3Xl7M", "0lGrQNNNNic",     "baaRL--DTSo", "Io7z0n_60gY", "CTd-6oldmVM", "KIALnHpyeS4", "HmJn5TxasR8", "-9OvJs0iYM4",     "t_ZvaG4q6_w", "iuFueDZ-6-E", "vpwqVDnkh6U", "1i0V2hf4efY", "PIqJXiuo2Go", "MRvHXURI8K0",     "KJ7vkYRNNQQ", "yU1lCBI2h6Y", "VsyrDo-9U-c", "8liUNhx1Yjc", "BZwcYZNTRPI", "hBMdFDNWGII",     "dLBWZ-4N2Y8", "c2puf8V-v4o", "EFTId5hAi3s", "5x79kFrXXCU", "ETX76Lhy46Q", "VBS8TKl__rs",     "y5AijxIsP2Y"]
    video_details = get_youtube_video_details(video_ids)
    insert_into_supabase(video_details)
    rate_videos(video_ids)

if __name__ == '__main__':
    main()
