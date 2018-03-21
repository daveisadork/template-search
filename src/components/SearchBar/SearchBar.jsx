import React, { Component } from 'react';
import {Highlighter, Menu, MenuItem, Token, AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { groupBy, map } from 'lodash';
import axios from 'axios';
import './SearchBar.css';

import {
  Badge,
  Container,
  Nav,
  Navbar,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const MenuDivider = (props) => (
  <li className="divider dropdown-divider" role="separator" />
);

const MenuHeader = (props) => <li {...props} className="dropdown-header" />;
// const API = 'http://mandrel.docker';
const API = 'https://api.leadpages.io';
// const API = 'https://templates.daveisadork.io';


const Orders = [
  {
    label: "Name",
    value: "name"
  },
  {
    label: "Most Recent",
    value: "-release_date"
  },
  {
    label: "Conversion Rate",
    value: "-conversion_rate"
  },
  {
    label: "Last Updated",
    value: "-updated"
  },
];


class SearchBar extends Component {

  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.fetchOptions = this.fetchOptions.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.setOrder = this.setOrder.bind(this);
    this.state = {
      query: '',
      options: [],
      isLoading: false,
      dropdownOpen: false,
      order: 'name',
    };
    this.axios = axios.create({
      baseURL: `${API}/template/v1`,
      timeout: 1000,
      headers: {
        // 'LP-Security-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJsZWFkcGFnZXMubmV0IiwiaXNzIjoiYXBpLmxlYWRwYWdlcy5pbyIsImFjY2Vzc0lkIjoiSnJFVEdQdGVnYkZjS3JQYm55UmVyYiIsInNlc3Npb25JZCI6IjVQdjVkUmhpWHkyVWFpUW5TdXJTdk0iLCJleHAiOjE1MjM2NTI0OTMsImlhdCI6MTUyMTA2MDQ5M30.16o5kMELO9qRnIOpsVZ83vg4S5HlfrjHY-Y8dBGy8Ng'
        'LP-Security-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJsZWFkcGFnZXMubmV0IiwiaXNzIjoiYXBpLmxlYWRwYWdlcy5pbyIsImFjY2Vzc0lkIjoiSnJFVEdQdGVnYkZjS3JQYm55UmVyYiIsInNlc3Npb25JZCI6ImpWTHlFRXhjV0p1WjNxVmZEUDc3TDUiLCJleHAiOjE1MjM2NTIwMDIsImlhdCI6MTUyMTA2MDAwMn0.pAC52vzFMnXuptqwcPo2Jaqya21CENgkMXGMe_ntt3I'
      }
    });
  }

  componentDidMount() {
    this.fetchOptions();
  }

  async fetchOptions() {
    const url = `/taxonomy?${this.state.query}`;
    const response = await this.axios.get(url);
    this.setState({
      isLoading: false,
      options: response.data.taxons
    });
  }

  onChange(event) {
    const grouped = groupBy(event, (r) => r.type);
    const items = Object.keys(grouped).sort().map((type) => {
      let op = "contains";
      if (type === "id") {
        op = "eq";
      } else if (grouped[type].length > 1) {
        op = "superset";
      }
      const values = map(grouped[type], (item) => {
        return item.value;
      }).join(",");

      return `${type}[${op}]=${values}`;
    }).join("&");
    this.setState({query: items, isLoading: true}, this.fetchOptions);
    this.props.onChange({query: items});
  }

  onSearch(event) {this.setState({})};

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  setOrder(order) {
    this.setState({order});
    this.props.onChange({order});
  }

  render() {
    return (
      <Navbar color="primary" dark fixed="top">
        <Container fluid={false}>
          <Nav fill={true} navbar={true} className="top-nav">
            <AsyncTypeahead
              autoFocus={true}
              bodyContainer={true}
              bsSize='large'
              minLength={0}
              renderMenu={this._renderMenu}
              renderToken={this._renderToken}
              isLoading={this.state.isLoading}
              onChange={this.onChange}
              onSearch={this.onSearch}
              highlightOnlyResult={true}
              selectHintOnEnter={true}
              labelKey="label"
              multiple={true}
              options={this.state.options}
              placeholder="Template Search"
              useCache={false}
            />
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="ml-2">
              {Orders.map((order) => {
                return order.value === this.state.order && <DropdownToggle caret color="primary" key={order.value}>
                  Sort by {order.label}
                </DropdownToggle>
              })}
              <DropdownMenu>
                {Orders.map((order) => {
                  const active = order.value === this.state.order;
                  return <DropdownItem
                    active={active}
                    disabled={active}
                    key={order.value}
                    onClick={(e) => this.setOrder(order.value)}
                  >
                    {order.label}
                  </DropdownItem>
                })}
              </DropdownMenu>
            </ButtonDropdown>
          </Nav>
        </Container>
      </Navbar>
    );
  }

  _renderMenu(results, menuProps) {
    let idx = 0;
    const grouped = groupBy(results, (r) => r.section);
    const items = Object.keys(grouped).map((section) => {
      const stuff = [
        !!idx && <MenuDivider key={section + '-divider'} />,
        <MenuHeader key={section + '-header'}>
          {section}
        </MenuHeader>,
        map(grouped[section], (taxon) => {
          let badge = ''
          if (taxon.type !== 'id') {
            badge = <Badge className="badge-pill badge-default ml-1">{taxon.count}</Badge>
          }
          const item =
            <MenuItem key={idx} option={taxon} position={idx}>
              <Highlighter search={menuProps.text}>
                {taxon.label}
              </Highlighter>
              {badge}
            </MenuItem>;

          idx++;
          return item;
        }),
      ];
      return stuff;
    });

    return <Menu {...menuProps} maxHeight="75vh">{items}</Menu>;
  }

  _renderToken(option, onRemove, index) {
    return (
      <Token
        key={index}
        onRemove={onRemove}>
        {`${option.section}: ${option.label}`}
      </Token>
    );
  }
}

export default SearchBar;