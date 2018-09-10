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
    
    convertToHTML(txt,isGrammer) {
        if(txt.indexOf('#') > 0)
        {
            if(!isGrammer)
                txt = txt.split('#')[0];
            else{
                if(txt.split('#').length > 1 &&  txt.split('#')[1] != "")
                    txt = txt.split('#')[1];    
                else
                    txt = "No mistakes found!"  ;  
            }
        }
            
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
                <div className="col-lg-10" style={{paddingBottom:"5px"}}>
                     <strong>Your Answer:</strong><span dangerouslySetInnerHTML={{ __html: this.convertToHTML(this.state.selectedAnswer,false) }}></span>
                </div>
                <div className="col-lg-10" style={{paddingBottom:"5px"}}>
                     <strong>Grammatical Mistakes:</strong><span dangerouslySetInnerHTML={{ __html: this.convertToHTML(this.state.selectedAnswer,true) }}></span>
                </div>
                </div>
              );
        }
    }

}
export default TextAreaQuestionList;