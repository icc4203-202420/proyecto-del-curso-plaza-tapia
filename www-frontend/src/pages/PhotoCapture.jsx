import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, TextField } from '@mui/material';

const PhotoCapture = () => {
    const { id } = useParams(); // Obtiene el ID del evento desde la URL
    const [preview, setPreview] = useState(null);
    const [cameraOn, setCameraOn] = useState(false);
    const [comment, setComment] = useState(''); // Estado para el comentario
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate(); // Para redirigir después de la captura

    useEffect(() => {
        // Inicia la cámara si está activada
        if (cameraOn) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [cameraOn]);

    // Función para iniciar la cámara
    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => console.error("Error accessing the camera: ", err));
    };

    // Función para detener la cámara
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Función para capturar una foto
    const capturePhoto = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const photoURL = canvasRef.current.toDataURL('image/png');
        setPreview(photoURL);
        setCameraOn(false); // Apaga la cámara después de capturar la foto
    };

    // Función para subir la foto al servidor
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!preview) return;
    
        const token = localStorage.getItem('token');
    
        const blob = await fetch(preview).then(res => res.blob());
        const formData = new FormData();
        
        // Anidar los parámetros dentro de "event_picture"
        formData.append('event_picture[photo]', blob, 'photo.png');
        formData.append('event_picture[event_id]', id); // Añadir el event ID al formulario
        formData.append('event_picture[description]', comment); // Añadir el comentario al formulario
    
        try {
            const response = await fetch('http://127.0.0.1:3001/api/v1/event_pictures', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                alert('Photo uploaded successfully!');
                navigate(`/event-details/${id}`); // Redirige a los detalles del evento después de la subida
            } else {
                const errorData = await response.json();
                alert('Failed to upload photo: ' + errorData.error);
            }
        } catch (error) {
            alert('Error uploading photo: ' + error.message);
        }
    };
    

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Capture a Photo for Event {id}
            </Typography>

            {!cameraOn && !preview && (
                <Button variant="contained" color="primary" onClick={() => setCameraOn(true)}>
                    Start Camera
                </Button>
            )}

            {cameraOn && (
                <>
                    <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
                    <Button variant="contained" color="secondary" onClick={capturePhoto} sx={{ mt: 2 }}>
                        Capture Photo
                    </Button>
                </>
            )}

            {preview && (
                <>
                    <Typography variant="h6" gutterBottom>
                        Photo Preview
                    </Typography>
                    <img src={preview} alt="Captured" style={{ width: '100%', maxWidth: '400px' }} />

                    <TextField
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ mt: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        Upload Photo
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            setPreview(null);
                            setCameraOn(true); // Reabrir la cámara si se quiere hacer otra captura
                        }}
                        sx={{ mt: 2 }}
                    >
                        Retake Photo
                    </Button>
                </>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} width="400" height="300" />
        </Container>
    );
};

export default PhotoCapture;
