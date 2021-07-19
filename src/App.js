import React, {Component} from 'react';
import GetStudents from './components/studentslist';
import './App.css';

class App extends Component {
  render(){
    return(
      <div className="App">
      <GetStudents/>
      </div>
    )
  }
}

export default App;
