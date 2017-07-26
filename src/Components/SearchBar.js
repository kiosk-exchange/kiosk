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