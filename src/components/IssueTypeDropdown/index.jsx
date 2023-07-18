import React from "react";
import { TextField, MenuItem, Tooltip, Typography, Box, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const IssueTypeDropdown = (props) => {
  const {
    issues,
    onChange,
    value
  } = props

  const mapIssuesToMenuItems = (issues, level = 0) => {
    const menuItems = [];

    Object.keys(issues).forEach(issueType => {
      const issue = issues[issueType];

      menuItems.push(
        <MenuItem
          value={issue.issue}
          key={issue.issue}
          sx={{ 
            paddingLeft: 2 + (level * 4)
          }}
        >
          { issue.name }
          <Tooltip
              title={
                <Box>
                  <Typography variant="h6">
                    MQM ID
                  </Typography>
                  <Typography variant="body">
                    { issue.issue }
                  </Typography>
                  <Typography variant="h6">
                    Description
                  </Typography>
                  <Typography variant="body">
                    { issue.description }
                  </Typography>
                  <Typography variant="h6">
                    Parent
                  </Typography>
                  <Typography variant="body">
                    { issue.parent ? `${issue.name} is a type of ${issue.parent}.` : `${issue.name} is a top-level MQM category.` }
                  </Typography>
                  <Typography variant="h6">
                    Examples
                  </Typography>
                  <Typography variant="body">
                    { issue.examples }
                  </Typography>
                  <Typography variant="h6">
                    Notes
                  </Typography>
                  <Typography variant="body">
                    { issue.notes }
                  </Typography>
                </Box>
              }
            >
              <IconButton size="small" label="Info">
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
        </MenuItem>
      );

      if (Object.keys(issue.children).length > 0) {
        menuItems.push(
          ...mapIssuesToMenuItems(issue.children, level + 1)
        );
      }
    })

    return menuItems;
  }

  return (
    <TextField
      fullWidth
      select
      margin="normal"
      value={value}
      label="Type"
      onChange={onChange}
    >
      { mapIssuesToMenuItems(issues) }
    </TextField>
  );
} 

export default IssueTypeDropdown;