import { Dialog, DialogTitle, DialogContent, MenuItem, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import IssueTypeDropdown from "../IssueTypeDropdown";
import issueSeverities from "../../issue-severities";
import IssueSeverityDropdown from "../IssueSeverityDropdown";

const EditIssueDialog = (props) => {
  const {
    onClose,
    onUpdate,
    issue,
    issues
  } = props;

  const [note, setNote] = useState(issue.note)
  const [severity, setSeverity] = useState(issue.level)
  const [type, setType] = useState(issue.issue)

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Issue</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          label="Note"
          type="text"
          variant="standard"
          margin="normal"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <IssueSeverityDropdown 
          severities={issueSeverities}
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        />
        <IssueTypeDropdown 
          issues={issues} 
          value={type}
          onChange={(event) => setType(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onUpdate({ 
          note, 
          level: severity, 
          issue: type 
        })}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIssueDialog;
