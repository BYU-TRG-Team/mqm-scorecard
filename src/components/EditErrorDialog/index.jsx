import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import IssueDropdown from "../IssueDropdown";
import errorSeverities from "../../error-severities";
import ErrorSeverityDropdown from "../ErrorSeverityDropdown";

const EditErrorDialog = (props) => {
  const {
    onClose,
    onUpdate,
    error,
    issues
  } = props;

  const [note, setNote] = useState(error.note)
  const [severity, setSeverity] = useState(error.level)
  const [issue, setIssue] = useState(error.issue)

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
        <ErrorSeverityDropdown
          severities={errorSeverities}
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        />
        <IssueDropdown 
          issues={issues} 
          value={issue}
          onChange={(event) => setIssue(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onUpdate({ 
          note, 
          level: severity, 
          issue,
        })}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditErrorDialog;
