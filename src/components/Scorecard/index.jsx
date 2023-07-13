import React, { useState, useEffect } from "react";
import "./Scorecard.css";
import AddIssueModal from "../AddIssueModal";
import AdvancedSettingsModal from "../AdvancedSettingsModal";
import Segment from "../Segment";
import { ButtonGroup, IconButton, Box, Tooltip, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIssueDialog from "../EditIssueDialog";
import ClearIcon from "@mui/icons-material/Clear";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Scorecard = (props) => {
  const {
    segments,
    project,
    updateProject,
    highlightEnabled,
    setHighlightEnabled,
    deleteSegmentError,
    issues,
    setHighlightInstance,
    highlightInstance,
    createSegmentError,
    updateSegmentError
  } = props;

  const [segmentNavigationValue, setSegmentNavigationValue] = useState("");
  const [lastSegment, setLastSegment] = useState(1);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [showAdvancedSettingsModal, setShowAdvancedSettingsModal] = useState(false);
  const [targetType, setTargetType] = useState("");
  const [focusedIssue, setFocusedIssue] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [showEditIssueDialog, setShowEditIssueDialog] = useState(false);

  const filteredSegments = segments
    .filter((segment) => {
      const { Source, Target } = segment.segment_data;
      return Source.includes(filterText) || Target.includes(filterText);
    })
    .filter((segment) => {
      const { sourceErrors, targetErrors } = segment;

      // Disable filtering if filtered issues is empty
      let containsFilteredIssue = filteredIssues.length === 0;

      filteredIssues.forEach((filteredIssue) => {
        if (sourceErrors.filter((error) => error.issue === filteredIssue).length > 0) {
          containsFilteredIssue = true;
        }

        if (targetErrors.filter((error) => error.issue === filteredIssue).length > 0) {
          containsFilteredIssue = true;
        }
      });

      return containsFilteredIssue;
    });

  const updateSegmentNumber = (segNum) => {
    updateProject({ segmentNum: segNum });
  };

  const incrementSegmentNumber = (amount) => {
    const currentSegmentIndex = filteredSegments.findIndex((seg) => seg.segment_num === lastSegment);

    if (currentSegmentIndex === -1) {
      filteredSegments.length > 0 && updateSegmentNumber(filteredSegments[0].segment_num);
      return;
    }

    if (amount + currentSegmentIndex >= filteredSegments.length) {
      return;
    }

    if (amount + currentSegmentIndex < 0) {
      return;
    }

    updateSegmentNumber(
      filteredSegments[currentSegmentIndex + amount].segment_num,
    );
  };

  const handleNavigationSubmit = () => {
    try {
      const parsedSegmentNavigationValue = Number(segmentNavigationValue);
      if (
        !Number.isNaN(parsedSegmentNavigationValue)
        && Number.isInteger(parsedSegmentNavigationValue)
        && (parsedSegmentNavigationValue > 0)
        && (parsedSegmentNavigationValue <= segments.length)
      ) {
        updateSegmentNumber(parsedSegmentNavigationValue);
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleCreateSegmentError = (data) => {
    const currentSegmentId = segments.filter((seg) => seg.segment_num == lastSegment)[0].id;
    createSegmentError(currentSegmentId, {
      ...data,
      type: targetType,
    });
  };

  const mappedSegments = filteredSegments.map((segment) => {
    const isSelected = segment.segment_num == lastSegment;
    const metadataColumns = Object.keys(segment.segment_data).filter((type) => type !== "Source" && type !== "Target");
    return (
      <Segment
        segment={segment}
        isSelected={isSelected}
        metadataColumns={metadataColumns}
        updateSegmentNumber={updateSegmentNumber}
        highlightEnabled={highlightEnabled}
        setShowAddIssueModal={setShowAddIssueModal}
        setTargetType={setTargetType}
        setHighlightInstance={setHighlightInstance}
        setFocusedIssue={setFocusedIssue}
        focusedIssue={focusedIssue}
        updateSegmentError={updateSegmentError}
      />
    );
  });

  const NavTable = () => (
    <table className="scorecard__nav-table">
      <tbody>
        <tr className="scorecard__nav-table__row--button">
          <td className="scorecard__nav-table__cell">
          <IconButton
            size="small"
            onMouseDown={() => incrementSegmentNumber(-1)}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
          </td>
        </tr>
        <tr className="scorecard__nav-table__row--highlight">
          <td className="scorecard__nav-table__cell scorecard__nav-table__cell--highlight">
            <Tooltip
              placement="top"
              title="Enable/disable text highlighting"
            >
              <IconButton
                size="small"
                onMouseDown={() => setHighlightEnabled(!highlightEnabled)}
                disabled={focusedIssue !== null}
                color={highlightEnabled ? "warning" : "default"}
              >
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
          </td>
        </tr>
        <tr className="scorecard__nav-table__row--button">
          <td className="scorecard__nav-table__cell">
            <IconButton
              size="small"
              onMouseDown={() => incrementSegmentNumber(1)}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </td>
        </tr>
      </tbody>
    </table>
  );

  const issueTable = (
    <table className="scorecard__notes-table">
      <tbody>
        <tr className="scorecard__notes-table__row">
          <td className="scorecard__notes-table__cell">
            <Box sx={{ 
              ...(focusedIssue === null && { visibility: "hidden" }),
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: 200,
              height: 220
            }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end"
                }}>
                <ButtonGroup 
                  size="small" 
                  aria-label="Buttons for issue interactions"
                >
                  <Tooltip 
                    placement="bottom" 
                    title="Unselect issue"
                  >
                    <IconButton
                      aria-label="Unselect issue"
                      size="small"
                      onClick={() => setFocusedIssue(null)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip 
                    placement="bottom" 
                    title="Edit issue"
                  >
                    <IconButton
                      aria-label="Edit issue"
                      size="small"
                      onClick={() => setShowEditIssueDialog(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    placement="bottom" 
                    title="Delete issue"
                  >
                    <IconButton
                      aria-label="Delete issue"
                      size="small"
                      onClick={async () => {
                        if (focusedIssue !== null) {
                          await deleteSegmentError(focusedIssue.id);
                          setFocusedIssue(null);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </Box>
              <TextField
                label="Note"
                variant="outlined"
                value={focusedIssue?.note || " "}
                multiline
                InputProps={{
                  readOnly: true,
                }}
                maxRows={6}
                minRows={6}
              />
            </Box>
          </td>
        </tr>
        <tr className="scorecard__notes-table__row">
          <th className="scorecard__notes-table__cell-header">Navigation</th>
        </tr>
        <tr className="scorecard__notes-table__row">
          <td className="scorecard__notes-table__cell scorecard__notes-table__cell--navigation">
            Go to seg:&nbsp;
            <input type="text" size="9" value={segmentNavigationValue} onChange={(e) => setSegmentNavigationValue(e.target.value)} />
            <input type="button" value="Go" onClick={handleNavigationSubmit} />
          </td>
        </tr>
      </tbody>
    </table>
  );

  const filterTable = (
    <div className="scorecard__filter-table">
      <div className="scorecard__filter-table__heading">
        Filter
      </div>
      <div style={{ width: "240px", padding: "5px" }}>
        <input type="text" className="scorecard__filter-table__input" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        <br />
        <button type="button" className="scorecard__filter-table__advanced-button" onClick={() => setShowAdvancedSettingsModal(true)}>
          Advanced
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (project.last_segment) {
      setLastSegment(project.last_segment);
    }
  }, [project]);

  useEffect(() => {
    if (focusedIssue !== null) {
      let updatedFocusedIssue = false;

      for (const segment of filteredSegments) {
        for (const issue of [
          ...segment.sourceErrors, 
          ...segment.targetErrors
        ]) {
          if (issue.id === focusedIssue.id) {
            setFocusedIssue(issue);
            updatedFocusedIssue = true;
          }
        }

        if (updatedFocusedIssue) break;
      }
    }
  }, [segments])

  useEffect(() => {
    if (focusedIssue !== null) {
      setHighlightEnabled(false);
    }
  }, [focusedIssue]);

  useEffect(() => {
    setFocusedIssue(null)
  }, [filterText, filteredIssues]);

  return (
    <div className="scorecard">
      { showAddIssueModal && <AddIssueModal issues={issues} setShowAddIssueModal={setShowAddIssueModal} handleCreateSegmentError={handleCreateSegmentError} highlightInstance={highlightInstance} /> }
      { showAdvancedSettingsModal && <AdvancedSettingsModal issues={issues} setShowAdvancedSettingsModal={setShowAdvancedSettingsModal} filteredIssues={filteredIssues} setFilteredIssues={setFilteredIssues} /> }
      {
        showEditIssueDialog &&
        <EditIssueDialog 
          issues={issues}
          issue={focusedIssue} 
          onClose={() => setShowEditIssueDialog(false)} 
          onUpdate={async (data) => {
            await updateSegmentError(focusedIssue.id, data);
            setShowEditIssueDialog(false) 
          }}
        />
      }
      <table className="scorecard__table">
        <thead>
          <tr>
            <th className="scorecard__table__cell-header" width="24" style={{ padding: "0px" }} />
            <th className="scorecard__table__cell-header" width="36" />
            <th className="scorecard__table__cell-header" width="400">
              Source:
              {" "}
              { lastSegment }
              {" "}
              of 16
            </th>
            <th className="scorecard__table__cell-header" width="400">
              Target:
              {" "}
              { lastSegment }
              {" "}
              of 16
            </th>
            <th className="scorecard__table__cell-header" width="24" style={{ padding: "0px" }} />
            <th className="scorecard__table__cell-header" width="200">Issue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="scorecard__table__cell" rowSpan="2" style={{ padding: "0px" }}>
              <NavTable />
            </td>
            <td colSpan="3" className="scorecard__table__cell" style={{ padding: "0" }}>
              <table className="scorecard__segment-table">
                <tbody>
                  <tr>
                    <td colSpan="3" className="scorecard__segment-table__cell scorecard__segment-table__cell--beginning" style={{ backgroundColor: "#cccccc" }}>Beginning of file</td>
                  </tr>
                  { mappedSegments }
                </tbody>
              </table>
            </td>
            <td rowSpan="2" style={{ padding: "0px" }} className="scorecard__table__cell">
              <NavTable />
            </td>
            <td rowSpan="2" style={{ padding: "0px" }} className="scorecard__table__cell">
              { issueTable }
            </td>
          </tr>
        </tbody>
      </table>
      { filterTable }
    </div>
  );
};

export default Scorecard;
