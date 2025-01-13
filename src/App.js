import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Inbox from './components/Inbox';
import ChatWidget from './components/ChatWidget';
import { auth } from './firebase';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Inbox /> : <Login />} />
        <Route path="/chat" element={<ChatWidget />} />
      </Routes>
    </Router>
  );
}

export default App;
