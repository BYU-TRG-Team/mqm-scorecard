import React, { useState, useEffect } from 'react';
import './Scorecard.css';
import Tooltip from '../Tooltip';
import AddIssueModal from '../AddIssueModal';
import AdvancedSettingsModal from '../AdvancedSettingsModal';
import Segment from '../Segment';

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
    createSegmentError
  } = props;

  const [segmentNavigationValue, setSegmentNavigationValue] = useState('');
  const [lastSegment, setLastSegment] = useState(1);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [showAdvancedSettingsModal, setShowAdvancedSettingsModal] = useState(false);
  const [targetType, setTargetType] = useState('');
  const [focusedIssue, setFocusedIssue] = useState('');
  const [focusedIssueNote, setFocusedIssueNote] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);

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
      filteredSegments[currentSegmentIndex + amount].segment_num
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
    const metadataColumns = Object.keys(segment.segment_data).filter((type) => type !== 'Source' && type !== 'Target');
    return (
      <Segment
        segment={segment}
        isSelected={isSelected}
        metadataColumns={metadataColumns}
        updateSegmentNumber={updateSegmentNumber}
        highlightEnabled={highlightEnabled}
        deleteSegmentError={deleteSegmentError}
        setShowAddIssueModal={setShowAddIssueModal}
        setTargetType={setTargetType}
        setHighlightInstance={setHighlightInstance}
        setFocusedIssue={setFocusedIssue}
        focusedIssue={focusedIssue}
        setFocusedIssueNote={setFocusedIssueNote}
      />
    );
  });

  const NavTable = () => (
    <table className="scorecard__nav-table">
      <tbody>
        <tr className="scorecard__nav-table__row--button">
          <td className="scorecard__nav-table__cell">
            <button
              type="button"
              className="scorecard__nav-table__button scorecard__nav-table__button--up"
              style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/arrow_up--zero-state.png")` }}
              onMouseOver={(e) => { e.target.style.background = `url("${process.env.PUBLIC_URL}/images/arrow_up--hover.png")`; }}
              onMouseOut={(e) => { e.target.style.background = `url("${process.env.PUBLIC_URL}/images/arrow_up--zero-state.png")`; }}
              onClick={() => incrementSegmentNumber(-1)}
            />
          </td>
        </tr>
        <tr className="scorecard__nav-table__row--highlight">
          <td className="scorecard__nav-table__cell scorecard__nav-table__cell--highlight">
            <button
              type="button"
              className="scorecard__nav-table__button"
              style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/${highlightEnabled ? 'highlight_on' : 'highlight_off'}.png")` }}
              onMouseDown={() => { setHighlightEnabled(!highlightEnabled); }}
              data-tip
              data-for="highlightButton"
            />
            <Tooltip id="highlightButton">
              Enable/disable text highlighting
            </Tooltip>
          </td>
        </tr>
        <tr className="scorecard__nav-table__row--button">
          <td className="scorecard__nav-table__cell">
            <button
              type="button"
              className="scorecard__nav-table__button scorecard__nav-table__button--down"
              style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/images/arrow_down--zero-state.png")` }}
              onMouseOver={(e) => { e.target.style.background = `url("${process.env.PUBLIC_URL}/images/arrow_down--hover.png")`; }}
              onMouseOut={(e) => { e.target.style.background = `url("${process.env.PUBLIC_URL}/images/arrow_down--zero-state.png")`; }}
              onClick={() => incrementSegmentNumber(1)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );

  const notesTable = (
    <table className="scorecard__notes-table">
      <tbody>
        <tr className="scorecard__notes-table__row">
          <td className="scorecard__notes-table__cell">
            <textarea className="scorecard__notes-table__textarea" value={focusedIssueNote} disabled={true} />
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
      <div style={{ width: '240px', padding: '5px' }}>
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
    if (focusedIssue) {
      setHighlightEnabled(false);
    }
  }, [focusedIssue]);

  return (
    <div className="scorecard">
      { showAddIssueModal && <AddIssueModal issues={issues} setShowAddIssueModal={setShowAddIssueModal} handleCreateSegmentError={handleCreateSegmentError} highlightInstance={highlightInstance} /> }
      { showAdvancedSettingsModal && <AdvancedSettingsModal issues={issues} setShowAdvancedSettingsModal={setShowAdvancedSettingsModal} filteredIssues={filteredIssues} setFilteredIssues={setFilteredIssues} /> }
      <table className="scorecard__table">
        <thead>
          <tr>
            <th className="scorecard__table__cell-header" width="24" style={{ padding: '0px' }} />
            <th className="scorecard__table__cell-header" width="36" />
            <th className="scorecard__table__cell-header" width="400">
              Source:
              {' '}
              { lastSegment }
              {' '}
              of 16
            </th>
            <th className="scorecard__table__cell-header" width="400">
              Target:
              {' '}
              { lastSegment }
              {' '}
              of 16
            </th>
            <th className="scorecard__table__cell-header" width="24" style={{ padding: '0px' }} />
            <th className="scorecard__table__cell-header" width="200">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="scorecard__table__cell" rowSpan="2" style={{ padding: '0px' }}>
              <NavTable />
            </td>
            <td colSpan="3" className="scorecard__table__cell" style={{ padding: '0' }}>
              <table className="scorecard__segment-table">
                <tbody>
                  <tr>
                    <td colSpan="3" className="scorecard__segment-table__cell scorecard__segment-table__cell--beginning" style={{ backgroundColor: '#cccccc' }}>Beginning of file</td>
                  </tr>
                  { mappedSegments }
                </tbody>
              </table>
            </td>
            <td rowSpan="2" style={{ padding: '0px' }} className="scorecard__table__cell">
              <NavTable />
            </td>
            <td rowSpan="2" style={{ padding: '0px' }} className="scorecard__table__cell">
              { notesTable }
            </td>
          </tr>
        </tbody>
      </table>
      { filterTable }
    </div>
  );
};

export default Scorecard;
