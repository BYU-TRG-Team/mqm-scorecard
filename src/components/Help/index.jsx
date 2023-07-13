import React, { useState, useEffect } from "react";
import Accordion from "../Accordion";
import {
  overview, creatingProjects, scorecardInterface, severityLevels, reportingScores,
} from "./content";

const Help = () => {
  const initialStatuses = {
    overview: false,
    creatingProjects: false,
    scorecardInterace: false,
    severityLevels: false,
    reportingScores: false,
  };

  const [accordionStatuses, setAccordionStatuses] = useState(initialStatuses);

  const handleClick = (newState) => {
    setAccordionStatuses({
      ...initialStatuses,
      ...newState,
    });
  };

  useEffect(() => {
    setAccordionStatuses({
      ...initialStatuses,
      ...{ overview: true },
    });
  }, []);

  return (
    <div style={{ marginTop: "10px" }}>
      <Accordion header="Overview" content={overview} isOpen={accordionStatuses.overview} onClick={() => handleClick({ overview: true })} />
      <Accordion header="Creating projects" content={creatingProjects} isOpen={accordionStatuses.creatingProjects} onClick={() => handleClick({ creatingProjects: true })} />
      <Accordion header="Using the Scorecard Interface" content={scorecardInterface} isOpen={accordionStatuses.scorecardInterface} onClick={() => handleClick({ scorecardInterface: true })} />
      <Accordion header="Severity Levels" content={severityLevels} isOpen={accordionStatuses.severityLevels} onClick={() => handleClick({ severityLevels: true })} />
      <Accordion header="Reporting and Scores" content={reportingScores} isOpen={accordionStatuses.reportingScores} onClick={() => handleClick({ reportingScores: true })} />
    </div>
  );
};

export default Help;
