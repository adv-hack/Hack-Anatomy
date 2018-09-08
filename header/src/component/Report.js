import React, { Component } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import Loader from "./Loader";
import OverallProgressChart from "./OverallProgressChart";
import EasyDifficultyProgressChart from "./EasyDifficultyProgressChart";
import MediumDifficultyProgressChart from "./MediumDifficultyProgressChart";
import HardDifficultyProgressChart from "./HardDifficultyProgressChart";
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finalResult:props.value
    };
  }
  render() {
    return (
      <div className="row">
        <ReactSpeedometer
          value={this.state.finalResult}
          needleTransitionDuration={4000}
          width={500}
          height={400}
          minValue={0}
          maxValue={100}
          needleTransition="easeElastic"
          currentValueText="Current Value: ${value}"
        />
      </div>
    );
  }
}
export default Report;
