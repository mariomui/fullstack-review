import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

function asyncGetRepos(term) {
  return new Promise(resolve => {
    console.log('asyncGetRepos');
    $.ajax({
      url: 'http://localhost:1128/repos',
      method: 'GET',
      dataType: 'json',
      data: {term},
      success: (response) => {
        resolve(response);
      }
    });
  })
};

function asyncSearchRepos(term) {
  return new Promise(resolve => {
    $.ajax({
      url: 'http://localhost:1128/repos',
      method: 'POST',
      dataType: 'json',
      data: {term: term},
      success: (response) => {
        console.log('success', response);
        resolve(response);
      }
    })
  })
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      repos: [],
    }
    this.search = this.search.bind(this);
  }

  search(term) {
    console.log(`${term} was searched`);
    // TODO
    asyncSearchRepos(term)
      .then(() => asyncGetRepos(term))
      .then((response) => {
        this.setState({repos: response});
      })
  }

  render () {
    return (
      <div>
        <h1>Github Fetcher</h1>
        <Search onSearch={this.search} />
        <RepoList repos={this.state.repos}/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));