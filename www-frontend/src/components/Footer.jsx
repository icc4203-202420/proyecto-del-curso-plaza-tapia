import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, SportsBar, LocationOn } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <BottomNavigation
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
                height: '80px',
                borderTop: '1px solid #ddd',
                bgcolor: '#fff'
            }}
        >
            <BottomNavigationAction
                icon={<LocationOn />}
                component={Link}
                to="/bars"
                sx={{ minWidth: 'auto' }}
            />

            <BottomNavigationAction
                icon={<Home sx={{ fontSize: 40 }} />}
                component={Link}
                to="/"
                sx={{
                    minWidth: 'auto',
                }}
            />

            <BottomNavigationAction
                icon={<SportsBar />}
                component={Link}
                to="/beers"
                sx={{ minWidth: 'auto' }}
            />
        </BottomNavigation>
    );
};

export default Footer;
