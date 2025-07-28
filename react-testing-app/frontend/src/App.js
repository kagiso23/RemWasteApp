import './App.css';

import React, { useState, useEffect } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  const login = async () => {
    setLoginError('');
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      setLoggedIn(true);
    } else {
      const err = await res.json();
      setLoginError(err.message || 'Login failed');
    }
  };

  const fetchItems = async () => {
    const res = await fetch('http://localhost:3001/items');
    const data = await res.json();
    setItems(data);
  };

  const saveItem = async () => {
    const endpoint = editId ? `http://localhost:3001/items/${editId}` : 'http://localhost:3001/create';
    const method = editId ? 'PUT' : 'POST';
    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    setText('');
    setEditId(null);
    fetchItems();
  };

  const editItem = (item) => {
    setText(item.text);
    setEditId(item.id);
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:3001/items/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  useEffect(() => {
    if (loggedIn) fetchItems();
  }, [loggedIn]);

  return (
    <div style={{ padding: 20 }}>
      <h2>React CRUD App</h2>
      {!loggedIn ? (
        <>
          <div>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          </div>
        </>
      ) : (
        <>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter item" />
          <button onClick={saveItem}>{editId ? 'Update' : 'Add'}</button>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                {item.text}
                <button onClick={() => editItem(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
