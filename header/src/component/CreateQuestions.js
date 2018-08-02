import React, { Component } from "react";
import DisplayQuestions from "./DisplayQuestions";
import { Button, ButtonGroup } from "reactstrap";
class CreateQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      learnerID: "123123",
      testid: "",
      subject: "Maths",
      difficulty: "Easy",
      noOfQuestions: "20",
      redirectToNewPage: false,
      backgroundColor: "#007bff",
      isReport: false
    };

    this.handleLearnerIDChange = this.handleLearnerIDChange.bind(this);
    this.handleTestIDChange = this.handleTestIDChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
    this.handleNoOfQuestionsChange = this.handleNoOfQuestionsChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleLearnerIDChange(event) {
    this.setState({ learnerID: event.target.value });
  }
  handleTestIDChange(event) {
    this.setState({ testid: event.target.value });
  }
  handleSubjectChange(event) {
    this.setState({ subject: event.target.value });
  }
  handleDifficultyChange(event) {
    this.setState({ difficulty: event.target.textContent });
  }
  handleNoOfQuestionsChange(event) {
    this.setState({ noOfQuestions: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ redirectToNewPage: true });
    event.preventDefault();
  }

  handleReportClick(event) {
    this.setState({
      redirectToNewPage: true,
      isReport: true
    });
    event.preventDefault();
  }

  render() {
    if (this.state.redirectToNewPage === true) {
        return (
          // data="[{&quot;_id&quot;: &quot;5b4db0271247023544f06377&quot;,&quot;options&quot;: [&quot;option1&quot;,&quot;option2&quot;],&quot;question&quot;: &quot;question1&quot;,&quot;type&quot;: &quot;chkbox&quot;,&quot;difficulty&quot;: 1,&quot;subject&quot;: &quot;Maths&quot;,&quot;__v&quot;: 0},{&quot;_id&quot;: &quot;5b4db0271247023544f06378&quot;,&quot;options&quot;: [&quot;option1&quot;,&quot;option2&quot;,&quot;option3&quot;],&quot;question&quot;: &quot;question1&quot;,&quot;type&quot;: &quot;radio&quot;,&quot;difficulty&quot;: 1,&quot;subject&quot;: &quot;Maths&quot;,&quot;__v&quot;: 0}]" 
          <DisplayQuestions data={this.state} />
        );
    }
    var subjects = [
      { name: "Maths", id: 1 },
      { name: "Science", id: 2 },
      { name: "English", id: 3 },
      { name: "Social Studies", id: 4 }
    ];

    let subjectsItems = subjects.map(subject => (
      <option key={subject.name}>{subject.name}</option>
    ));
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <div className="form-horizontal">
            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label htmlFor="test" className="col-xs-offset-1">
                    Learner ID:
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.learnerID}
                    onChange={this.handleLearnerIDChange}
                    placeholder="Learner ID"
                  />
                 
                </div>
              </div>
            </div>

            {/* <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label htmlFor="test" className="col-xs-offset-1">
                    Test ID:
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.testid}
                    onChange={this.handleLearnerIDChange}
                    placeholder="Test ID"
                  />
                </div>
              </div>
            </div> */}

            <div className="form-group row">
              <div className="row">
                <div className="col-md-2">
                  <label htmlFor="test" className="col-xs-offset-1">
                    Subject:
                  </label>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    id="sel1"
                    onChange={this.handleSubjectChange}
                  >
                    {subjectsItems}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-md-2">
                  <label htmlFor="test" className="col-xs-offset-1">
                    Difficulty:
                  </label>
                </div>
                <div className="col-md-4">
                  <ButtonGroup>
                    <Button
                      color="default"
                      onClick={this.handleDifficultyChange}
                      active={this.state.difficulty === "Easy"}
                      style={[this.state.difficulty === "Easy" ? "" : ""]}
                    >
                      Easy
                    </Button>
                    <Button
                      color="default"
                      onClick={this.handleDifficultyChange}
                      active={this.state.difficulty === "Medium"}
                    >
                      Medium
                    </Button>
                    <Button
                      color="default"
                      onClick={this.handleDifficultyChange}
                      active={this.state.difficulty === "Hard"}
                    >
                      Hard
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <div className="col-md-2">
                  <label htmlFor="test" className="col-xs-offset-1">
                    Number of Questions:
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.noOfQuestions}
                    onChange={this.handleNoOfQuestionsChange}
                    placeholder="Number of Questions"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <div className="col-md-2" />
                <div className="col-md-4">
                   <Button color="advanced" type="submit">
                    Start Exam
                  </Button> 
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default CreateQuestions;
