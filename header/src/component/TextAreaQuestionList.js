import React, { Component } from 'react';
import { Input } from 'reactstrap';

class TextAreaQuestionList extends Component {
    
    constructor(props) {
       
        super(props);
        this.questionid=props.questionid
        this.state = {selectedAnswer:props.selectedAnswer,totalMarks:props.totalMarks};
        this.items = props.value;
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        this.props.onTextAreaUpdate(target.value,this.questionid);
      }


    render() {
        if (this.state.selectedAnswer === "") {
        return (
            <div className="row">
            <div className="col-lg-10">
            <Input type="textarea" name="text"  onChange={this.handleInputChange}  />
            </div>
          </div>
          );
        }
        else{
            return (
                <div className="row">
                <div className="col-lg-10">
                <Input type="textarea" name="text" onChange={this.handleInputChange} disabled value={this.state.selectedAnswer} />
                </div>
              </div>
              );
        }
    }

}
export default TextAreaQuestionList;