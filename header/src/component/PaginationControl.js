import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
class PaginationControl extends Component {
  createPagination = () => {
    let table = []

    // Outer loop to create parent
    let children = []
      //Inner loop to create children
      for (let j = 0; j < 5; j++) {
        children.push(<PaginationItem><PaginationLink href="#">{j+1}</PaginationLink></PaginationItem>)
      }
      //Create the parent and add the children
      table.push(children)

    return table
  }

  render() {
    return(
      <Pagination aria-label="Page navigation example"> 
        <PaginationItem>
             <PaginationLink previous href="#" />
        </PaginationItem>
        {this.createPagination()}
      <PaginationItem>
             <PaginationLink next href="#" />
       </PaginationItem>
      </Pagination>
    )
  };
  };
  export default PaginationControl;