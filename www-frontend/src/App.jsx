import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BeerList from './pages/BeerList';
import BarList from './pages/BarList';
import BarEvents from './pages/BarEvents';
import UserSearch from './pages/UserSearch';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import BeerDetails from './pages/BeerDetails';
import NewReview from './pages/NewReview';
import ScrollToTop from './services/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from '@mui/material';
import EventDetails from './pages/EventDetails';

const App = () => {
  return (
    <Router>
      <ScrollToTop>
        <Container
          sx={{
            backgroundColor: '#ffffff',
            paddingBottom: '80px',
          }}
        >
          <Header />
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route path="/beers" element={<BeerList />} />
              <Route path="/beers/:id" element={<BeerDetails />} />
              <Route path="/bars" element={<BarList />} />
              <Route path="/bars/:id/events" element={<BarEvents />} />
              <Route path="/users" element={<UserSearch />} />
              <Route path="/new-review/:id" element={<NewReview />} />
              <Route path="/events/:id" element={<EventDetails />} />
            </Route>

          </Routes>
          <Footer />
        </Container>
      </ScrollToTop>
    </Router>
  );
};

export default App;