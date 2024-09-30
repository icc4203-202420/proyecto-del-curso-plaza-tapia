import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, CircularProgress } from '@mui/material';

const UserProfile = () => {
    const { userId } = useParams(); // Get the userId from the URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFriend, setIsFriend] = useState(false); // Track if the user is already a friend
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleAddFriend = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:3001/api/v1/users/${userId}/friendships`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFriend(true); // Set the state to reflect the new friendship
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container sx={{ marginTop: 4, alignItems: 'flex-start', justifyContent: 'flex-start' }}> {/* Adjusted to move content to the top */}
            {user && (
                <>
                    <Typography variant="h4" sx={{ color: 'black' }}>
                        {`${user.first_name} ${user.last_name}`}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'black' }}>
                        {`Handle: ${user.handle}`}
                    </Typography>

                    {isFriend ? (
                        <Typography sx={{ color: 'green', mt: 2 }}>
                            You are friends with this user.
                        </Typography>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddFriend}
                            sx={{ mt: 2 }}
                        >
                            Add Friend
                        </Button>
                    )}
                </>
            )}
        </Container>
    );
};

export default UserProfile;