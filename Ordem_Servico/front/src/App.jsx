import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Patrimonios from './pages/patrimonios';
import Ambientes from './pages/ambientes';
import Manutentores from './pages/manutentores';
import Gestores from './pages/gestores';
import Responsaveis from './pages/responsaveis';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patrimonios" element={<Patrimonios />} />
        <Route path="/ambientes" element={<Ambientes />} />
        <Route path="/manutentores" element={<Manutentores />} />
        <Route path="/gestores" element={<Gestores />} />
        <Route path="/responsaveis" element={<Responsaveis />} />
      </Routes>
    </Router>
  );
}