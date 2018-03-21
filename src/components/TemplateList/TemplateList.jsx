import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TemplateListPagination from './TemplateListPagination'
import axios from 'axios';

import {
  Card,
  CardFooter,
  CardImg,
  Col,
  Container,
  Row,
} from 'reactstrap';

// const API = 'http://mandrel.docker';
const API = 'https://api.leadpages.io';
// const API = 'https://templates.daveisadork.io';
//


class TemplateList extends Component {

  constructor (props) {
    super(props);
    this.axios = axios.create({
      baseURL: `${API}/template/v1`,
      timeout: 1000,
      headers: {
        // 'LP-Security-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJsZWFkcGFnZXMubmV0IiwiaXNzIjoiYXBpLmxlYWRwYWdlcy5pbyIsImFjY2Vzc0lkIjoiSnJFVEdQdGVnYkZjS3JQYm55UmVyYiIsInNlc3Npb25JZCI6IjVQdjVkUmhpWHkyVWFpUW5TdXJTdk0iLCJleHAiOjE1MjM2NTI0OTMsImlhdCI6MTUyMTA2MDQ5M30.16o5kMELO9qRnIOpsVZ83vg4S5HlfrjHY-Y8dBGy8Ng'
        'LP-Security-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJsZWFkcGFnZXMubmV0IiwiaXNzIjoiYXBpLmxlYWRwYWdlcy5pbyIsImFjY2Vzc0lkIjoiSnJFVEdQdGVnYkZjS3JQYm55UmVyYiIsInNlc3Npb25JZCI6ImpWTHlFRXhjV0p1WjNxVmZEUDc3TDUiLCJleHAiOjE1MjM2NTIwMDIsImlhdCI6MTUyMTA2MDAwMn0.pAC52vzFMnXuptqwcPo2Jaqya21CENgkMXGMe_ntt3I'
      }
    });
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
    const response = await this.axios.get(url);
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
