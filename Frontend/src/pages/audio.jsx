import React, { useState, useRef } from 'react';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/audio.css";

const VirtualCallRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const convertToMp3 = async (audioData) => {
    try {
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Convert audio data to buffer
      const audioBuffer = await audioContext.decodeAudioData(await audioData.arrayBuffer());
      
      // Get audio data
      const channels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const samples = audioBuffer.getChannelData(0); // Get first channel

      // Create WAV file
      const wavBuffer = await audioBufferToWav(audioBuffer);
      
      // Create Blob as MP3
      const mp3Blob = new Blob([wavBuffer], { type: 'audio/mp3' });
      console.log('Successfully converted to MP3');
      return mp3Blob;
    } catch (error) {
      console.error('Error converting to MP3:', error);
      throw error;
    }
  };

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer) => {
    const length = buffer.length * 2;
    const data = new DataView(new ArrayBuffer(44 + length));

    // WAV Header
    writeString(data, 0, 'RIFF');
    data.setUint32(4, 36 + length, true);
    writeString(data, 8, 'WAVE');
    writeString(data, 12, 'fmt ');
    data.setUint32(16, 16, true);
    data.setUint16(20, 1, true);
    data.setUint16(22, 1, true);
    data.setUint32(24, buffer.sampleRate, true);
    data.setUint32(28, buffer.sampleRate * 2, true);
    data.setUint16(32, 2, true);
    data.setUint16(34, 16, true);
    writeString(data, 36, 'data');
    data.setUint32(40, length, true);

    // Write audio data
    const samples = new Float32Array(buffer.getChannelData(0));
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      data.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }

    return data.buffer;
  };

  // Helper function to write strings to DataView
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
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

          console.log('Converting to MP3...');
          const mp3Blob = await convertToMp3(audioBlob);
          
          const formData = new FormData();
          formData.append('file', mp3Blob, 'audio.mp3');

          console.log('Uploading MP3 file...');
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