import React, { useState, useRef } from 'react';
//import axios from 'axios';  

function VirtualCallRecorder() {
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
      
        // Create FormData object
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        try {
          const response = await fetch('http://localhost:8000/upload-audio', {
            method: 'POST',
            body: formData, // Send as FormData instead of binary
            // Remove the Content-Type header - it will be set automatically with boundary
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

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
}

export default VirtualCallRecorder;