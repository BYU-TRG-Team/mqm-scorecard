import React from "react";

export const overview = (
  <div>
    <p>The MQM Scorecard is an easy-to-use system for analyzing translated documents using the Multidimensional Quality Metrics (MQM) framework. Scorecard projects require two files: the text to be assessed and an XML metrics specification file. They may also optionally include an XML projects specifications file.</p>
    <p>
      The Scorecard allows you to go through translated files segment by segment and apply issues to them. Issues are used to mark problems in the text that need to be resolved. (We use the term
      {" "}
      <em>issue</em>
      {" "}
      instead of
      {" "}
      <em>error</em>
      {" "}
      since issues may include items that are not errors that need to be changed.)
    </p>
  </div>
);

export const creatingProjects = (
  <div>
    <p>Projects can be created by users with appropriate administrative-level access by clicking on &quot;Create project&quot; at the top of the Scorecard interface. To create a project you will need, at a minimum, a tab-delimited translation file and an XML issues file.</p>
    <h4>Translation files</h4>
    <p>Simple translation files consist of a set of lines consisting of a source text segment followed by a tab character followed by a target text segment. These files must be UTF-8 encoded and can contain text in any language supported by your web browser.</p>
    <p><em>Example:</em></p>
    <pre>
      Ich habe das Gemüse gegessen. I ate the vegetables.
      <br />
      Das war lecker. It was delicious.
    </pre>

    <p>In some cases you may wish to have additional metadata about the project visible to the user. In such cases, you can add extra columns to the file. If you have more than two columns, your input file MUST have a header row that identifies the columns. The first two columns MUST be labeled Target and Source, but additional files can have any name you choose (as long as it does not include a tab character). The additional columns will be displayed, along with their labels, beneath each segment.</p>
    <p><em>Example:</em></p>
    <pre>
      Source    Target    Label
      <br />
      {"{{"}
      device would like to pair with this phone. To accept, enter the PIN on the device.    dispositivo quiere vincularse con este dispositivo. Para aceptar, escriba el PIN en el
      {" "}
      {"{{"}
      dispositivo
      {"}}"}
      .   passive-pair-pincode    Remove
      {" "}
      {"{{"}
      name
      {"}}"}
      {" "}
      from system?        ¿Eliminar
      {" "}
      {"{{"}
      John
      {"}}"}
      {" "}
      del sistema?     remove-message
    </pre>
    <p>In this example an internal message label is presented in the third column and is shown to the user. Metadata columns can contain any information you wish to provide to the user.</p>

    <h4>Metrics files</h4>
    <p>
      Metrics files define the issues that you can assign in your project. They should be selected to match your project specifications. (For example, if you are assessing an advertising text, you might add
      {" "}
      <em>Style</em>
      {" "}
      as an issue, while if you are assessing a service text, you might not.) Guidance on designing metrics is beyond the scope of this help file, but the
      {" "}
      <a href="http://tranquality.info" target="_blank" rel="noreferrer">Tranquality</a>
      {" "}
      site has guidance on designing metrics.
    </p>
    <p>A sample metrics file is presented below</p>
    <pre>
      {
                `
<?xml version="1.0" encoding="UTF-8"?>
<issues>
    <issue type="terminology" level="0"/>
    <issue type="accuracy" level="0">
        <issue type="addition" level="1"/>
        <issue type="omission" level="1"/>
        <issue type="mistranslation" level="1"/>
    </issue>
    <issue type="fluency" level="0">
        <issue type="spelling" level="1"/>
        <issue type="grammar" level="1"/>
    </issue>
    <issue type="style" level="0"/>
</issues>
                `
            }
    </pre>
    <br />
    <p>
      This metric contains nine issue types. They are taken from the
      {" "}
      <a href="http://qt21.eu/mqm-definition" target="_blank" rel="noreferrer">MQM definition</a>
      . Using issues from MQM ensures maximal compatibility between metrics and also has the advantage that the MQM Scorecard can provide &quot;hover help&quot; for this issues. If you need issue types not found in MQM, they can be added into the metrics file simply by adding an
      {" "}
      <code>&lt;issue&gt;</code>
      {" "}
      element into the XML file at the appropriate location. Custom issues will be displayed using the value of the
      {" "}
      <code>type</code>
      {" "}
      attribute and will not have any hover help information (except for a listing of their parent issues), but can otherwise be used as normal.
    </p>
    <h4>Specifications file</h4>
    <p>
      The use of a specifications file is strongly recommended, but not required. Specifications files are stored in .sts (structured specification set) files. These XML files enumerate the values required by
      {" "}
      <a href="http://www.astm.org/Standards/F2575.htm">ASTM F2575:14</a>
      {" "}
      (see
      {" "}
      <a href="http://www.ttt.org/specs" target="_blank" rel="noreferrer">http://www.ttt.org/specs</a>
      {" "}
      for more details). A sample STS file is presented below:
    </p>
    <pre>
      {
                `
<?xml version="1.0" encoding="UTF-8"?>
<sts id="Legal_documents">
    <section name="A.1. Source-content information">
        <parameter number="1" name="Source language
        characteristics">
            <subparameter xml:id="sourceLanguage" number="1a"
            name="Source Language" status="accepted" importance="high">
            <value>en-GB</value>
            </subparameter>
            <subparameter xml:id="textType" number="1b" name="Text
            Type" status="accepted" importance="normal">
            <value>Legal text</value><!-- be more
                specific when possible, e.g., "contract" -->
            </subparameter>
            <subparameter xml:id="sourceAudience" number="1c"
            name="Source Audience" status="accepted" importance="normal">
            <value>Lawyers</value>
            <value>judicial bodies</value>
            </subparameter>
            <subparameter xml:id="sourcePurpose" number="1d"
            name="Source purpose" status="accepted" importance="normal">
            <value>Define legal relationships between
                parties.</value>
            <value>Convey legal decisions, precedents, and
                similar information.</value>
            </subparameter>
        </parameter>
        <parameter number="2" name="Specialized language">
            <subparameter xml:id="subjectField" number="2a"
            name="Subject field" status="accepted" importance="high">
            <value>Law</value>
            </subparameter>
            <subparameter xml:id="sourceTerminology" number="2b"
            name="Terminology" status="accepted" importance="normal">
            <value>Legal terminology</value>
            </subparameter>
        </parameter>
        <parameter number="3" name="Volume">
            <subparameter xml:id="volume" number="3" name="Volume"
            status="accepted" importance="normal">
            <value>2000 words</value>
            </subparameter>
        </parameter>
        <parameter number="4" name="Complexity">
            <subparameter xml:id="complexity" number="4"
            name="Complexity" status="accepted" importance="normal">
            <value>Often very complex with unclear and wordy
                sources</value>
            </subparameter>
        </parameter>
        <parameter number="5" name="Origin">
            <subparameter xml:id="origin" number="5a" name="Origin"
            status="accepted" importance="normal">
            <value>Legal teams</value>
            </subparameter>
            <subparameter xml:id="isTranslation" number="5b" name="Is
            the text a translation?" status="accepted"
            importance="normal">
            <value>Generally no. Authors may not be native
                speakers of the source language.</value>
            </subparameter>
        </parameter>
    </section>
    <section name="A.2. Target-content requirements">
        <parameter number="6" name="Target language
        requirements">
            <subparameter xml:id="targetLanguage" number="6a"
            name="Target language" status="accepted" importance="normal">
            <value>fr</value>
            </subparameter>
            <subparameter xml:id="targetTerminology" number="6b"
            name="Target terminology" status="accepted" importance="normal">
            <value>Use termbase for approved
                translations</value>
            <value>Use other locale-appropriate legal
                terminology</value>
            </subparameter>
        </parameter>
        <parameter number="7" name="Target audience">
            <subparameter xml:id="targetAudience" number="7"
            name="Target audience" status="accepted" importance="normal">
            <value>Same as source</value>
            </subparameter>
        </parameter>
        <parameter number="8" name="Target purpose">
            <subparameter xml:id="targetPurpose" number="8"
            name="Target purpose" status="accepted" importance="normal">
            <value>Same as source</value>
            </subparameter>
        </parameter>
        <parameter number="9" name="Content correspondence">
            <subparameter xml:id="contentCorrespondence" number="9"
            name="Content correspondence" status="accepted"
            importance="important">
            <value>Covert: document should appear as though
                written in target language.</value>
            <note>IMPORTANT: It is highly likely that
                additional adaptation will be required after translation
                upon review by the client. Such changes may lead the target
                text to deviate from the source in some details. Requester
                shall not be responsible for such changes, and such changes shall
                not be considered evidence of errors unless they reflect errors
                that would be errors per the specifications (i.e., changes to
                adapt to client-specific legal concerns are not to be considered
                errors).</note>
            </subparameter>
        </parameter>
        <parameter number="10" name="Register">
            <subparameter xml:id="register" number="10"
            name="Register" status="accepted" importance="normal">
            <value>Formal. Match source</value>
            </subparameter>
        </parameter>
        <parameter number="11" name="File format">
            <subparameter xml:id="fileFormat" number="10a" name="File
            format" status="accepted" importance="normal">
            <value>Microsoft Word (.doc)</value>
            </subparameter>
            <subparameter xml:id="outputModality" number="10b"
            name="Output modality" status="accepted" importance="normal">
            <value>Print</value>
            </subparameter>
        </parameter>
        <parameter number="12" name="Style">
            <subparameter xml:id="styleGuide" number="12a"
            name="Style guide" status="accepted" importance="normal">
            <value>None provided: use locale-appropriate legal
                style</value>
            </subparameter>
            <subparameter xml:id="styleRelevance" number="12b"
            name="Style relevance" status="accepted" importance="normal">
            <value>High</value>
            <note>However, if style and accuracy conflict,
                accuracy is more important since precise nuance MUST be conveyed
                as in the source. If this requirement leads to sub-optimal style,
                that is acceptable.</note>
            </subparameter>
        </parameter>
        <parameter number="13" name="Layout">
            <subparameter xml:id="layout" number="13" name="Layout"
            status="accepted" importance="normal">
            <value>Follow source</value>
            </subparameter>
        </parameter>
    </section>
    <section name="B. Production tasks">
        <parameter number="14" name="Typical production tasks">
            <subparameter xml:id="preparation" number="14a"
            name="Preparation" status="accepted" importance="normal">
            <value>Read document and clarify any unclear
                portions prior to translation</value>
            </subparameter>
            <subparameter xml:id="initialTranslation" number="14b"
            name="Initial translation" status="accepted" importance="normal">
            <value>Human; Machine Translation is not
                acceptable</value>
            </subparameter>
            <subparameter xml:id="qualityAssurance" number="14c"
            name="In-process quality assurance" status="accepted"
            importance="normal">
            <value>In-house examination and
                revision.</value>
            </subparameter>
        </parameter>
        <parameter number="15" name="Additional tasks">
            <subparameter xml:id="additionalTasks" number="15"
            name="Additional tasks" status="accepted" importance="normal">
            <value>Legal review by clientâ€™s target locale legal
                team.</value>
            <note>Requester cannot provide cross-border legal
                consultation services and translations MUST be reviewed by
                client for suitability prior to use. Extensive changes may be
                required.</note>
            </subparameter>
        </parameter>
    </section>
    <section name="C. Environment">
        <parameter number="16" name="Technology">
            <subparameter xml:id="technology" number="16"
            name="Technology" status="accepted" importance="normal">
            <value>None specified. TM is desirable to promote
                internal consistency. In the case of translation of a new version
                of a previously translated text, TM use is mandatory.</value>
            </subparameter>
        </parameter>
        <parameter number="17" name="Reference materials">
            <subparameter xml:id="referenceMaterials" number="17"
            name="Reference materials" status="accepted" importance="normal">
            <value>If the translation must use language from
                specific relevant laws, these must be provided to the
                translators.</value>
            </subparameter>
        </parameter>
        <parameter number="18" name="Workplace requirements">
            <subparameter xml:id="workplaceRequirements" number="18"
            name="Workplace requirements" status="accepted"
            importance="normal">
            <value>None specified</value>
            </subparameter>
        </parameter>
    </section>
    <section name="D. Relationships">
        <parameter number="19" name="Permissions">
            <subparameter xml:id="copyright" number="19a"
            name="Copyright" status="accepted" importance="normal">
            <value>Creator retains all rights</value>
            </subparameter>
            <subparameter xml:id="recognition" number="19b"
            name="Recognition" status="undetermined" importance="normal">
                <value>None</value>
            </subparameter>
            <subparameter xml:id="restrictions" number="19c"
            name="Restrictions" status="accepted" importance="normal">
            <value>Strict confidentiality, possibly with legal
                penalties for violation.</value>
            </subparameter>
        </parameter>
        <parameter number="20" name="Submissions">
            <subparameter xml:id="qualifications" number="20a"
            name="Qualifications" status="undetermined" importance="normal">
                <value>Legal translation experience, verified
                through tests, previous work, or references.</value>
            </subparameter>
            <subparameter xml:id="deliverables" number="20b"
            name="Deliverables" status="undetermined" importance="normal">
            <value>Translated version of file and any TMs or
                termbases generated</value>
            </subparameter>
            <subparameter xml:id="delivery" number="20c"
            name="Delivery" status="undetermined" importance="normal">
            <value>Defined in contract</value>
            </subparameter>
            <subparameter xml:id="deadline" number="20d"
            name="Deadline" status="undetermined" importance="normal">
                <value>Defined in contract</value>
            </subparameter>
        </parameter>
        <parameter number="21" name="Expectations">
            <subparameter xml:id="compensation" number="21a"
            name="Compensation" status="undetermined" importance="normal">
            <value>Defined in contract</value>
            </subparameter>
            <subparameter xml:id="communication" number="21b"
            name="Communication" status="undetermined" importance="normal">
            <value>Project manager as defined in
                contract</value>
            </subparameter>
        </parameter>
    </section>
</sts>
                `
            }
    </pre>
    <h4>Creating the project</h4>
    <p>With the files listed above in hand, click on &quot;Create project&quot;. You will then have the option to select the files and provide a project name. Click on &quot;Submit&quot; to create the project. If any import errors occur you will be notified so you can fix them. If any custom issue types are generated, you will be alerted.</p>
    <h4>Assigning users</h4>
    <p>By default the project is assigned to the user who created it. If you wish to assign another user, you need to know the user name. You can enter the user name to assign the project to that user. (The option to assign users only appears for projects that have already been created.</p>
  </div>
);

export const scorecardInterface = (
  <div>
    <p>The heart of the Scorecard is the editor (under the &quot;Scorecard&quot; tab). In the editor you can scroll to any segment (or use the up and down arrows on either side of the text viewer to move to a new active segment). The Scorecard remembers the last segment edited (by any user) and will automatically open at that point. You can jump to any segment number using the Navigation pane. The current segment has a red border and the segment number is highlighted. Only the active segment can be edited in any fashion. You add issues by clicking on one of the issue buttons below the translation viewer. When you move your mouse over a button you will see an image like the following:</p>
    <div className="accordion__image-container">
      <img className="accordion__image1" src={`${process.env.PUBLIC_URL}/images/tutorial/img1.png`} />
    </div>
    <p>The colored buttons on the left side are used to mark issues in the source segment. Those on the right mark issues in the target segment. The yellow buttons add minor issues, the orange add major issues, and the red add critical issues. Hovering over any button will bring up a hover help that explains its action. In addition, hovering over the center of any issue button will bring up its MQM definition, as shown below:</p>
    <div className="accordion__image-container">
      <img className="accordion__image2" src={`${process.env.PUBLIC_URL}/images/tutorial/img2.png`} />
    </div>
    <p>Each time you select an issue it will be added to the current segment as a &quot;lozenge&quot;-style button:</p>
    <div className="accordion__image-container">
      <img className="accordion__image3" src={`${process.env.PUBLIC_URL}/images/tutorial/img3.png`} />
    </div>
    <p>To remove an issue, click on the red &quot;[x]&quot; in the upper right corner.</p>

    <h4>Adding notes</h4>
    <p>You can add notes to a segment in the Notes field. Notes are not automatically saved when you leave a segment. Therefore you need to click &quot;Save note&quot; after making changes. Notes should be added to explain all major and critical issues and can also be used to record queries, make suggestions, or note potential problems.</p>

    <h4>Highlighting text</h4>
    <p>The highlighter feature allows you to mark text in the current segment (source or target). When used in combination with the Notes feature, it enables you to pinpoint the location of particular problems or draw attention to specific text. To enable highlighting for a segment, click on the highligher icon. When it is active, it will be yellow.</p>
    <div className="accordion__image-container">
      <img className="accordion__image4" src={`${process.env.PUBLIC_URL}/images/tutorial/img4.png`} />
    </div>
    <p>When the highlighter is active, any text you select in the source or target segment will be &quot;painted&quot; yellow. To remove highlights from a segment, click on the cancel highlighter icon. Note that the cancel highlighter icon is active only on the side (source or target) on which it is clicked. As a result you can clear highlighting on each side separately without impacting the other side.</p>
    <div className="accordion__image-container">
      <img className="accordion__image5" src={`${process.env.PUBLIC_URL}/images/tutorial/img5.png`} />
    </div>
    <h4>Filtering</h4>
    <p>The Scorecard allows you to search for text or issues using the Filter feature. When a filter is active the number of segments shown will be displayed above the editor. To clear the current filter, click on &quot;Clear filter&quot;.</p>
    <h5>Quick filters</h5>
    <p>
      A
      {" "}
      <em>quick filter</em>
      {" "}
      is performed when you enter text in the Filter pane. Quick filters search only the source and target text:
    </p>
    <div className="accordion__image-container">
      <img className="accordion__image6" src={`${process.env.PUBLIC_URL}/images/tutorial/img6.png`} />
    </div>
    <h5>Advanced filters</h5>
    <p>An advanced filter lets you filter segments by issue type and combine text searches with search by issue type. Advanced filters are useful when you want to see all segments containing a particular issue type (e.g., if you want to see all Terminology issues). To set an advanced filter, click on &quot;Advanced&quot; in the Filter pane. You will be presented with a dialog similar to the following:</p>
    <div className="accordion__image-container">
      <img className="accordion__image7" src={`${process.env.PUBLIC_URL}/images/tutorial/img7.png`} />
    </div>
    <p>In this view selecting a combination of issues and/or text will show only segments containing ALL issues and text selected. Selecting &quot;Clear filter&quot; in the dialog will cancel the filter. Clicking &quot;Close&quot; will leave the current filter active. Clicking &quot;Clear filter&quot; above the editor will cancel any current advanced filter.</p>
  </div>
);

export const severityLevels = (
  <div>
    <p>The MQM Scorecard supports three issue severity levels. Choosing the proper severity is important. The three levels are are follows:</p>
    <ul>
      <li>
        <strong>minor</strong>
        . Minor issues are those that can be easily corrected by the end user without any loss of meaning, possibly without the user even noticing them. Minor issue
        {" "}
        <em>should</em>
        {" "}
        be fixed, but if they are not, they would not impact the usability of the translation and would cause no harm to the requester or user. Examples include spelling issues that do not lead to confusion or common grammatical issues. A 1-point penalty is given for each minor issue.
      </li>
      <li>
        <strong>major</strong>
        . Major issues are those that the end user cannot recover from.  Major issues MUST by fixed prior to delivery to the requester or end user. Major issues change meaning or create problems of understanding. However, they do not have to potential to cause harm to the end user, requester, or provider. Examples would include the following: using the wrong term for a peripheral in a service manual that does not impact brand usage but may cause confusion; a grammatical issue that makes it unclear who should perform a required action; accidental omission of an item in a list of options. A 10-point penalty is given for each major issue.
      </li>
      <li>
        <strong>critical</strong>
        . Critical issues are those that have the potential to cause harm (physical, legal, or economic) to the end user, requester, or provider. Critical issues MUST be fixed and a single critical issue results in automatic rejection of the project even if the overall score would not otherwise lead to rejection. Critical issues must be fixed by a third party because they call into question the competence of the entire translation.
        {" "}
        <span style={{ color: "red" }}>NOTE: For translations provided by competent professional translators, critical issues should occur very infrequently. If there is any question about whether an issue is critical or major, the translation provider should be given the benefit of the doubt and the issue classified as major.</span>
        {" "}
        A 100-point penalty is given for each critical issue. In the Scorecard assigning a critical issue brings up a dialog box that requires the reviewer to confirm that the issue should be considered critical.
      </li>
    </ul>
    <p>In practical terms, most issues will be major or minor, with critical issues occurring very infrequently. For any major or critical issues, please explain the issue in the Notes field. Without an explanation of the issue, it may be difficult for the provider to interpret the issue.</p>
  </div>
);

export const reportingScores = (
  <div>
    <p>As you note issues, the score at the top of the editor will update automatically. Three scores are presented:</p>
    <ul>
      <li>
        The
        {" "}
        <strong>source score</strong>
        {" "}
        provides a score only for those issues that are noted in the source. Users will frequently discover problems in the source and mark them, particularly if they result in problems in the target. This score can be useful when the requester provides feedback to the client because it allows the requester to document problems with the source that impact the target.
      </li>
      <li>
        The
        {" "}
        <strong>target score</strong>
        {" "}
        provides a score only for those issues that are noted in the target. It provides a view of the extent to which the translation meets specifications according to the current metric without consideration of source problems. This score corresponds to the scores commonly used by language service providers in internal assessments.
      </li>
      <li>
        The
        {" "}
        <strong>composite score</strong>
        {" "}
        is a score that counts target penalties against the translation, but adds source penalties to the score. It is useful in cases where the translator has had to deal with significant source problems and you want a &quot;fair&quot; score that reflects this difficulty. In some cases a translation might fail to meet expectations in the target score, but the composite score would provide a more fair assessment of the translation.
      </li>
    </ul>
    <p>
      If you need more detail on the issues found, the
      {" "}
      <strong>Reports</strong>
      {" "}
      tab provides an overview report of the types of issues found in both source and target and their severity. It does not provide a score because the scores are always available at the top of the editor, but is useful for cases where you want to understand what kinds of problems occurred in a translation.
    </p>
  </div>
);
