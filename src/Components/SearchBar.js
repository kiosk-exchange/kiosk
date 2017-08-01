import React, { Component } from 'react';
import { FormGroup, InputGroup, FormControl } from 'react-bootstrap';

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSearch() {
    this.props.action(this.state.value)
  }

  assertNumericOnly(e) {
    const re = /[0-9A-F:]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <div className="search-bar">
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Search by DIN..."
              onChange={this.handleChange}
              onKeyPress={(e) => this.assertNumericOnly(e)}
            />
            <InputGroup.Button>
              <button onClick={this.handleSearch}>Search</button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </div>
    )
  }

}

export default SearchBar;
