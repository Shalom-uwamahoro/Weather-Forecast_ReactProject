// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Weather from './components/Weather';
import Search from './components/Search';
import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <header className="App-header">
        <h1>Weather Forecast App</h1>
      </header>
      <main>
        {/* Render the Search component on every route */}
        <Search />
        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="/:location" element={<Weather />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;