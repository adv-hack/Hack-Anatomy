import React, { Component } from "react";
import CheckboxQuestionList from "./CheckboxQuestionList";
import RadioButtonQuestionList from "./RadionButtonQuestionList";
import TextAreaQuestionList from "./TextAreaQuestionList";
export class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      que: [],
      error: null,
      isLoaded: false,
      items: []
    };

    this.apiURL =
      "https://21wgg447m7.execute-api.ap-southeast-1.amazonaws.com/dev/";
    this.onRadioUpdate = this.onRadioUpdate.bind(this);
    this.onCheckBoxUpdate = this.onCheckBoxUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
   
    var alertmsg = "";
    this.state.que.map(statevalue => {
      alertmsg +=
        statevalue.questionid + " answer: " + statevalue.answer + "\n";
    });

    alert(alertmsg);
    event.preventDefault();
  }

  onRadioUpdate = (val, questionid) => {
    this.state.que.map((statevalue, idx) => {
      if (statevalue.questionid === questionid) {
        this.state.que.splice(idx, 1);
      }
    });
    var arr = [];
    arr.push(val);
    this.state.que.push({ answer: arr, questionid: questionid });
  };

  onCheckBoxUpdate = (val, questionid, isChecked) => {
    var arr = [];
    arr.push(val);
    var isDone = false;
    var isQuestionFound = false;
    var tempArr = [];
    this.state.que.map(statevalue => {
      if (statevalue.questionid === questionid) {
        statevalue.answer.map((ans, idx) => {
          if (ans === val && !isChecked) {
            statevalue.answer.splice(idx, 1);
            isDone = true;
          }
        });
        tempArr.splice(val);
        isQuestionFound = true;
      }

      if (!isDone && isQuestionFound) {
        tempArr.push(val);
      }
    });

    if (!isDone && !isQuestionFound) {
      this.state.que.push({ answer: arr, questionid: questionid });
    } else if (tempArr.length > 0) {
      this.state.que.map(statevalue => {
        if (statevalue.questionid === questionid) {
          statevalue.answer.push(val);
        }
      });
    }
  };

  componentDidMount() {
    var url = this.apiURL + "questions/2/Maths";
    fetch(url)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        items.map(innerArray => {
          if (innerArray.questiontype == "chkbox") {
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
                  {innerArray.question}
                </div>
                <CheckboxQuestionList
                  label={innerArray.question}
                  value={innerArray.options}
                  questionid={innerArray._id}
                  onCheckBoxUpdate={this.onCheckBoxUpdate}
                />
              </div>
            );
          } else if (innerArray.questiontype == "radio") {
            {
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
                    {innerArray.question}
                  </div>
                  <RadioButtonQuestionList
                    label={innerArray.question}
                    value={innerArray.options}
                    questionid={innerArray._id}
                    onRadioUpdate={this.onRadioUpdate}
                  />
                </div>
              );
            }
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
                  {innerArray.question}
                </div>
                <TextAreaQuestionList
                  label={innerArray.question}
                  value={innerArray.options}
                  questionid={innerArray._id}
                />
              </div>
            );
          }
        })
      );
    }
  }
}
