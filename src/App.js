import React , {Component} from 'react';

import './App.css';

import Login from './components/Login/Login';
import Dashboard from './components/dashboard/dashboard'

class App extends Component{

  constructor(props){
    super(props);
    this.state = { 
      loggedIn: false
     }

     this.login = this.login.bind(this);
     this.logout = this.logout.bind(this);
  }

  login(){
    let state = this.state;
    state.loggedIn = true;
    this.setState(state);
  }

  logout(){
    let state = this.state;
    state.loggedIn = false;
    this.setState(state);
  }
  

  render(){
    return (
      <div>
        { this.state.loggedIn ? <Dashboard logout={this.logout} /> : <Login login={this.login} /> }
      </div>
      
    );
  }
    
}

export default App;
