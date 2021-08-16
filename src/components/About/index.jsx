import React from 'react';

const About = () => (
  <div>
    <h1>Contributors</h1>
    <p>The MQM Scorecard has been developed in a collaboration between the German Research Center for Artificial Intelligence (DFKI) GMbH, the Brigham Young University Translation Research Group (BYU TRG), and LTAC Global.</p>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img height="164" width="793" alt="[DFKI, BYU TRG, and LTAC logos]" src={`${process.env.PUBLIC_URL}/images/contributors.png`} />
    </div>
    <p>
      For purposes of copyright, DFKI GMbH is the owner of this work. The Scorecard is published under the
      {' '}
      <a href="https://github.com/multidimensionalquality/qt21-scorecard/blob/master/LICENSE.txt" target="_blank" rel="noreferrer">Apache 2.0 License</a>
      {' '}
      on
      {' '}
      <a href="https://github.com/multidimensionalquality/qt21-scorecard/" target="_blank" rel="noreferrer">GitHub</a>
      .
    </p>
    <h2>Supporters</h2>
    <p>Special thanks to the Caribbean Regional Information and Translation Institute (CRITI) which has generously supported development of the MQM scorecard through financing from the European Union.</p>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img height="131" width="400" alt="[CRITI logo]" src={`${process.env.PUBLIC_URL}/images/criti.png`} />
    </div>
    <h3>Contact</h3>
    <p>
      Bugs and feature requests should be made via the MQM Scorecard project’s
      {' '}
      <a href="https://github.com/BYU-TRG-Team/js-qt21-scorecard/issues" target="_blank" rel="noreferrer">bug tracker</a>
      . General inquiries can be sent to
      <a href="mailto:info@tranquality.info">info@tranquality.info</a>
      .
    </p>
  </div>
);

export default About;
