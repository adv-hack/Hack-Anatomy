import React, { Component } from "react";
class Recommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      isSubmit: false,
      learnerResponse: props.value,
      testReco:'',
      ulLi: []
    };
  }
  componentWillMount() {
    debugger;
    var finalcallurl = "http://54.255.204.22:5001/material/as";
    var finalcallurl1 = "http://54.255.204.22:5001/recommend/as";
    fetch(finalcallurl, {
      method: "POST",
      body: JSON.stringify(this.state.learnerResponse),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.text())
      .then(text => {
        this.setState({
          ulLi: text.split("#"),
          isLoaded: true
        });
        fetch(finalcallurl1,{
          method: "POST",
          body: JSON.stringify(this.state.learnerResponse),
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
        })
        .then(res1 => res1.text())
        .then(
          fresult => {
            debugger;
            this.setState({
              testReco:fresult
            });
          },
          error => {
            debugger;
          });
      });
  }
  createUlLi = () => {
    let table = [];
    let children = [];
    for (let j = 0; j < this.state.ulLi.length - 1; j++) {
      children.push(
        <li>
          <a href={this.state.ulLi[j]} target="_blank">
            {this.state.ulLi[j]}
          </a>
        </li>
      );
    }
    table.push(children);
    return table;
  };
  render() {
    return (
      <div className="row">
        As per our prediction based on your past results <br /> we recommend
        you to reappear in <strong>{this.state.testReco}</strong> complexity test.
        <br />
        <br />
        You can study some reference links to score better. Feel free to conslut your subject
        teacher about this reference material links.
        <ul>{this.createUlLi()}</ul>
      </div>
    );
  }
}
export default Recommendation;
