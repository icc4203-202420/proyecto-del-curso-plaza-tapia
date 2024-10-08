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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/beers" element={<BeerList />} />
          <Route path="/bars" element={<BarList />} />
          <Route path="/bars/:id/events" element={<BarEvents />} />
          <Route path="/users" element={<UserSearch />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;