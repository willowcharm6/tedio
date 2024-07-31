import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
// import Homepage from './pages/Homepage/Homepage.jsx';
import Age from './pages/Age/Age.jsx';
import Values from './pages/Values/Values.jsx';
import UserForm from './pages/UserForm/UserForm.jsx';
// import Test from './pages/Values/Submit.jsx'

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
                <Link to="/">Home</Link>
              </li>
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
          {/* <Route path="/" element={<Homepage />} /> */}
          {/* <Route path="/values" element={<Values />} /> */}
          {/* <Route path="/age" element={<Age />} /> */}
          <Route path="/user_form" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
