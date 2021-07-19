import React, { Component } from "react";

import { Feed, FeedContent } from "semantic-ui-react";
import { Input } from "react-input-component";
import { Collapse, Button } from "reactstrap";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import './studentstyle.css';

function searchingForName(search) {
  return function(x) {
    return (
      x.firstName.toLowerCase().includes(search.toLowerCase()) ||
      x.lastName.toLowerCase().includes(search.toLowerCase()) ||
      !search
    );
  };
}
class GetStudents extends Component{
    constructor(props){
        super(props);
        this.state = {
          results: [],
          search: "",
          collapse: false,
          tagSearch: "",
          tags: [],
          isExpandable: false,
          activeIndex: 0        
        };
        this.onchange = this.onchange.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    onchange = e => {
      console.log(this.state.search);
      this.setState({ search: e.target.value });
    };
    inputKeyDown = e => {
      const val = e.target.value;
      if (e.key === "Enter" && val) {
        if (
          this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())
        ) {
          return;
        }
        this.setState({ tags: [...this.state.tags, val] });
        this.tagInput.value = null;
      }
    };
  
    toggle(index) {
      const results = this.state.results.map((item, idx) => {
        if (index === idx) {
          return {
            ...item,
            isOpened: !item.isOpened
          };
        }
        return item;
      });
      this.setState({ results });
    }
    componentDidMount(){
        fetch("https://api.hatchways.io/assessment/students")
        .then(response => response.json())
        .then(data =>{
            const results = data.students.map(student =>{
                return{
                    ...student,
                    isOpened: false
                };
            });
            this.setState({ results});
        }).catch(err=>{
            console.log(err);
        })
    }
    searchStudents=(event)=>{
        let keyword = event.target.value;
        this.setState({search:keyword})
      }
    render() {
        return(
          <div className="wrapper">
            <Input className="search"
              placeholder="Search by name..."
              onChange={this.onchange}
            />
            <Input
              className="search"
              placeholder="Search by tags..."
              onChange={this.onchange}
            />
            {this.state.results.filter(searchingForName(this.state.search))
            .map((value, i)=>(
              <Feed>
                <Feed.Event style={{ margin: "10px" }}>
                    <Image className="circletag"> 
                        <Feed.Label image={value.pic} />
                    </Image>
                        <div style={{ float: "right" }}>
                          {!value.isOpened ? (
                            <Button onClick={() => this.toggle(i)}>+</Button>
                          ) : (
                            <Button onClick={() => this.toggle(i)}>-</Button>
                          )}
                        </div>
                    <FeedContent className="studentdetails">
                    <Feed.Summary>
                      <h4 className="title">
                        {value.firstName.toUpperCase()}{" "}
                        {value.lastName.toUpperCase()}
                      </h4>
                    </Feed.Summary>
                    <Feed.Summary className="details">Email: {value.email}</Feed.Summary>
                    <Feed.Summary className="details">Company: {value.company}</Feed.Summary>
                    <Feed.Summary className="details">Skill: {value.skill}</Feed.Summary>
                    <Feed.Summary className="details">Average :{" "}{value.grades.map((x, i, arr) => {return x / arr.length;})
                      .reduce((a, b) => {return a + b;}) + "%"}
                    </Feed.Summary>
                    <br/>
                    <Collapse isOpen={value.isOpened}>
                    <Feed.Summary className="details"> 
                      {Array.isArray(value.grades) && value.grades.map(val => {
                          return (
                            <div>Test {value.grades.indexOf(val)} :{" "}{parseFloat(val) + "%"}</div>
                            );
                      })}
                    </Feed.Summary>
                    <br />
                    {this.state.tags.map((tag, index) => (
                      <div>
                      <span className="addTag" key={index}>{tag}</span>
                      </div>
                    ))}
                    <br />
                    <input className="tagText" type="text" onKeyDown={this.inputKeyDown} ref={c => {
                        this.tagInput = c;}} placeholder="add a tag..."/>
                    </Collapse> 
                    </FeedContent>
              </Feed.Event>
              </Feed>
            ))}
          </div>
        )
           
    }

}
const Image = styled.div`
  border: 1px solid #001;
  border-radius: 60px;
  overflow: hidden;
  padding: 18px;
  height: 100px;
  width: 100px;
  margin-top: 10px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 20px;
`;

export default GetStudents;