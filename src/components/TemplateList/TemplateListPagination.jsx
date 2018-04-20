import { bool, func, number } from 'prop-types';
import React, { Component } from 'react';

import {
  Container,
  Nav,
  Navbar,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';


class TemplateListPagination extends Component {
  setCurrentPage(currentPage, event) {
    this.props.onChange(currentPage);
    if (this.props.preventDefault) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <Navbar color="white" fixed="bottom">
        <Container fluid={false}>
          <Nav fill navbar>
            <Pagination size="lg" className="justify-content-end">
              <PaginationItem disabled={this.props.currentPage === 0} key="prev">
                <PaginationLink previous href="#" onClick={e => this.setCurrentPage(this.props.currentPage - 1, e)} />
              </PaginationItem>
              {Array(this.props.pages).fill().map((x, i) => i).map(page => (
                <PaginationItem disabled={this.props.currentPage === page} key={page}>
                  <PaginationLink href="#" onClick={e => this.setCurrentPage(page, e)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={this.props.currentPage === this.props.pages - 1} key="next">
                <PaginationLink next href="#" onClick={e => this.setCurrentPage(this.props.currentPage + 1, e)} />
              </PaginationItem>
            </Pagination>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

TemplateListPagination.propTypes = {
  currentPage: number.isRequired,
  pages: number.isRequired,
  onChange: func.isRequired,
  preventDefault: bool,
};

TemplateListPagination.defaultProps = {
  preventDefault: true,
};

export default TemplateListPagination;
