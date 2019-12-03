import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Steve'
    }
  }

  render(props) {
    return (
    <div>Hello, {this.state.name}</div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app-master')
);