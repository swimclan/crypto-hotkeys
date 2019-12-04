import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render(props) {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" render={() => <div>Hello from login</div>} />
          <Route exact path="/" render={() => <div>Hello from slash route</div>} />
        </Switch>
      </Router>
    )
  }
}

export default App;