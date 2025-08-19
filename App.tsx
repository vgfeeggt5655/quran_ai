
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <HashRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    </HashRouter>
  );
};

export default App;
