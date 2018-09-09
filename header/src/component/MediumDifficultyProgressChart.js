import React, { Component } from 'react';
import LineChart from 'react-linechart';
import Loader from "./Loader";
class MediumDifficultyProgressChart extends Component{
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          learnerResponse:[],
          finalResult:[],
          jsonResult: props.value
        };
        this.makejson = this.makejson.bind(this);
      }

      componentWillMount() {
        //var arr=[14.085734621542512,       0,       0,       7.042867310771256,       0,       7.888643990498722,       7.888643990498722,       33.333333333333336,       33.684874948733174,       34.28522657602438,       33.333333333333336,       33.93368496062454,       34.28522657602438,       16.666666666666668,       16.666666666666668,       16.666666666666668,       16.666666666666668,       16.666666666666668,       16.666666666666668,       50,       50,       50,       50,       0,       0,       0,       0,       0,       0,       0,       0,       0,       33.333333333333336,       33.333333333333336,       33.333333333333336,       16.666666666666668,       0];
        this.makejson(JSON.parse(this.state.jsonResult));
       }

     makejson = (arr)=>{
         
        let points = []
        if(arr != null && arr.length > 0)
            {
                arr.map((innerArray,idx) => {
                    points.push({x:idx,y:innerArray})
                })
            }
            
            var res = JSON.stringify(points)
            this.setState({
                finalResult: points ,
                isLoaded:true
            })
           
       }

       render() {
        const data = [
            {									
                color: "yellow", 
                points: this.state.finalResult
            }
        ];
        const { error, isLoaded } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div><Loader /></div>;
        } else {
        return (
          <div className="row">
                    <LineChart 
              id="medium"
              width={500}
              height={400}
              data={data}
              xLabel= "No. of Test"
              yLabel="Total Marks"
              onPointHover={(obj) => 'Test:' + ( obj.x + 1) + '<br />Marks:' + obj.y}
            />
          </div>
         
        );
      }
    }
}
export default MediumDifficultyProgressChart;