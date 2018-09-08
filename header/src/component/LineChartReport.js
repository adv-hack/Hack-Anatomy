import React, { Component } from 'react';
import LineChart from 'react-linechart';
//import '../../node_modules/react-linechart/dist/styles.css';
import '../../node_modules/react-linechart/dist/styles.css'

class LineChartReport extends Component {
    render() {
        const data = [
            {									
                color: "#e9510e", 
                points: [{x: 0, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}] 
            }
        ];
        return (
            <div>
                <div className="App">
                    <h1>Line Chart</h1>
                    <LineChart 
                        data={data}
                        width={500}
                        height={400}
                    />
                </div>			
            </div>
        );
    }
}
export default LineChartReport;