import React, { Component } from 'react';
import SearchBar from './components/SearchBar'
import TemplateList from './components/TemplateList'
import axios from 'axios';

import './App.css';


const API = 'https://api.leadpages.io';


class App extends Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.state = {query: '', order: 'name'};
    this.API = axios.create({
      baseURL: `${API}/template/v1`,
      timeout: 1000,
      headers: {
        'LP-Security-Token': 'security token or something'
      }
    });
  }

  onSearchChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className="App">
        <SearchBar onChange={this.onSearchChange} API={this.API} />
        <TemplateList query={this.state.query} order={this.state.order} API={this.API} />
      </div>
    );
  }
}

export default App;
