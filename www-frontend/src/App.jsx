import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BeerList from './pages/BeerList';
import BarList from './pages/BarList';
import BarEvents from './pages/BarEvents';
import UserSearch from './pages/UserSearch';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/bars/:id/events" element={<BarEvents />} />
        <Route path="/users" element={<UserSearch />} />
      </Routes>
    </Router>
  );
};

export default App;