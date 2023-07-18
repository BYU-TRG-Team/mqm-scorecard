/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from "react";
import "./AddIssueModal.css";
import Tooltip from "../Tooltip";
import CopyPaste from "../Icons/CopyPaste";
import { copyToClipboard } from "../../utils";
import IssueSeverityDropdown from "../IssueSeverityDropdown";
import issueSeverities from "../../issue-severities";
import IssueTypeDropdown from "../IssueTypeDropdown";

const AddIssueModal = (props) => {
  const {
    className,
    issues,
    setShowAddIssueModal,
    handleCreateSegmentError,
    highlightInstance,
  } = props;

  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [note, setNote] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showIssueCopyIcon, setShowIssueCopyIcon] = useState(false);
  const [showHighlightCopyIcon, setShowHighlightCopyIcon] = useState(false);
  const serializedHighlight = JSON.parse(highlightInstance.serializeHighlights())[0];

  const closeModal = () => {
    highlightInstance.removeHighlights();
    setShowAddIssueModal(false);
  };

  const createSegmentError = () => {
    const highlighting = highlightInstance.serializeHighlights();
    handleCreateSegmentError({
      highlighting,
      note,
      issue: selectedIssue,
      level: selectedSeverity,
      highlightStartIndex: serializedHighlight[3],
      highlightEndIndex: serializedHighlight[3] + serializedHighlight[4] - 1,
    });
    closeModal();
  };

  const pageOne = (
    <>
      {
        selectedSeverity === "critical"
        && (
        <span className="add-issue-modal__critical-note">
          Note: Adding a critical issue will cause this project to fail this quality check
        </span>
        )
      }
      <p className="add-issue-modal__heading">
        <b>
          Add New Error
        </b>
      </p>
      <div className="add-issue-modal__content">
        <IssueTypeDropdown 
          issues={issues}
          value={selectedIssue}
          onChange={(event) => setSelectedIssue(event.target.value)}
        />
        <IssueSeverityDropdown 
          severities={issueSeverities}
          value={selectedSeverity}
          onChange={(event) => setSelectedSeverity(event.target.value)}
        />
      </div>
      <div className="add-issue-modal__buttons">
        <div>
          <button type="button" className="add-issue-modal__button add-issue-modal__button--cancel" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className="add-issue-modal__button add-issue-modal__button--continue" onClick={() => setCurrentPage(1)} disabled={!selectedIssue || !selectedSeverity}>
            Continue
          </button>
        </div>
      </div>
    </>
  );

  const pageTwo = (
    <>
      <p className="add-issue-modal__heading">
        <b>
          Add Notes
        </b>
      </p>
      <div className="add-issue-modal__copyable-text-wrapper">
        <p
          className="add-issue-modal__copyable-text"
          onMouseEnter={() => setShowIssueCopyIcon(true)}
          onMouseLeave={() => setShowIssueCopyIcon(false)}
          onMouseDown={() => copyToClipboard(selectedIssue)}
          data-tip
          data-for="issueText"
          data-event="click"
          data-event-off="mouseleave"
        >
          Selected Issue:
          {" "}
          <b>
            { selectedIssue }
          </b>
          {
            showIssueCopyIcon
            && <CopyPaste className="add-issue-modal__copy-paste-icon" />
          }
        </p>
        <Tooltip id="issueText" delay={0}>
          Copied!
        </Tooltip>
        <p
          className="add-issue-modal__copyable-text"
          onMouseEnter={() => setShowHighlightCopyIcon(true)}
          onMouseLeave={() => setShowHighlightCopyIcon(false)}
          onMouseDown={() => copyToClipboard(serializedHighlight[1])}
          data-tip
          data-for="highlightText"
          data-event="click"
          data-event-off="mouseleave"
        >
          Highlighted Text:
          {" "}
          <b>
            { serializedHighlight[1]}
          </b>
          {
            showHighlightCopyIcon
            && <CopyPaste className="add-issue-modal__copy-paste-icon" />
          }
          <Tooltip id="highlightText" delay={0}>
            Copied!
          </Tooltip>

        </p>
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} className="add-issue-modal__note" />
      <div className="add-issue-modal__buttons add-issue-modal__buttons--second-page">
        <button type="button" className="add-issue-modal__button" onClick={() => setCurrentPage(0)}>
          Back
        </button>
        <button type="button" className="add-issue-modal__button add-issue-modal__button--continue" onClick={createSegmentError}>
          Add New Error
        </button>
      </div>
    </>
  );

  return (
    <div className={`add-issue-modal ${className || ""}`}>
      <div className="add-issue-modal__content-wrapper">
        <div className="add-issue-modal__close-icon-container">
          <span className="add-issue-modal__close-icon" onClick={closeModal}>
            &#10006;
          </span>
        </div>
        {
          [
            pageOne,
            pageTwo,
          ][currentPage]
        }
      </div>
    </div>
  );
};

export default AddIssueModal;
