/* eslint-disable no-undef */
const IssueController = require('../../issue.controller');
const FileParser = require('../../../support/fileparser.support');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const db = require('../../__mocks__/db');
const projectService = require('../../__mocks__/projectService');
const issueService = require('../../__mocks__/issueService');
const typologyFile = require('../../__mocks__/typologyFile');

const validTypologyFileParsed = [
  {
    id: 'terminology',
    name: 'Terminology',
    description:
 'A term (domain-specific word) is translated with a term other than the one expected for the domain or otherwise specified.',
    examples:
 'A term (domain-specific word) is translated with a term other than the one expected for the domain or otherwise specified.',
    notes:
 '\n      All errors specifically related to use of domain- or organization-specific terminology are included in this error and its children.\n      Do not use this error if a text is simply mistranslated, i.e., if the translation would be a valid translation of the source but simply does not use the particular mandated terminology. For example, if a text translates [river] bank into Spanish as banco (a financial institution) instead of orilla (a river bank), this would be a mistranslation because banco would never be a valid term for the concept of a river bank. However, if a termbase specified that orilla should be used and the translation uses ribera instead, this would be a Terminology error because ribera is a valid term for the concept, but not the specified one.\n    ',
    parent: null,
  },
  {
    id: 'termbase',
    name: 'inconsistent with terminology resource',
    description:
 'A term is used inconsistently with a specified terminology resource.',
    examples:
 'A term is used inconsistently with a specified terminology resource.',
    notes:
 'For obvious reasons, this error type applies only in cases where a term is specified in a termbase that was specified for use. If general domain conventions for terminology are violated instead, then domain-terminology should be used instead, if it is included in a metric.',
    parent: 'terminology',
  },
  {
    id: 'terminology-company',
    name: 'organization terminology',
    description:
 'The text violates company/organization-specific terminology guidelines as specified in a terminology resource.',
    examples:
 'The text violates company/organization-specific terminology guidelines as specified in a terminology resource.',
    notes:
 'Should be used when it is necessary to distinguish company-specific terminology errors from more general termbase errors.',
    parent: 'termbase',
  },
  {
    id: 'terminology-third-party',
    name: 'third-party terminology',
    description:
 'The text violates terminology guidelines as specified in a terminology resource from a third-party.',
    examples:
 'The text violates terminology guidelines as specified in a terminology resource from a third-party.',
    notes:
 'Should be used only when it is necessary to distinguish terminology errors related to third-party termbases from more general termbase errors.',
    parent: 'termbase',
  },
  {
    id: 'term-inconsistency',
    name: 'inconsistent use of terminology',
    description: 'A single concept is expressed with multiple terms.',
    examples: 'A single concept is expressed with multiple terms.',
    notes:
 'This error is used only to address inconsistent use of terminology in the target text. In cases where terminology is incorrect for the domain or termbase, wrong term or termbase should be used instead. If the inconsistent term use can be traced back to inconsist term use in the source text, the error type stays the same, but this special case should be annotated with an inconsistent source term root cause.',
    parent: 'terminology',
  },
  {
    id: 'multiple-terms-for-concept',
    name: 'multiple terms in source',
    description:
 'A single concept in the source text is expressed with multiple terms for the same concept.',
    examples:
 'A single concept in the source text is expressed with multiple terms for the same concept.',
    notes:
 'Do not use this error for cases where a single source term is translated in multiple ways in the target language content.',
    parent: 'term-inconsistency',
  },
  {
    id: 'multiple-translations-of-term',
    name: 'multiple terms in translation',
    description:
 'A single source term is translated in multiple inconsistent ways.',
    examples:
 'A single source term is translated in multiple inconsistent ways.',
    notes:
 'Applies to target text only since it refers to cases where one term has multiple translations. As with term-inconsistency, termbase or one of its children should be used instead if a termbase contains a specified term for a concept and the text does not use that particular term.',
    parent: 'term-inconsistency',
  },
  {
    id: 'wrong-term',
    name: 'wrong term',
    description:
 'term that is incorrect because it is not the term a domain expert would use or because it gives rise to a conceptual mismatch',
    examples:
 'term that is incorrect because it is not the term a domain expert would use or because it gives rise to a conceptual mismatch',
    notes:
 'Note 1: The impact of wrong term errors, and thus the severity level, ranges from neutral to critical, depending on context and specifications and on how important the conceptual mismatch is.\n\n        Note 2: Implementers can choose to treat mistranslated terms under Accuracy. However, they then lose traceability as to which mistranslation errors refer to terminology, making it less efficient for terminology management purposes. (Similarly, inconsistent use of terminology is not considered an inconsistent style, and inconsistent use of terms is not an organizational style).\n      ',
    parent: 'terminology',
  },
  {
    id: 'accuracy',
    name: 'Accuracy',
    description:
 'The target text does not accurately reflect the source text, allowing for any differences authorized by specifications.',
    examples:
 'The target text does not accurately reflect the source text, allowing for any differences authorized by specifications.',
    notes:
 '\n      Most cases of accuracy are addressed by one of the children subtypes listed above.\n      In Machine Translation literature, this category is typically referred to as “Adequacy”.\n    ',
    parent: null,
  },
  {
    id: 'mistranslation',
    name: 'mistranslation',
    description:
 'The target content does not accurately represent the source content.',
    examples:
 'The target content does not accurately represent the source content.',
    notes: '',
    parent: 'accuracy',
  },
  {
    id: 'technical-relationship',
    name: 'mistranslation of technical relationship',
    description:
 'Content describing the relationship(s) within a technical description is translated inaccurately with respect to technical knowledge (even if the translation otherwise appears plausible).',
    examples:
 'Content describing the relationship(s) within a technical description is translated inaccurately with respect to technical knowledge (even if the translation otherwise appears plausible).',
    notes:
 '\n          This error is not used for incorrect use of individual terms, which would be classified in terminology or one of its children. Rather, it is used for cases where a translation might appear to be correct but where it ends up misconveying information about a technical subject.\n          Instances of this error may point to confusing source materials or to lack of translator experience in a specialized domain.\n        ',
    parent: 'mistranslation',
  },
  {
    id: 'ambiguous-translation',
    name: 'ambiguous translation',
    description: 'An unambiguous source text is translated ambiguously.',
    examples: 'An unambiguous source text is translated ambiguously.',
    notes:
 'This error is distinct from ambiguity in that it is limited to errors where the translation process has introduced the ambiguity.',
    parent: 'mistranslation',
  },
  {
    id: 'false-friend',
    name: 'false friend',
    description:
 'The translation has incorrectly used a word that is superficially similar to the source word.',
    examples:
 'The translation has incorrectly used a word that is superficially similar to the source word.',
    notes: '',
    parent: 'mistranslation',
  },
  {
    id: 'unit-conversion',
    name: 'unit conversion',
    description:
 'The target text has not converted numeric values as needed to adjust for different units (e.g., currencies, metric vs. U.S. measurement systems).',
    examples:
 'The target text has not converted numeric values as needed to adjust for different units (e.g., currencies, metric vs. U.S. measurement systems).',
    notes: '',
    parent: 'mistranslation',
  },
  {
    id: 'number',
    name: 'number',
    description: 'Numbers are inconsistent between source and target.',
    examples: 'Numbers are inconsistent between source and target.',
    notes: '',
    parent: 'mistranslation',
  },
  {
    id: 'date-time',
    name: 'date/time',
    description: 'Dates or times do not match between source and target.',
    examples: 'Dates or times do not match between source and target.',
    notes: '',
    parent: 'mistranslation',
  },
  {
    id: 'entity',
    name: 'entity',
    description: 'Names, places, or other named entities do not match.',
    examples: 'Names, places, or other named entities do not match.',
    notes: '',
    parent: 'mistranslation',
  },
  {
    id: 'overly-literal',
    name: 'overly literal',
    description: 'The translation is overly literal.',
    examples: 'The translation is overly literal.',
    notes: '',
    parent: 'mistranslation',
  },
  {
    id: 'over-translation',
    name: 'overtranslation',
    description: 'The target text is more specific than the source text.',
    examples: 'The target text is more specific than the source text.',
    notes:
 'In some cases differences in concept structure between languages may render an apparent over-translation necessary. In such cases this issue should not be considered an error, although the issue may be noted for further consideration.',
    parent: 'accuracy',
  },
  {
    id: 'under-translation',
    name: 'undertranslation',
    description: 'The target text is less specific than the source text.',
    examples: 'The target text is less specific than the source text.',
    notes:
 'In some cases, differences in concept structure between languages may render an apparent under-translation necessary. In such cases this issue should not be considered an error, although the issue may be noted for further consideration.',
    parent: 'accuracy',
  },
  {
    id: 'addition',
    name: 'addition',
    description: 'The target text includes text not present in the source.',
    examples: 'The target text includes text not present in the source.',
    notes: '',
    parent: 'accuracy',
  },
  {
    id: 'omission',
    name: 'omission',
    description:
 'Content is missing from the translation that is present in the source.',
    examples:
 'Content is missing from the translation that is present in the source.',
    notes: '',
    parent: 'accuracy',
  },
  {
    id: 'omitted-variable',
    name: 'omitted variable',
    description: 'A variable placeholder is omitted from a translated text.',
    examples: 'A variable placeholder is omitted from a translated text.',
    notes: '',
    parent: 'omission',
  },
  {
    id: 'no-translate',
    name: 'do not translate',
    description:
 'Text was translated that should have been left untranslated.',
    examples:
 'Text was translated that should have been left untranslated.',
    notes: '',
    parent: 'accuracy',
  },
  {
    id: 'untranslated',
    name: 'untranslated',
    description:
 'Content that should have been translated has been left untranslated.',
    examples:
 'Content that should have been translated has been left untranslated.',
    notes: '',
    parent: 'accuracy',
  },
  {
    id: 'untranslated-graphic',
    name: 'untranslated graphic',
    description: 'Text in a graphic was left untranslated.',
    examples: 'Text in a graphic was left untranslated.',
    notes: '',
    parent: 'untranslated',
  },
  {
    id: 'fluency',
    name: 'Linguistic Conventions',
    description:
 'Errors related to the form or content of a text, irrespective of whether it is a translation or not',
    examples:
 'Errors related to the form or content of a text, irrespective of whether it is a translation or not',
    notes:
 'If an error can be detected only by comparing the source and target, it MUST NOT be categorized as fluency or any of its children.',
    parent: null,
  },
  {
    id: 'grammar',
    name: 'grammar',
    description:
 'Errors related to the grammar or syntax of the text, other than spelling and orthography',
    examples:
 'Errors related to the grammar or syntax of the text, other than spelling and orthography',
    notes: '',
    parent: 'fluency',
  },
  {
    id: 'word-form',
    name: 'word form',
    description: 'There is a problem in the form of a word.',
    examples: 'There is a problem in the form of a word.',
    notes: '',
    parent: 'grammar',
  },
  {
    id: 'part-of-speech',
    name: 'part of speech',
    description: 'A word is the wrong part of speech.',
    examples: 'A word is the wrong part of speech.',
    notes: '',
    parent: 'word-form',
  },
  {
    id: 'tense-mood-aspect',
    name: 'tense/mood/aspect',
    description: 'A verbal form displays the wrong tense, mood, or aspect.',
    examples: 'A verbal form displays the wrong tense, mood, or aspect.',
    notes: '',
    parent: 'word-form',
  },
  {
    id: 'agreement',
    name: 'agreement',
    description:
 'Two or more words do not agree with respect to case, number, person, or other grammatical features.',
    examples:
 'Two or more words do not agree with respect to case, number, person, or other grammatical features.',
    notes: '',
    parent: 'word-form',
  },
  {
    id: 'word-order',
    name: 'word order',
    description: 'The word order is incorrect.',
    examples: 'The word order is incorrect.',
    notes: '',
    parent: 'grammar',
  },
  {
    id: 'function-words',
    name: 'function words',
    description:
 'A function word (e.g., a preposition, “helping verb”, article, determiner) is used incorrectly.',
    examples:
 'A function word (e.g., a preposition, “helping verb”, article, determiner) is used incorrectly.',
    notes: '',
    parent: 'grammar',
  },
  {
    id: 'typography',
    name: 'typography',
    description:
 'Errors related to the mechanical presentation of text. This category should be used for any typographical errors other than spelling.',
    examples:
 'Errors related to the mechanical presentation of text. This category should be used for any typographical errors other than spelling.',
    notes: 'Do not use for errors related to spelling.',
    parent: 'fluency',
  },
  {
    id: 'punctuation',
    name: 'punctuation',
    description: 'Punctuation is used incorrectly (for the locale or style).',
    examples: 'Punctuation is used incorrectly (for the locale or style).',
    notes:
 'In most cases it is not necessary to distinguish this error type from typography.',
    parent: 'typography',
  },
  {
    id: 'unpaired-marks',
    name: 'unpaired quote marks or brackets',
    description:
 'One of a pair of quote marks or brackets—e.g., (, ), [, ], {, or } character—is missing from text.',
    examples:
 'One of a pair of quote marks or brackets—e.g., (, ), [, ], {, or } character—is missing from text.',
    notes: '',
    parent: 'typography',
  },
  {
    id: 'whitespace',
    name: 'whitespace',
    description: 'Whitespace is used incorrectly.',
    examples: 'Whitespace is used incorrectly.',
    notes: '',
    parent: 'typography',
  },
  {
    id: 'orthography',
    name: 'orthography',
    description:
 'Errors related to spelling and other aspects of the way that words are written',
    examples:
 'Errors related to spelling and other aspects of the way that words are written',
    notes: '',
    parent: 'fluency',
  },
  {
    id: 'spelling',
    name: 'spelling',
    description: 'Errors related to spelling of words',
    examples: 'Errors related to spelling of words',
    notes: '',
    parent: 'orthography',
  },
  {
    id: 'diacritics',
    name: 'diacritics',
    description: 'Errors related to the use of diacritics',
    examples: 'Errors related to the use of diacritics',
    notes: '',
    parent: 'orthography',
  },
  {
    id: 'transliteration',
    name: 'transliteration',
    description:
 'A word or phrase is translitered into the script of the target language using the wrong transliteration system or using the preferred transliteration system but applying it incorrectly.',
    examples:
 'A word or phrase is translitered into the script of the target language using the wrong transliteration system or using the preferred transliteration system but applying it incorrectly.',
    notes:
 'If transliteration is standardized for a language pair (mainly for place names, also possibly for important person names), annotate it as a transliteration error, but manage it like an official terminology standard or a usage guide style glossary.',
    parent: 'orthography',
  },
  {
    id: 'capitalization',
    name: 'capitalization',
    description:
 'One or more letters in a word are written with nonstandard upper- and lowercase letter forms, considering the textual setting and applicable locale conventions.',
    examples:
 'One or more letters in a word are written with nonstandard upper- and lowercase letter forms, considering the textual setting and applicable locale conventions.',
    notes: ' ',
    parent: 'orthography',
  },
  {
    id: 'compounding',
    name: 'compounding',
    description:
 'Errors related to the correct usage of open, hyphenated, and closed compounds, affixes, and clitics',
    examples:
 'Errors related to the correct usage of open, hyphenated, and closed compounds, affixes, and clitics',
    notes:
 '\n          Compounding, by definition, involves the presence or absence of spaces or hyphens in the compound forms. That does not make them whitespace or punctuation errors when they occur in well-defined compounding cases.\n          Need to discuss implications of morphologically based compounding systems in Germanic or Slavic languages.\n          Should we add examples from incorrect forms of German or Arabic compounds or incorrect clitic compounding in Spanish or French.',
    parent: 'orthography',
  },
  {
    id: 'title-style',
    name: 'title style',
    description:
 'There are many sorts of titles: document titles, section headings, captions; titles of creative works; personal names and titles; names of organizations and departments, names of products and services, including trademarks and service marks; names of geographical features; names of geopolitical subdivisions; and names of human artifacts. All of these are subject to rules governing the way they should be styled, involving the application of capitalization; italics (and non-English italic equivalents of letterspacing and emphasis dots); underlining; bolding; surrounding punctuation marks; and the capitalization of leading definite articles and trailing classifier nouns.',
    examples:
 'There are many sorts of titles: document titles, section headings, captions; titles of creative works; personal names and titles; names of organizations and departments, names of products and services, including trademarks and service marks; names of geographical features; names of geopolitical subdivisions; and names of human artifacts. All of these are subject to rules governing the way they should be styled, involving the application of capitalization; italics (and non-English italic equivalents of letterspacing and emphasis dots); underlining; bolding; surrounding punctuation marks; and the capitalization of leading definite articles and trailing classifier nouns.',
    notes:
 '\n          Title style entails issues that are central to other error types, principally, capitalization and punctuation. When these issues are present in the context of styling a title, the error type should be annotated as title style.\n          The coverage of title style can be extended to other formal text elements, such as ordered and unordered lists, legends, and callouts, and fixed expressios, such as slogans and foreign phrases, without violating the spirit of this error type.\n        ',
    parent: 'orthography',
  },
  {
    id: 'corpus-conformance',
    name: 'corpus conformance',
    description:
 'The content is deemed to have a level of conformance to a reference corpus. The nonconformance type reflects the degree to which the text conforms to a reference corpus given an algorithm that combines several classes of error type to produce an aggregate rating.',
    examples:
 'The content is deemed to have a level of conformance to a reference corpus. The nonconformance type reflects the degree to which the text conforms to a reference corpus given an algorithm that combines several classes of error type to produce an aggregate rating.',
    notes:
 'One example of this error type might involve output from a quality estimation system that delivers a warning that a text has a very low quality estimation score.',
    parent: 'fluency',
  },
  {
    id: 'pattern-problem',
    name: 'pattern problem',
    description:
 'The text contains a pattern (e.g., text that matches a regular expression) that is not allowed.',
    examples:
 'The text contains a pattern (e.g., text that matches a regular expression) that is not allowed.',
    notes: '',
    parent: 'fluency',
  },
  {
    id: 'duplication',
    name: 'duplication',
    description:
 'Content has been duplicated (e.g., a word or longer portion of text is repeated unintentionally).',
    examples:
 'Content has been duplicated (e.g., a word or longer portion of text is repeated unintentionally).',
    notes: '',
    parent: 'fluency',
  },
];

describe('tests updateTypology method', () => {
  it('should throw a 400 error for an invalid body', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService();
    const fileParser = new FileParser();
    const pgClient = db();

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ message: 'Body must include a typology file' });
  });

  it('should throw a 400 error due to project existence', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [{}] }) });
    const fileParser = new FileParser();
    const pgClient = db();

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: '',
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ message: 'All projects must be deleted before importing a new typology' });
  });

  it('should throw a 400 error due to invalid file (no typology element)', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [] }) });
    const fileParser = new FileParser();
    const pgClient = db();
    const mockedTypologyFile = typologyFile('typology');

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: mockedTypologyFile,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ message: 'Problem parsing typology file: No typology element found' });
  });

  it('should throw a 400 error due to invalid file (empty file)', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [] }) });
    const fileParser = new FileParser();
    const pgClient = db();
    const mockedTypologyFile = typologyFile('empty');

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: mockedTypologyFile,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ message: 'Problem parsing typology file: No typology element found' });
  });

  it('should throw a 400 error due to invalid file (no name attribute on errorType)', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [] }) });
    const fileParser = new FileParser();
    const pgClient = db();
    const mockedTypologyFile = typologyFile('name');

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: mockedTypologyFile,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading typology file: error type must have a name attribute' });
  });

  it('should throw a 400 error due to invalid file (no id attribute on errorType)', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [] }) });
    const fileParser = new FileParser();
    const pgClient = db();
    const mockedTypologyFile = typologyFile('id');

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: mockedTypologyFile,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ message: 'Error reading typology file: error type must have an id attribute' });
  });

  it('should successfully parse typology file and start/end transaction that creates each error', async () => {
    const mockedIssueService = issueService();
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [] }) });
    const fileParser = new FileParser();
    const pgClient = db();
    const mockedTypologyFile = typologyFile();

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: mockedTypologyFile,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(pgClient.query).toHaveBeenCalledTimes(2);
    expect(pgClient.query.mock.calls[0][0]).toBe('BEGIN');
    expect(pgClient.query.mock.calls[1][0]).toBe('COMMIT');

    expect(res.status).toHaveBeenCalledTimes(0);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'The following error types have been created: Terminology, inconsistent with terminology resource, organization terminology, third-party terminology, inconsistent use of terminology, multiple terms in source, multiple terms in translation, wrong term, Accuracy, mistranslation, mistranslation of technical relationship, ambiguous translation, false friend, unit conversion, number, date/time, entity, overly literal, overtranslation, undertranslation, addition, omission, omitted variable, do not translate, untranslated, untranslated graphic, Linguistic Conventions, grammar, word form, part of speech, tense/mood/aspect, agreement, word order, function words, typography, punctuation, unpaired quote marks or brackets, whitespace, orthography, spelling, diacritics, transliteration, capitalization, compounding, title style, corpus conformance, pattern problem, duplication' });

    expect(mockedIssueService.deleteIssues).toHaveBeenCalledTimes(1);

    expect(mockedIssueService.createIssue).toHaveBeenCalledTimes(validTypologyFileParsed.length);
    mockedIssueService.createIssue.mock.calls.forEach((mockCall) => {
      const mockedError = validTypologyFileParsed.filter((error) => error.id === mockCall[0])[0];

      expect(mockedError).not.toBe(undefined);
      expect(mockedError.id).toBe(mockCall[0]);
      expect(mockedError.parent).toBe(mockCall[1]);
      expect(mockedError.name).toBe(mockCall[2]);
      expect(mockedError.description).toBe(mockCall[3]);
      expect(mockedError.notes).toBe(mockCall[4]);
      expect(mockedError.examples).toBe(mockCall[5]);
      expect(mockCall[6]).not.toBe(undefined);
    });
  });

  it('should throw a 500 error and rollback the datbaase', async () => {
    const mockedIssueService = issueService({ createIssue: () => { throw Error; } });
    const mockedProjectService = projectService({ getAllProjects: () => ({ rows: [] }) });
    const fileParser = new FileParser();
    const pgClient = db();
    const mockedTypologyFile = typologyFile();

    const issueController = new IssueController(
      mockedIssueService,
      mockedProjectService,
      pgClient,
      fileParser,
    );

    const req = request({
      files: {
        typologyFile: mockedTypologyFile,
      },
    });

    const res = response();
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    await issueController.updateTypology(req, res);

    expect(pgClient.query).toHaveBeenCalledTimes(2);
    expect(pgClient.query.mock.calls[0][0]).toBe('BEGIN');
    expect(pgClient.query.mock.calls[1][0]).toBe('ROLLBACK');

    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
