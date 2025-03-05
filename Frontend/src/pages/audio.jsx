import React, { useState, useRef } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/audio.css";

const VirtualCallRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        audioChunks.current = []; // Clear chunks
      
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        try {
          const response = await fetch('http://localhost:8000/upload-audio', {
            method: 'POST',
            body: formData,
          });
      
          if (response.ok) {
            console.log('Recording uploaded successfully');
          } else {
            console.error('Error uploading recording:', response.status);
          }
        } catch (error) {
          console.error('Error uploading recording:', error);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Microphone icon SVG
  const MicrophoneIcon = () => (
    <svg className="recorder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="currentColor"/>
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="audio-page">
      <Navbar />
      
      <div className="audio-container">
        <div className="audio-header">
          <h1>Voice Recording</h1>
          <p>Record and analyze your real estate conversations</p>
        </div>

        <div className="recorder-section">
          <div className="recorder-wrapper">
            <MicrophoneIcon />
            <div className="recorder-buttons">
              <button 
                onClick={startRecording} 
                disabled={isRecording}
                className={`record-button ${isRecording ? 'disabled' : ''}`}
              >
                Start Recording
              </button>
              <button 
                onClick={stopRecording} 
                disabled={!isRecording}
                className={`stop-button ${!isRecording ? 'disabled' : ''}`}
              >
                Stop Recording
              </button>
            </div>
            {isRecording && <div className="recording-indicator">Recording in progress...</div>}
          </div>
        </div>
      </div>
    
      <Footer />
    </div>
  );
};

export default VirtualCallRecorder;