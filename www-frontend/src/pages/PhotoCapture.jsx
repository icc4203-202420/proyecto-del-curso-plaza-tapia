import React, { useState, useRef } from 'react';

const PhotoCapture = () => {
    const [preview, setPreview] = useState(null);
    const [cameraOn, setCameraOn] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Turn on the camera
    const startCamera = async () => {
        setCameraOn(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    };

    // Capture a photo from the video stream
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        const imageDataUrl = canvas.toDataURL('image/png');
        setPreview(imageDataUrl);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!preview) return;

        // Convert the base64 image to a Blob
        const blob = await fetch(preview).then((res) => res.blob());
        const formData = new FormData();
        formData.append('photo', blob, 'photo.png');

        try {
            const response = await fetch('http://127.0.0.1:3001/api/v1/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                alert('Photo uploaded successfully!');
            } else {
                alert('Failed to upload photo');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    return (
        <div>
            <h2>Capture a Photo</h2>
            {!cameraOn && (
                <button onClick={startCamera}>
                    Start Camera
                </button>
            )}
            {cameraOn && (
                <div>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
                    <button onClick={capturePhoto}>Capture Photo</button>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            )}
            {preview && (
                <div>
                    <h3>Preview</h3>
                    <img src={preview} alt="Captured" style={{ marginTop: '10px', maxHeight: '200px' }} />
                    <form onSubmit={handleSubmit}>
                        <button type="submit">Upload Photo</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PhotoCapture;