import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import HomePage from '../../pages/home-page';
import LoginPage from '../../pages/login-page';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProductId: null
    }
    
  }

  render(props) {

    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={() => <LoginPage />} />
          <Route exact path="/" component={() => <HomePage />} />
        </Switch>
      </Router>
    )
  }
}

export default App;