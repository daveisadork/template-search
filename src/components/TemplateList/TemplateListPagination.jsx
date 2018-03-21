import PropTypes from 'prop-types';
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
  setCurrentPage(currentPage, e) {
    this.props.onChange(currentPage);
    !!this.props.preventDefault ? e.preventDefault() : void 0;
  }

  render() {
    return (
      <Navbar color="white" fixed="bottom">
        <Container fluid={false}>
          <Nav fill={true} navbar={true}>
            <Pagination size="lg" className="justify-content-end">
              <PaginationItem disabled={this.props.currentPage === 0} key='prev'>
                <PaginationLink previous href="#" onClick={(e) => this.setCurrentPage(this.props.currentPage - 1, e)} />
              </PaginationItem>
              {Array(this.props.pages).fill().map((x, i) => i).map((page) => {
                return <PaginationItem disabled={this.props.currentPage === page} key={page}>
                  <PaginationLink href="#" onClick={(e) => this.setCurrentPage(page, e)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              })}
              <PaginationItem disabled={this.props.currentPage === this.props.pages - 1} key='next'>
                <PaginationLink next href="#" onClick={(e) => this.setCurrentPage(this.props.currentPage + 1, e)} />
              </PaginationItem>
            </Pagination>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

TemplateListPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  preventDefault: PropTypes.bool,
};

TemplateListPagination.defaultProps = {
  preventDefault: true,
};

export default TemplateListPagination;
