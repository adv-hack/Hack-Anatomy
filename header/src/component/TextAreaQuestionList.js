import React, { Component } from 'react';
import { Input } from 'reactstrap';

class TextAreaQuestionList extends Component {
    
    constructor(props) {
       
        super(props);
        this.state = {isGoing: true};
        this.questionid=props.questionid

        this.state.checkedRadioName = '';

        this.items = props.value;
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
      
        const target = event.target;
        const value = target.value;
        this.setState({
          checkedRadioName: value
        });

        this.props.onTextAreaUpdate(target.value,this.questionid);
      }


    render() {
        return (
            <div className="row">
            <div className="col-lg-10">
            <Input type="textarea" name="text" id="exampleText" />
                {/* <textarea>
                    Hello there, this is some text in a text area
                </textarea> */}
            </div>
          </div>
          );
    }

}
export default TextAreaQuestionList;