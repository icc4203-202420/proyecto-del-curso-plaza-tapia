import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocationOn, Favorite, LocalBar } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <BottomNavigation showLabels sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
            <BottomNavigationAction
                label="Bars"
                icon={<LocationOn />}
                component={Link} 
                to="/bars"
            />
            <BottomNavigationAction
                label="Favorites"
                icon={<Favorite />}
            />
            <BottomNavigationAction 
                label="Beers" 
                icon={<LocalBar />}
                component={Link} 
                to="/beers"
            />
        </BottomNavigation>
    );
};

export default Footer;