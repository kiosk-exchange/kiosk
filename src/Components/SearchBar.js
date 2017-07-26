import React, { Component } from 'react';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
              <button>Search</button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </div>
    )
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // this.state.contract.get(this.state.value, function(error, result) { 
    //   if (result) {
    //     this.setState({
    //       fullName: result[0],
    //       email: result[2]
    //     });
    //   }
    // });
    event.preventDefault();
  }

}

export default SearchBar;