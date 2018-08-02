import React, { Component } from "react";
import CheckboxQuestionList from "./CheckboxQuestionList";
import RadioButtonQuestionList from "./RadionButtonQuestionList";
import TextAreaQuestionList from "./TextAreaQuestionList";
import Loader from "./Loader";

class PostQuestions extends Component {
  constructor(props) {
    super(props);
    this.quearr = props.quearr;
    this.state = {
        error: null,
        isLoaded: false,
        items: []
      };
  }

  getFinalResult = (val,arr) =>{
   this.props.getFinalResult(val,arr);
  }

  calculateResult = (val) =>{
    var count=0;
    val.map(value=>{
        if(value.totMarks > 0)
        {
          count+=1;
        }
    })

    this.getFinalResult(count,val.length);
  }

  componentWillMount() {
    var url =
      "https://21wgg447m7.execute-api.ap-southeast-1.amazonaws.com/dev/result/123123/easy";

    var jsonData = [];
    this.quearr.map(statevalue => {
      jsonData.push({
        question: statevalue.questionid,
        answer: statevalue.answer
      });
    });
    fetch(url,{
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
      }).then(res => res.json())
      .then(
        result => {
            this.setState({
              isLoaded: true,
              items: result.Result
            });
            this.calculateResult(this.state.items);
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
        this.state.items.map(innerArray => {
          if (innerArray.questiontype === "chkbox") {
            return (
              <div>
                <div
                  className="col-md-12 row"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    backgroundColor: "lightgray"
                  }}
                >
                  {innerArray.questionDesc}
                </div>
                <CheckboxQuestionList
                  question={innerArray.questionDesc}
                  value={innerArray.options}
                  questionid={innerArray.question}
                  selectedAnswer={innerArray.answer}
                  totalMarks={innerArray.totMarks}
                />

                <div>
                  <label>
                        Correct Answer: <span style={{color: "green"}}>{innerArray.rightAns.join(",")}</span>
                  </label>
                </div>
                <div>
                  <label>
                        Mark: <span style={{color: "blue"}}>{innerArray.totMarks}</span>
                  </label>
                </div>
              </div>
            );
          } else if (innerArray.questiontype === "radio") {
            
              return (
                <div>
                  <div
                    className="col-md-12 row"
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      backgroundColor: "lightgray"
                    }}
                  >
                    {innerArray.questionDesc}
                  </div>
                  <RadioButtonQuestionList
                    question={innerArray.questionDesc}
                    value={innerArray.options}
                    questionid={innerArray.question}
                    selectedAnswer={innerArray.answer}
                    totalMarks={innerArray.totMarks}
                  />

                  <div>
                  <label>
                      Correct Answer: <span style={{color: "green"}}>{innerArray.rightAns.join(",")}</span>
                  </label>
                </div>
                <div>
                  <label>
                        Mark: <span style={{color: "blue"}}>{innerArray.totMarks}</span>
                  </label>
                </div>

                </div>
              );
          } else {
            return (
              <div>
                <div
                  className="col-md-12 row"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    backgroundColor: "lightgray"
                  }}
                >
                  {innerArray.questionDesc}
                </div>
                <TextAreaQuestionList
                  question={innerArray.questionDesc}
                  value={innerArray.options}
                  questionid={innerArray.question }
                  selectedAnswer={innerArray.answer}
                />

                <div>
                  <label>
                      Correct Answer: <span style={{color: "green"}}>{innerArray.rightAns.join(",")}</span>
                  </label>
                </div>
                <div>
                  <label>
                        Mark: <span style={{color: "blue"}}>{innerArray.totMarks}</span>
                  </label>
                </div>
              </div>
            );
          }
        })
      );
    }
  }
}
export default PostQuestions;
