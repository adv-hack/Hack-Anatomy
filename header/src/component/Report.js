import React, { Component } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import Loader from "./Loader";
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      learnerResponse:[],
      finalResult:0
    };
  }
  componentWillMount() {
   var  learnerResponse1 = [];
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
            subjectid: 1,
            EasyQuestions: result[0].easyNo,
            //AvgPerEasyQue: result[0].Emarks.reduce( function(cnt,o){ return cnt + o; }, 0) / result[0].totNo,
            AvgPerEasyQue: result[0].Emarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result[0].Emarks.length), // result[0].totNo),
            MediumQue: result[0].mediumNo,
            AvgPerMedQue: result[0].Mmarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result[0].Emarks.length),
            HardQuestions: result[0].hardNo,
            AvgPerHardQue: result[0].Hmarks.reduce( function(cnt,o){ return cnt + o; }, 0) / ( 100 * result[0].Emarks.length),
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
              this.setState({
               finalResult: fresult * 100,
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
    } else {
    return (
      <div className="row">
      <div className="col-md-12">
      <div style={{textAlign:"center"}}>
          <h1>Prediction</h1>
        </div>
      </div>
      <div className="row">
      <div className="col-md-12">
      <div className="col-md-4"></div>
      <div className="col-md-4">
      <ReactSpeedometer
          value={this.state.finalResult}
          needleTransitionDuration={4000}
          minValue={0}
          width={500}
          height={400}
          maxValue={100}
          needleTransition="easeElastic"
          currentValueText="Current Value: ${value}"
        />
      </div>
      <div className="col-md-4"></div>
      </div>
      </div>
      </div>
    );
  }
}
}
export default Report;
