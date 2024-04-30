import React, { useCallback, useEffect, useState } from "react";
import "./Segment.css";
import TextHighlighter from "texthighlighter";

const Segment = (props) => {
  const {
    segment,
    isSelected,
    metadataColumns,
    updateSegmentNumber,
    highlightEnabled,
    setTargetType,
    setShowAddErrorModal,
    setHighlightInstance,
    setFocusedError,
    focusedError,
  } = props;

  const [sourceHighlightInstance, setSourceHighlightInstance] = useState(null);
  const [targetHighlightInstance, setTargetHighlightInstance] = useState(null);
  const highlightedContextSelector = "scorecard__segment-table__highlight-context";

  const sourceRef = useCallback((node) => {
    if (node !== null && !sourceHighlightInstance) {
      const highlightInstance = new TextHighlighter(node,
        {
          onBeforeHighlight(range) {
            const selectionContainer = range.commonAncestorContainer;
            const isNodeHighlighted = selectionContainer.classList ? selectionContainer.classList.contains(highlightedContextSelector) : false;
            const isParentHighlighted = selectionContainer.parentNode && selectionContainer.parentNode.classList ? selectionContainer.parentNode.classList.contains(highlightedContextSelector) : false;
            return isNodeHighlighted || isParentHighlighted;
          },
          onAfterHighlight() {
            setTargetType("source");
            setHighlightInstance(highlightInstance);
            setShowAddErrorModal(true);
          },
        });

      setSourceHighlightInstance(highlightInstance);
    }

    if (node !== null && isSelected) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSelected]);

  const targetRef = useCallback((node) => {
    if (node !== null && !targetHighlightInstance) {
      const highlightInstance = new TextHighlighter(node,
        {
          onBeforeHighlight(range) {
            const selectionContainer = range.commonAncestorContainer;
            const isNodeHighlighted = selectionContainer.classList ? selectionContainer.classList.contains(highlightedContextSelector) : false;
            const isParentHighlighted = selectionContainer.parentNode && selectionContainer.parentNode.classList ? selectionContainer.parentNode.classList.contains(highlightedContextSelector) : false;
            return isNodeHighlighted || isParentHighlighted;
          },
          onAfterHighlight() {
            setTargetType("target");
            setHighlightInstance(highlightInstance);
            setShowAddErrorModal(true);
          },
        });

      setTargetHighlightInstance(highlightInstance);
    }
  }, []);

  useEffect(() => {
    const focusedSourceError = segment.sourceErrors.filter((error) => error.id === focusedError?.id)[0];
    const focusedTargetError = segment.targetErrors.filter((error) => error.id === focusedError?.id)[0];

    if (sourceHighlightInstance && targetHighlightInstance) {
      sourceHighlightInstance.removeHighlights();
      targetHighlightInstance.removeHighlights();
    }

    if (focusedSourceError && sourceHighlightInstance) {
      sourceHighlightInstance.deserializeHighlights(focusedSourceError.highlighting);
    }

    if (focusedTargetError && targetHighlightInstance) {
      targetHighlightInstance.deserializeHighlights(focusedTargetError.highlighting);
    }
  }, [focusedError]);

  return (
    <>
      <tr className={`scorecard__segment-table__row--segment ${isSelected ? "scorecard__segment-table__row--selected-top" : ""}`} onDoubleClick={() => updateSegmentNumber(segment.segment_num)}>
        <td width="36" rowSpan="3" className={`scorecard__segment-table__cell scorecard__segment-table__cell--highlighter ${isSelected ? "scorecard__segment-table__cell-selected" : ""}`}>{ segment.segment_num }</td>
        <td width="400" className="scorecard__segment-table__cell scorecard__segment-table__cell--source">
          <div style={{ width: "400px", wordWrap: "break-word" }} className={`${isSelected && highlightEnabled ? highlightedContextSelector : ""}`} ref={sourceRef}>
            { segment.segment_data.Source }
          </div>
        </td>
        <td width="400" className="scorecard__segment-table__cell scorecard__segment-table__cell--target">
          <div style={{ width: "400px", wordWrap: "break-word" }} className={`${isSelected && highlightEnabled ? highlightedContextSelector : ""}`} ref={targetRef}>
            {segment.segment_data.Target}
          </div>
        </td>
      </tr>
      <tr className="scorecard__segment-table__row--segment-types" onDoubleClick={() => updateSegmentNumber(segment.segment_num)}>
        <td colSpan="3" className="scorecard__segment-table__cell" style={metadataColumns.length === 0 ? { borderTop: "none", padding: "0px" } : {}}>
          {
            metadataColumns.map((type) => (
              <div>
                <span className="scorecard__segment-table__category">
                  { type }
                </span>
                :
                {" "}
                { segment.segment_data[type] }
                <br />
              </div>
            ))
          }
        </td>
      </tr>
      <tr segment-id="100" className={`scorecard__segment-table__row--errors ${isSelected ? "scorecard__segment-table__row--selected-bottom" : ""}`} style={{ backgroundColor: "#cccccc" }} onDoubleClick={() => updateSegmentNumber(segment.segment_num)}>
        <td className="scorecard__segment-table__cell scorecard__segment-table__cell--error">
          {
            segment.sourceErrors.length === 0
              ? <span>&nbsp;</span>
              : segment.sourceErrors.map((error) => (
                <button
                  type="button"
                  className={`scorecard__segment-table__error--${error.level}`}
                  onClick={(e) => { 
                    e.target.focus(); 
                    setFocusedError(error); 
                  }}
                >
                  { error.issue }
                </button>
              ))
          }
        </td>
        <td className="scorecard__segment-table__cell scorecard__segment-table__cell--error">
          {
            segment.targetErrors.length === 0
              ? <span>&nbsp;</span>
              : segment.targetErrors.map((error) => (
                <button
                  type="button"
                  className={
                    `scorecard__segment-table__error--${error.level} ${focusedError?.id === error.id && "scorecard__segment-table__error--selected"}`
                  }
                  onClick={(e) => { 
                    e.target.focus(); 
                    setFocusedError(error); 
                  }}
                >
                  { error.issue_name }
                </button>
              ))
          }
        </td>
      </tr>
    </>
  );
};

export default Segment;
