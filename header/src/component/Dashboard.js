import React, { Component } from "react";
import Loader from "./Loader";
import Report from "./Report";
import OverallProgressChart from "./OverallProgressChart";
import EasyDifficultyProgressChart from "./EasyDifficultyProgressChart";
import MediumDifficultyProgressChart from "./MediumDifficultyProgressChart";
import HardDifficultyProgressChart from "./HardDifficultyProgressChart";
import Recommendation from "./Recommendation";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        items: [],
        learnerResponse:[],
        finalResult:0,
        overallResult: [],
        easyResult: [],
        mediumResult: [],
        hardResult: [],
        learnerResponseRecomm:{}
      };
  }
  componentWillMount() {
    var  learnerResponse1 = [];
    var learnerResponseRecomm1 = {};
     // var url =
     // "https://21wgg447m7.execute-api.ap-southeast-1.amazonaws.com/dev/student/123123"
     var url = "https://mm9iu0u34d.execute-api.ap-southeast-1.amazonaws.com/dev/student/989898"
     
     var finalcallurl =
     "http://54.255.204.22:5001/predict/as"
       //  + this.data.learnerID;
     fetch(url)
       .then(res => res.json())
       .then(
         result => {
           learnerResponse1.push({
             subjectid: 5,
             EasyQuestions: result.easyNo,
             //AvgPerEasyQue: result[0].Emarks.reduce( function(cnt,o){ return cnt + o; }, 0) / result[0].totNo,
             AvgPerEasyQue: result.Emarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result.Emarks.length), // result[0].totNo),
             MediumQue: result.mediumNo,
             AvgPerMedQue: result.Mmarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result.Emarks.length),
             HardQuestions: result.hardNo,
             AvgPerHardQue: result.Hmarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result.Emarks.length),
             referencelink:result.referencelink
           })
 
           this.setState({
             items: result,
             learnerResponse:learnerResponse1
           });
           fetch(finalcallurl,{
             method: "POST",
             body: JSON.stringify(this.state.learnerResponse),
             headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
             },
           })
           .then(res => res.json())
           .then(
             fresult => {
              
                learnerResponseRecomm1.subjectid= 5,
                learnerResponseRecomm1.EasyQuestions= result.easyNo,
                //AvgPerEasyQue: result[0].Emarks.reduce( function(cnt,o){ return cnt + o; }, 0) / result[0].totNo,
                learnerResponseRecomm1.AvgPerEasyQue= result.Emarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result.Emarks.length), // result[0].totNo),
                learnerResponseRecomm1.MediumQue= result.mediumNo,
                learnerResponseRecomm1.AvgPerMedQue= result.Mmarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result.Emarks.length),
                learnerResponseRecomm1.HardQuestions= result.hardNo,
                learnerResponseRecomm1.AvgPerHardQue= result.Hmarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result.Emarks.length),
                learnerResponseRecomm1.referencelink=result.referencelink,
                learnerResponseRecomm1.model=fresult
              

               this.setState({
                finalResult: fresult * 100,
                overallResult: result.Tmarks, 
                easyResult:result.Emarks,
                mediumResult:result.Mmarks,
                hardResult:result.Hmarks,
                learnerResponseRecomm:learnerResponseRecomm1,
                isLoaded:true
               });
             },
             error => {
             });
         },
         error => {
           this.setState({
             isLoaded: true,
             error
           });
         }
       );
   }
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div><Loader /></div>;
    }else{
    return (
      <div className="row">
         <div className="row">
         <h1>Learner Dashboard</h1>
        </div>
        <div className="row">
        <div class="col-md-6">
          <div style={{ textAlign: "center" }}>
            <h3>Prediction</h3>
            
          </div>
          <Report value={this.state.finalResult} />
          </div>
          <div class="col-md-6">
          <div style={{ textAlign: "center" }}>
            <h3>Recommendation</h3>
            
          </div>
          <Recommendation value={this.state.learnerResponseRecomm} />
          </div>
        </div>
        <div className="row">
        <div class="col-md-6">
        <div>
            <h3 style={{ textAlign: "center", color: "advanced"  }}>Overall Progress</h3>
          </div>
        <OverallProgressChart value={JSON.stringify(this.state.overallResult)} />
        </div>
        <div class="col-md-6">
        <div style={{ textAlign: "center" }}>
            <h3>Difficulty - Easy Progress</h3>
          </div>
        <EasyDifficultyProgressChart value={JSON.stringify(this.state.easyResult)} />
        </div>
        </div>
        <div className="row">
        <div class="col-md-6">
          <div style={{ textAlign: "center" }}>
          <h3>Difficulty - Medium Progress</h3>
          </div>
          <MediumDifficultyProgressChart value={JSON.stringify(this.state.mediumResult)} />
        </div>
        <div class="col-md-6">
          <div style={{ textAlign: "center" }}>
          <h3>Difficulty - Hard Progress</h3>
          </div>
          <HardDifficultyProgressChart value={JSON.stringify(this.state.hardResult)}  />
        </div>
        </div>
        </div>
    );
  }
}}
export default Dashboard;
