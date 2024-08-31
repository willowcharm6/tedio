General notes
- Should values for videos be binary (e.g. this video does/does not promote kindness) or based on a scale? 
    - Accuracy: Is ChatGPT more accurate with one than another?
    - Selection: Would the eventual logic to choose whether or not to recommend a video be harder with one than another?

Workflow
- Get Supabase working - DONE 6/30
- Figure out how to add stuff to the DB on supabase thru website/client - DONE
- Figure out API endpoints - DONE
- Get Python script to interact w/ Supabase - DONE
- Takes channel URLs and populates DB with each video - DONE
- Change prompt and result to output the age categories, not just a number - DONE 8/31
- Finish route to send video_ids
    - Filter by age category
    - Calculate average value score w/ weights (keep even for now)
    - Return video_ids in order of average value