import React, { Component } from "react";
import CheckboxQuestionList from "./CheckboxQuestionList";
import RadioButtonQuestionList from "./RadionButtonQuestionList";
import TextAreaQuestionList from "./TextAreaQuestionList";
import Loader from "./Loader";

class APIService extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.data = props.data;
  }

  onTextAreaUpdate = (val, questionid) => {
    this.props.onTextAreaUpdate (val,questionid);
  };

  onRadioUpdate = (val, questionid) => {
    this.props.onRadioUpdate (val,questionid);
  };
  onCheckBoxUpdate = (val, questionid, isChecked) => {
    this.props.onCheckBoxUpdate(val, questionid, isChecked);
  };

  getQuestionsLength = (val) =>{
    this.props.getQuestionsLength(val);
  };

  componentWillMount() {
    var url = "https://21wgg447m7.execute-api.ap-southeast-1.amazonaws.com/dev/questions/"+ this.data.noOfQuestions + "/"+ this.data.subject + "/"+ this.data.difficulty +"/" + this.data.learnerID;
    
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });
          this.getQuestionsLength(this.state.items.length);
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
    var arr = this.state.items;

    return arr.map((innerArray, i) => {
      if (innerArray.questiontype === "chkbox") {
        return (
          <div className="row">
            <div
              className="col-md-10"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                backgroundColor: "lightgray"
              }}
            >
              {innerArray.question}
            </div>
            <div className="col-md-12">
              <CheckboxQuestionList
                question={innerArray.question}
                value={innerArray.options}
                questionid={innerArray._id}
                onCheckBoxUpdate={this.onCheckBoxUpdate}
                selectedAnswer=""
              />
            </div>
          </div>
        );
      } else if (innerArray.questiontype === "radio") {
          return (
            <div className="row">
              <div
                className="col-md-10"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  backgroundColor: "lightgray"
                }}
              >
                {innerArray.question}
              </div>
              <div className="col-md-12">
                <RadioButtonQuestionList
                  question={innerArray.question}
                  value={innerArray.options}
                  questionid={innerArray._id}
                  onRadioUpdate={this.onRadioUpdate}
                  selectedAnswer=""
                />
              </div>
            </div>
          );
      } else {
        return (
          <div className="row">
            <div
              className="col-md-10"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                backgroundColor: "lightgray"
              }}
            >
              {innerArray.question}
            </div>
            <TextAreaQuestionList
              question={innerArray.question}
              value={innerArray.options}
              questionid={innerArray._id}
              onTextAreaUpdate ={this.onTextAreaUpdate}
              selectedAnswer=""
            />
          </div>
        );
      }
    });
    }
  }
}
export default APIService;