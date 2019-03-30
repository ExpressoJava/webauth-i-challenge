import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import RegisterPage from './components/RegisterPage';
//import LoginPage from './components/LoginPage';
//import Users from './components/Users';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/register" component={RegisterPage} />
        {/* <Route path="/login" component={LoginPage} /> */}
        {/* <Route path="/users" component={Users} /> */}
        <h2>testing</h2>
        < RegisterPage />
      </div>
    );
  }
}

export default App;
