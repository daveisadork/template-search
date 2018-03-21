import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TemplateListPagination from './TemplateListPagination'

import {
  Card,
  CardFooter,
  CardImg,
  Col,
  Container,
  Row,
} from 'reactstrap';


class TemplateList extends Component {

  constructor (props) {
    super(props);
    this.fetchTemplates = this.fetchTemplates.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.state = {
      query: props.query,
      cursor: props.cursor,
      limit: props.limit,
      order: props.order,
      templates: [],
      currentPage: 0,
      pages: 1,
      total: 0,
      count: 0,
    };
  }

  componentDidMount() {
    this.fetchTemplates();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.skipFetch) {
      this.setState(nextProps, this.fetchTemplates)
    }
  }

  async fetchTemplates() {
    const url = `/templates?limit=${this.state.limit}&cursor=${this.state.cursor}&order_by=${this.state.order}&${this.state.query}`;
    const response = await this.props.API.get(url);
    const pages = Math.ceil(response.data._meta.total / this.state.limit);
    const currentPage = (this.state.cursor / this.state.limit);
    this.setState({
      templates: response.data._items,
      total: response.data._meta.total,
      count: response.data._meta.count,
      skipFetch: true,
      currentPage,
      pages,
    });
  }

  render() {
    return (
      <div className="my-5 py-4">
        <Container fluid={false}>
          <Row>
            {this.state.templates.map((template) => {
              return <Col className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4" key={template._meta.id}>
                <Card>
                  <CardImg top src={template.thumbnailUrl} />
                  <CardFooter className="text-truncate">{template.name}</CardFooter>
                </Card>
              </Col>
            })}
          </Row>
        </Container>
        <TemplateListPagination
          pages={this.state.pages}
          currentPage={this.state.currentPage}
          onChange={this.loadPage}
          preventDefault
        />
      </div>
    );
  }

  loadPage(page) {
    const cursor = page * this.state.limit;
    this.setState({
      currentPage: page,
      cursor: cursor
    }, this.fetchTemplates)
  }
};

TemplateList.propTypes = {
  API: PropTypes.func.isRequired,
  cursor: PropTypes.number,
  limit: PropTypes.number,
  order: PropTypes.string,
  query: PropTypes.string,
};

TemplateList.defaultProps = {
  cursor: 0,
  limit: 20,
  order: 'name',
  query: '',
}

export default TemplateList;
