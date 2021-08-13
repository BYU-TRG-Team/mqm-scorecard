import React, { useState, useEffect } from 'react';
import Accordion from '../Accordion';

const Specifications = (props) => {
  const { specifications } = props;
  const [parsedSpecifications, setParsedSpecifications] = useState({});
  const [accordionStatuses, setAccordionStatuses] = useState([]);

  const handleClick = (index) => {
    const newAccordionStatus = parsedSpecifications.specifications.map(() => false);
    newAccordionStatus[index] = true;
    setAccordionStatuses(newAccordionStatus);
  };

  useEffect(() => {
    if (specifications) {
      const jsonSpecifications = JSON.parse(specifications);
      setParsedSpecifications(jsonSpecifications);
      setAccordionStatuses(jsonSpecifications.specifications.map((spec, index) => index === 0));
    }
  }, []);

  return (
    <div>
      <h2>Project Specifications</h2>
      {
        parsedSpecifications.specifications
          ? (
            <div>
              {
                parsedSpecifications.specifications.map((specification, index) => (
                  <Accordion
                    header={specification.name}
                    content={
                      specification.sections.map((section) => (
                        <div>
                          <h4>{ section.name }</h4>
                          {
                            section.subsections.map((subsection) => (
                              <div>
                                <h5>
                                  { subsection.name}
                                </h5>
                                <ul>
                                  {
                                    subsection.contentList.map((val) => <li>{val}</li>)
                                  }
                                </ul>
                              </div>
                            ))
                          }
                        </div>
                      ))

                    }
                    isOpen={accordionStatuses[index]}
                    onClick={() => handleClick(index)}
                  />

                ))
              }
            </div>
          )
          : (
            <p>
              No specifications are available for this project.
            </p>
          )
      }
    </div>
  );
};

export default Specifications;
