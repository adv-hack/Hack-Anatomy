import React ,{ Component } from 'react';
import CreateQuestions from './component/CreateQuestions';

class App extends Component {
  render() {
    return (
    <div className="App">
      <header className="container">
         <div className="row">
           <div className="col-md-12" style={{textAlign:'center',fontSize:'25px',fontWeight:'bold'}}>Hack Anatomy</div>
       </div>
       <div className="row">
         <hr/>
       </div>
       <CreateQuestions />
       </header>
    </div>
    );
  }
}

export default App;