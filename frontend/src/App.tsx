import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home: React.FC = () => {
  return <h1>Bem-vindo ao PetPoints!</h1>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;