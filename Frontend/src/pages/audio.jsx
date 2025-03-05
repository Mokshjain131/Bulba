import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/audio.css";
import { createFFmpeg } from '@ffmpeg/ffmpeg';

const VirtualCallRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const ffmpeg = useRef(null);

  // Initialize FFmpeg
  useEffect(() => {
    const loadFFmpeg = async () => {
      ffmpeg.current = createFFmpeg({ log: false });
      await ffmpeg.current.load();
    };
    loadFFmpeg();
  }, []);

  const convertWebmToMp3 = async (webmBlob) => {
    try {
      setIsConverting(true);
      const inputName = 'input.webm';
      const outputName = 'output.mp3';

      // Write the blob to FFmpeg's virtual filesystem
      const arrayBuffer = await webmBlob.arrayBuffer();
      ffmpeg.current.FS('writeFile', inputName, new Uint8Array(arrayBuffer));

      // Run the conversion
      await ffmpeg.current.run('-i', inputName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputName);

      // Read the result
      const data = ffmpeg.current.FS('readFile', outputName);
      const mp3Blob = new Blob([data.buffer], { type: 'audio/mp3' });

      // Clean up files from memory
      ffmpeg.current.FS('unlink', inputName);
      ffmpeg.current.FS('unlink', outputName);

      return mp3Blob;
    } catch (error) {
      console.error('Error converting to MP3:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          audioChunks.current = []; // Clear chunks

          console.log('Converting WebM to MP3...');
          const mp3Blob = await convertWebmToMp3(audioBlob);
          
          console.log('Uploading MP3 file...');
          const formData = new FormData();
          formData.append('file', mp3Blob, 'audio.mp3');

          const response = await fetch('http://localhost:8000/upload-audio', {
            method: 'POST',
            body: formData,
          });
      
          if (response.ok) {
            console.log('Recording uploaded successfully');
          } else {
            const errorData = await response.json();
            console.error('Error uploading recording:', errorData);
          }
        } catch (error) {
          console.error('Error processing recording:', error);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

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
            <svg className="recorder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="currentColor"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="currentColor"/>
            </svg>
            <div className="recorder-buttons">
              <button 
                onClick={startRecording} 
                disabled={isRecording || isConverting}
                className={`record-button ${(isRecording || isConverting) ? 'disabled' : ''}`}
              >
                Start Recording
              </button>
              <button 
                onClick={stopRecording} 
                disabled={!isRecording || isConverting}
                className={`stop-button ${(!isRecording || isConverting) ? 'disabled' : ''}`}
              >
                Stop Recording
              </button>
            </div>
            {isRecording && <div className="recording-indicator">Recording in progress...</div>}
            {isConverting && <div className="recording-indicator">Converting audio...</div>}
          </div>
        </div>
      </div>
    
      <Footer />
    </div>
  );
};

export default VirtualCallRecorder;