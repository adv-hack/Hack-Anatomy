import React ,{ Component } from 'react';
import CreateQuestions from './component/CreateQuestions';

class App extends Component {
  render() {
    return (
    <div className="App">
      <header className="container">
      {/* <div className="row">
           <div className="col-md-12" style={{textAlign:'center',fontSize:'25px',fontWeight:'bold'}}>Education Assessments and Forecasts</div>
       </div> */}
       <h1>Education Assessments and Forecasts</h1>
           <img src="http://erikdkennedy.com/r-r-r-random/divider-triangle.png" class="divider" />
       
       <CreateQuestions />
       </header>
       
       
    </div>
    );
  }
}

export default App;