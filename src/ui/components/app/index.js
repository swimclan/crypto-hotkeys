import React, { Component } from 'react';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Matt'
    }
  }

  render(props) {
    return (
      <div className="app-container">Hello, {this.state.name}</div>
    )
  }
}

export default App;