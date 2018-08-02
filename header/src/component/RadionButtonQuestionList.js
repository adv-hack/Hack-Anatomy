import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
class RadionButtonQuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedAnswer:props.selectedAnswer,checkedRadioName:'',totalMarks:props.totalMarks};
        this.questionid=props.questionid
        this.items = props.value;
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        this.setState({
          checkedRadioName: target.value
        });

        this.props.onRadioUpdate(target.value,this.questionid);
      }
    render() {

        return this.items.map((user, idx) => {
            if (this.state.selectedAnswer === "") {
              return (
                <FormGroup check>
                    <Label check style={{fontWeight:"normal"}}>
                        <Input type="radio" value={user} onChange={this.handleInputChange} checked={this.state.checkedRadioName === user} />{' '}
                        {user}
                    </Label>
                </FormGroup>
              );
            } 
            else if(this.state.totalMarks === 1 && this.state.selectedAnswer.includes(user)){
                return (
                <FormGroup check>
                    <Label check style={{color:"green"}}>
                      <Input type="radio" value={user} onChange={this.handleInputChange} checked={this.state.selectedAnswer.includes(user)} disabled />{' '}
                      {user}
                    </Label>
                </FormGroup>
                );
            }
            else if(this.state.totalMarks === 0 && this.state.selectedAnswer.includes(user)){
                return (
                <FormGroup check style={{color:"red"}}>
                    <Label check>
                      <Input type="radio" value={user} onChange={this.handleInputChange} checked={this.state.selectedAnswer.includes(user)} disabled />{' '}
                      {user}
                    </Label>
                </FormGroup>
                );
            }
            else {
                return (
                <FormGroup check>
                    <Label check style={{fontWeight:"normal"}}>
                      <Input type="radio" value={user} onChange={this.handleInputChange} checked={this.state.selectedAnswer.includes(user)} disabled />{' '}
                      {user}
                    </Label>
                </FormGroup>
                );
            }
          });

    }
}
export default RadionButtonQuestionList;