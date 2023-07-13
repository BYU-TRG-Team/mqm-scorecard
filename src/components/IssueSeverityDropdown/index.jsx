import React from "react";
import { TextField, MenuItem } from "@mui/material";

const IssueSeverityDropdown = (props) => {
  const { 
    severities,
    onChange,
    value
  } = props;

  return (
    <TextField
      fullWidth
      select
      margin="normal"
      value={value}
      label="Severity"
      onChange={onChange}
    >
      {
        severities.map((severity) => (
          <MenuItem value={severity.value}>
            { severity.label }
          </MenuItem>
        ))
      }
    </TextField>
  )
};

export default IssueSeverityDropdown;