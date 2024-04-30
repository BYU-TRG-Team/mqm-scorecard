import React from "react";
import "./Reports.css";

const Reports = (props) => {
  const {
    issues, report, projectId, projectName,
  } = props;
  const parseValue = (val) => (val > 0 ? <span className="reports__error">{ val }</span> : val);
  const emptyRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const constructRows = (issue) => {
    const rows = [];
    const results = report[issue.issue] ? [...report[issue.issue]] : [...emptyRow];
    const subTotal = report[issue.issue] ? [...report[issue.issue]] : [...emptyRow];

    rows.push(
      <tr>
        <td className="reports__cell--white reports__cell">
          <b>
            { issue.name }
          </b>
        </td>
        <td className="reports__cell--neutral reports__cell">
          { parseValue(results[0]) }
        </td>
        <td className="reports__cell--minor reports__cell">
          { parseValue(results[1]) }
        </td>
        <td className="reports__cell--major reports__cell">
          { parseValue(results[2]) }
        </td>
        <td className="reports__cell--critical reports__cell">
          { parseValue(results[3]) }
        </td>
        <td className="reports__cell--white reports__cell">
          { parseValue(results[4]) }
        </td>
        <td className="reports__cell--neutral reports__cell">
          { parseValue(results[5]) }
        </td>
        <td className="reports__cell--minor reports__cell">
          { parseValue(results[6]) }
        </td>
        <td className="reports__cell--major reports__cell">
          { parseValue(results[7]) }
        </td>
        <td className="reports__cell--critical reports__cell">
          { parseValue(results[8]) }
        </td>
        <td className="reports__cell--white reports__cell">
          { parseValue(results[9]) }
        </td>
        <td className="reports__cell--white reports__cell">
          { parseValue(results[10]) }
        </td>
      </tr>,
    );

    if (Object.keys(issue.children).length > 0) {
      Object.keys(issue.children).forEach((child) => {
        const childIssue = issue.children[child];
        const [childSubTotal, childRows] = constructRows(childIssue);
        rows.push(childRows);
        subTotal.forEach((val, index) => {
          subTotal[index] += childSubTotal[index];
        });
      });
    }

    return [subTotal, rows];
  };

  const mappedIssues = Object.keys(issues).map((parent) => {
    const parentIssue = issues[parent];
    const [subTotal, rows] = constructRows(parentIssue);
    subTotal.forEach((val, index) => {
      total[index] += val;
    });

    return (
      <>
        <tr>
          <td colSpan="12" className="reports__cell reports__cell--subheading">
            { parentIssue.name }
          </td>
        </tr>
        { rows }
        <tr className="reports__row--subtotal">
          <td className="reports__cell">
            <b>
              Subtotal
            </b>
          </td>
          {
            subTotal.map((val) => (
              <td className="reports__cell">
                { parseValue(val) }
              </td>
            ))
          }
        </tr>
      </>
    );
  });

  return (
    <div>
      <h2>
        Report on Annotation Results
      </h2>
      <div className="reports">
        <table className="reports__table">
          <tbody>
            <tr>
              <th rowSpan="2" className="reports__header-cell">Issue</th>
              <th colSpan="5" className="reports__header-cell">Source</th>
              <th colSpan="5" className="reports__header-cell">Target</th>
              <th rowSpan="2" className="reports__header-cell">Total</th>
            </tr>

            <tr>
              <th className="reports__header-cell--neutral reports__header-cell">Neutral</th>
              <th className="reports__header-cell--minor reports__header-cell">Minor</th>
              <th className="reports__header-cell--major reports__header-cell">Major</th>
              <th className="reports__header-cell--critical reports__header-cell">Critical</th>
              <th className="reports__header-cell--total reports__header-cell">Subtotal</th>
              <th className="reports__header-cell--neutral reports__header-cell">Neutral</th>
              <th className="reports__header-cell--minor reports__header-cell">Minor</th>
              <th className="reports__header-cell--major reports__header-cell">Major</th>
              <th className="reports__header-cell--critical reports__header-cell">Critical</th>
              <th className="reports__header-cell--total reports__header-cell">Subtotal</th>
            </tr>

            { mappedIssues }

            <tr className="reports__row--total">
              <td className="reports__cell">
                <b>
                  Total
                </b>
              </td>
              {
                total.map((val) => (
                  <td className="reports__cell">
                    { parseValue(val) }
                  </td>
                ))
              }
            </tr>
          </tbody>
        </table>

        <div className="reports__buttons">
          <a className="reports__button" role="button" href={`/api/project/${projectId}/report`} download={`${projectName}_report`}>
            Export Scorecard data (JSON)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reports;
