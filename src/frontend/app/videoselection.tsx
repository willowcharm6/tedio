import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Button, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { WebView } from 'react-native-webview';  // Used only for iOS/Android

export default function VideoSelectionScreen({ navigation, route }) {
  const [videos, setVideos] = useState([]);  // Dynamic video list state
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Dummy data to use if the backend fetch fails
  const dummyData = [
    { title: 'Chris learns sharing and good behavior for kids with friends', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
    { title: 'The Amazing Spider-Corgi', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg'},
    { title: 'Moe Explores Cheese', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
    { title: 'Baby Shark Dance', videoId: 'XqZsoesa55w', thumbnail: 'https://img.youtube.com/vi/XqZsoesa55w/0.jpg' },
    { title: 'Another Video 1', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
    { title: 'Another Video 2', videoId: 'XqZsoesa55w', thumbnail: 'https://img.youtube.com/vi/XqZsoesa55w/0.jpg' },
    { title: 'Another Video 3', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
    { title: 'Another Video 4', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
    { title: 'Another Video 5', videoId: 'XqZsoesa55w', thumbnail: 'https://img.youtube.com/vi/XqZsoesa55w/0.jpg' },
    { title: 'Another Video 6', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
    { title: 'Another Video 7', videoId: 'XqZsoesa55w', thumbnail: 'https://img.youtube.com/vi/XqZsoesa55w/0.jpg' },
    { title: 'Another Video 8', videoId: 'Aw0vXw5sa4M', thumbnail: 'https://img.youtube.com/vi/Aw0vXw5sa4M/0.jpg' },
  ];
  
  // const route = useRoute();
  const { jsonFinalData } = route.params;
  console.log(`data: ${jsonFinalData}`)
  // if jsonFinalData has parameter recommended_vids --> coming from login, so just render these videos in the data
  if (jsonFinalData.recommended_vids !== undefined) {
    console.log(`coming from login: ${jsonFinalData}`)
    // assign recommended_vids to video state var.
  }

  else {
    console.log(`coming from sign up ${jsonFinalData}`)
  }

  console.log(`my data is here!!!!! ${jsonFinalData}`); // This will print the finalData object

  // Fetch from the backend
  const fetchVideos = async () => {
    try {
      // Replace this URL with your backend endpoint when ready
      const response = await fetch('http://localhost:5000/generate_vids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonFinalData),
      });
      
      // If fetch fails or returns error, we will use dummy data
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      
      const data = await response.json();  // Assuming backend sends an array of video objects
      console.log(`Received data from backend: ${JSON.stringify(data)}`)
      setVideos(data.data);  // Set fetched videos into state
      setLoading(false);
      console.log("reached L54!")
    } catch (err) {
      console.error('Error fetching from backend, using dummy data:', err.message);
      // If there's an error, use the dummy data
      setVideos(dummyData);
      setError(null);  // Clear the error because we're using dummy data
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();  // Fetch videos when the component mounts
  }, []);

  const handleVideoPress = async (videoId) => {
    setSelectedVideo(videoId);

    setModalVisible(true);

    try{
      const userID = await AsyncStorage.getItem('userID');
      console.log(JSON.stringify({
        userID,
        videoId,
      }));
      const response = await fetch("http://localhost:5000/update_watch_history", {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          userID,
          videoId,
        }),
      });
      if(!response.ok){
        throw new Error('Failed to save video selection');
      }
      console.log ('Video selection saved to backend');

      }catch(error){
        console.error('Error saving video selection:',error);
      }
    };
  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F0DA60" />  {/* Show loader while fetching */}
        <Text>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>  {/* Show error message if fetching fails */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <ScrollView contentContainerStyle={styles.videoContainer}>
        {videos.map((video) => (
          <TouchableOpacity key={video.videoId} style={styles.videoItem} onPress={() => handleVideoPress(video.videoId)}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <View style={styles.captionContainer}>
              <Text style={styles.videoTitle}>{video.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedVideo && (
        <Modal visible={modalVisible} animationType="slide" transparent={false}>
          <View style={styles.fullScreenVideoContainer}>
            {Platform.OS === 'web' ? (
              <iframe
                width="100%"
                height="100%"  // Full-screen video
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Player"
                style={styles.fullScreenVideo}  // Ensure full-screen mode
              ></iframe>
            ) : (
              <WebView
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                source={{ uri: `https://www.youtube.com/embed/${selectedVideo}?autoplay=1` }}
              />
            )}
            <Button title="Close" onPress={closeModal} style={styles.closeButton} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B3D2F',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoItem: {
    width: '23%',  // 4 items per row
    marginBottom: 20,
    backgroundColor: '#000',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',  // Square border with a palette color
    overflow: 'hidden',  // To ensure the thumbnail and caption are enclosed
  },
  thumbnail: {
    width: '100%',
    height: 150,  // Same size for all thumbnails
  },
  captionContainer: {
    backgroundColor: 'black',  // Black caption background from palette
    padding: 5,
    opacity: '80%',
  },
  videoTitle: {
    fontSize: 12,
    color: '#FFF',  // White text for captions
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fullScreenVideoContainer: {
    flex: 1,
    backgroundColor: '#000',  // Black background for full-screen video
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',  // Full-screen video dimensions
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
