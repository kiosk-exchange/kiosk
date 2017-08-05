import React from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

function FieldGroup({ id, type, label, placeholder, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

export default FieldGroup