import React, { Component } from "react";
class Recommendation extends Component {
    componentWillMount() {
        var  learnerResponse1 = [];
         // var url =
         // "https://21wgg447m7.execute-api.ap-southeast-1.amazonaws.com/dev/student/123123"
         var url = "https://mm9iu0u34d.execute-api.ap-southeast-1.amazonaws.com/dev/student/989898"
         var finalcallurl = "http://54.255.204.22:5001/predict/as"
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
               })
     
               this.setState({
                 items: result,
                 learnerResponse:learnerResponse1
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
        return(
        <div className="row">
            As per the predection and your past result history <br /> we recommend you to reappear in Medium test inorder to achive score more.
            <br/><br/>
            Here are some URLs which you may refer inorder to score more. Please consult your subject teacher about this reference material.
        </div>
        )
    }
}
export default Recommendation;