import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import Age from './pages/Age/Age.jsx';
import Values from './pages/Values/Values.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <nav>
            <ul>
              <li>
                <Link to="/values">Values</Link>
              </li>
              <li>
                <Link to="/age">Age</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path={"/values"} element = {<Values />} />
          <Route path={"/age"} element = {<Age />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;