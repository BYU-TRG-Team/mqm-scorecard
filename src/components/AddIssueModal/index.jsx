/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import './AddIssueModal.css';
import Tooltip from '../Tooltip';
import CopyPaste from '../Icons/CopyPaste';
import { copyToClipboard } from '../../utils';

const AddIssueModal = (props) => {
  const {
    className,
    issues,
    setShowAddIssueModal,
    handleCreateSegmentError,
    highlightInstance
  } = props;

  const [selectedIssue, setSelectedIssue] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [note, setNote] = useState('');
  const [expandableSectionConfig, setExpandableSectionConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [showIssueCopyIcon, setShowIssueCopyIcon] = useState(false);
  const [showHighlightCopyIcon, setShowHighlightCopyIcon] = useState(false);
  const serializedHighlight = JSON.parse(highlightInstance.serializeHighlights())[0];

  const handleCheckbox = (selectedIssue) => {
    const { issue, name } = selectedIssue;
    setSelectedIssue(
      selectedIssue === issue
        ? ''
        : {
          issue,
          name
        }
    );
  };

  const handleSelect = (e) => {
    setSelectedSeverity(e.target.value);
  };

  const closeModal = () => {
    highlightInstance.removeHighlights();
    setShowAddIssueModal(false);
  };

  const createSegmentError = () => {
    const highlighting = highlightInstance.serializeHighlights();
    handleCreateSegmentError({
      highlighting,
      note,
      issue: selectedIssue.issue,
      level: selectedSeverity,
      highlightStartIndex: serializedHighlight[3],
      highlightEndIndex: serializedHighlight[3] + serializedHighlight[4] - 1
    });
    closeModal();
  };

  const updateExpandableSection = (issueId) => {
    setExpandableSectionConfig({
      ...expandableSectionConfig,
      [issueId]: (issueId in expandableSectionConfig) ? !expandableSectionConfig[issueId] : true,
    });
  };

  const Issue = (props) => {
    const { issue, level } = props;
    const hasChildren = Object.keys(issue.children).length > 0;
    const children = Object.keys(issue.children).map((child) => <Issue issue={issue.children[child]} level={level + 1} />);

    return (
      <div style={{ paddingLeft: `${level * 10}px` }}>
        <input type="checkbox" onChange={() => handleCheckbox(issue)} checked={issue.issue === selectedIssue.issue} />
        <span
          data-tip
          data-for={issue.issue}
          onClick={() => updateExpandableSection(issue.issue)}
          className={hasChildren && 'add-issue-modal__expandable-section'}
        >
          { issue.name }
        </span>
        <Tooltip id={issue.issue} delay={400}>
          <div className="add-issue-modal__tooltip">
            <div className="add-issue-modal__tooltip-heading">{ issue.name }</div>
            <ul>
              <li>
                MQM id:
                {' '}
                { issue.issue }
              </li>
              <li>
                Description:
                {' '}
                { issue.description }
              </li>
              <li>
                Parent:
                {' '}
                { issue.null ? `${issue.name} is a type of ${issue.parent}.` : `${issue.name} is a top-level MQM category.`}
              </li>
            </ul>
            <div className="add-issue-modal__tooltip-subheader">Examples</div>
            <p>
              { issue.examples }
            </p>
            <div className="add-issue-modal__tooltip-subheader">Notes</div>
            <p>
              { issue.notes }
            </p>
          </div>
        </Tooltip>
        {
          (hasChildren && !!expandableSectionConfig[issue.issue])
          && (
          <div>
            { children }
          </div>
          )
        }
      </div>
    );
  };

  const mappedIssues = (issues) => {
    const parentIssues = Object.keys(issues);
    const mappedIssues = [];

    if (parentIssues.length === 0) {
      return mappedIssues;
    }

    parentIssues.forEach((issue) => {
      const parentIssue = issues[issue];
      mappedIssues.push(
        <Issue issue={parentIssue} level={0} />
      );
    });

    return mappedIssues;
  };

  const pageOne = (
    <>
      {
        selectedSeverity === 'critical'
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
        {
          mappedIssues(issues)
        }
      </div>
      <div className="add-issue-modal__buttons">
        <select className="add-issue-modal__button" onChange={handleSelect}>
          <option disabled selected value="">-- Error Severity --</option>
          <option value="neutral">Neutral</option>
          <option value="minor">Minor</option>
          <option value="major">Major</option>
          <option value="critical">Critical</option>
        </select>
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
          onMouseDown={() => copyToClipboard(selectedIssue.name)}
          data-tip
          data-for="issueText"
          data-event="click"
          data-event-off="mouseleave"
        >
          Selected Issue:
          {' '}
          <b>
            { selectedIssue.name }
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
          {' '}
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
    <div className={`add-issue-modal ${className || ''}`}>
      <div className="add-issue-modal__content-wrapper">
        <div className="add-issue-modal__close-icon-container">
          <span className="add-issue-modal__close-icon" onClick={closeModal}>
            &#10006;
          </span>
        </div>
        {
          [
            pageOne,
            pageTwo
          ][currentPage]
        }
      </div>
    </div>
  );
};

export default AddIssueModal;
