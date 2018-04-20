import { bool, func, number, shape, string } from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'reactstrap';

import TemplateListItem from './TemplateListItem';
import TemplateListPagination from './TemplateListPagination';
import './TemplateList.css';

class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.fetchTemplates = this.fetchTemplates.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.state = {
      currentPage: 0,
      cursor: props.cursor,
      limit: props.limit,
      order: props.order,
      pages: 1,
      query: props.query,
      templates: [],
    };
  }

  componentDidMount() {
    this.fetchTemplates();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.skipFetch) {
      this.setState(nextProps, this.fetchTemplates);
    }
  }

  async fetchTemplates() {
    const params = {
      limit: this.state.limit,
      cursor: this.state.cursor,
      order_by: this.state.order,
      ...this.state.query,
    };
    const response = await this.props.API.get('/templates', { params });
    const pages = Math.ceil(response.data._meta.total / this.state.limit);
    const currentPage = (this.state.cursor / this.state.limit);
    this.setState({
      currentPage,
      pages,
      skipFetch: true, // eslint-disable-line
      templates: response.data._items,
    });
  }

  loadPage(page) {
    const cursor = page * this.state.limit;
    this.setState({
      currentPage: page,
      cursor,
    }, this.fetchTemplates);
  }

  render() {
    return (
      <Container>
        <div className="template-list">
          {this.state.templates.map(template => (
            <TemplateListItem template={template} key={template._meta.id} />
          ))}
          {Array(this.state.templates.length % 3).fill().map((x, i) => i).map(key => (
            <div className="template-list-item" key={key} />
          ))}
        </div>
        <TemplateListPagination
          currentPage={this.state.currentPage}
          onChange={this.loadPage}
          pages={this.state.pages}
          preventDefault
        />
      </Container>
    );
  }
}

TemplateList.propTypes = {
  API: func.isRequired,
  cursor: number,
  limit: number,
  order: string,
  query: shape({}),
  skipFetch: bool,
};

TemplateList.defaultProps = {
  cursor: 0,
  limit: 12,
  order: 'name',
  query: {},
  skipFetch: false,
};

export default TemplateList;
