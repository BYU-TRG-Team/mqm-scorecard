import React, { useState } from "react";
import "./AdvancedSettingsModal.css";

const AdvancedSettingsModal = (props) => {
  const {
    className,
    issues,
    setShowAdvancedSettingsModal,
    filteredIssues,
    setFilteredIssues,
  } = props;

  const [expandableSectionConfig, setExpandableSectionConfig] = useState({});

  const toggleFilteredIssue = (toggledIssue) => {
    if (filteredIssues.includes(toggledIssue)) {
      setFilteredIssues(filteredIssues.filter((issue) => issue !== toggledIssue));
      return;
    }

    setFilteredIssues([...filteredIssues, toggledIssue]);
  };

  const handleCheckbox = (e) => {
    toggleFilteredIssue(e.target.id);
  };

  const closeModal = () => {
    setShowAdvancedSettingsModal(false);
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
        <input type="checkbox" onChange={handleCheckbox} id={issue.issue} checked={filteredIssues.includes(issue.issue)} />
        <span
          onClick={() => updateExpandableSection(issue.issue)}
          className={hasChildren && "advanced-settings-modal__expandable-section"}
        >
          { issue.name }
        </span>
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
        <Issue issue={parentIssue} level={0} />,
      );
    });

    return mappedIssues;
  };

  return (
    <div className={`advanced-settings-modal ${className || ""}`}>
      <div className="advanced-settings-modal__content-wrapper">
        <div className="advanced-settings-modal__close-icon-container">
          <span className="advanced-settings-modal__close-icon" onClick={closeModal}>
            &#10006;
          </span>
        </div>
        <p className="advanced-settings-modal__heading">
          <b>
            Advanced Filter Settings
          </b>
        </p>
        <div className="advanced-settings-modal__content">
          {
          mappedIssues(issues)
        }
        </div>
        <div className="advanced-settings-modal__buttons">
          <div>
            <button type="button" className="advanced-settings-modal__button advanced-settings-modal__button--clear" onClick={() => setFilteredIssues([])}>
              Clear All
            </button>
            <button type="button" className="advanced-settings-modal__button advanced-settings-modal__button--close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsModal;
