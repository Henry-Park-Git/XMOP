import React from 'react';
import logo from './logo.svg';
import './App.css'; // App.css 대신 App.scss 사용
import HighlyAvailableDeploymentForm from './components/HighlyAvailableDeploymentForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <nav className="App-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#deployment-options">Deployment Options</a>
          <a href="#deployment-history">Deployment History</a>
        </nav>
      </header>
      <main className="App-body">
        <HighlyAvailableDeploymentForm />
      </main>
      <footer className="App-footer">
        <p>© 2024 Swinburne TIP X-MOP Team. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
