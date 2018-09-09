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
    
    convertToHTML(txt) {
        if(txt.indexOf('#') > 0)
            txt = txt.split('#')[0];
            
        return  txt.split("&lt;").join("<").split("&gt;").join(">")
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
                <div className="col-lg-10" style={{padding:"0"}}>
                {/* <Input type="textarea" name="text" onLoad={this.changeFontColor(this)} onChange={this.handleInputChange} disabled value={this.state.selectedAnswer} /> */}
                <strong>Your Answer:</strong><span dangerouslySetInnerHTML={{ __html: this.convertToHTML(this.state.selectedAnswer) }}></span>
                </div>
              </div>
              );
        }
    }

}
export default TextAreaQuestionList;