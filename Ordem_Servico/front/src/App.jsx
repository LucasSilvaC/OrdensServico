import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Patrimonios from './pages/patrimonios';
import Ambientes from './pages/ambientes';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patrimonios" element={<Patrimonios />} />
        <Route path="/ambientes" element={<Ambientes />} />
      </Routes>
    </Router>
  );
}