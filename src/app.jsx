import React from 'react';
import logo from './assets/images/logo.svg';


function App() {
    return (
        <header className="app-contents">
            <img src={logo} className="spinner-logo" alt="react logo" />
            <p>Edit <code>src/App.jsx</code> and save to reload.</p>
            <a href="https://reactjs.org" rel="noreferrer" target="_blank">Learn React</a>
        </header>
    );
}

export default App;