import React, { Component } from 'react';
import SearchBar from './components/SearchBar'
import TemplateList from './components/TemplateList'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.state = {query: '', order: 'name'};
  }

  onSearchChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className="App">
        <SearchBar onChange={this.onSearchChange}/>
        <TemplateList query={this.state.query} order={this.state.order}/>
      </div>
    );
  }
}

export default App;
