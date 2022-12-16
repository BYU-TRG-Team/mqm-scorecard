const nodemailer = require('nodemailer');
const sendGridNodemailerTransport = require('nodemailer-sendgrid-transport')
const constants = require("../constants")
const winston = require('winston');

const {
  combine, errors, colorize, timestamp, prettyPrint,
} = winston.format;
const smtpConfig = require('../config/smtp.config');

// SMTP Transporter

const transporter = function () {
  switch (smtpConfig.provider.toLowerCase()) {
    case constants.EmailProviders.Zoho:
      return nodemailer.createTransport({
        service: smtpConfig.provider,
        secure: true,
        auth: {
          user: smtpConfig.email,
          pass: smtpConfig.password,
        },
      });

    case constants.EmailProviders.SendGrid:
      return nodemailer.createTransport(sendGridNodemailerTransport({
        auth: {
          api_key: smtpConfig.apiKey
        },
      }))

    default:
      throw new Error("Email provider unknown")
  }
} ()

// Logger

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: combine(
    errors({ stack: true }), // <-- use errors format
    colorize(),
    timestamp(),
    prettyPrint(),
  ),
});

const db = require('../db');

// Support

const FileParser = require('../support/fileparser.support');

const fileParser = new FileParser();

const TokenHandler = require('../support/tokenhandler.support');

const tokenHandler = new TokenHandler();

const IssueParser = require('../support/issueparser.support');

const issueParser = new IssueParser();

// Services

const RoleService = require('../services/role.service');

const roleService = new RoleService(db);

const SmtpService = require('../services/smtp.service');

const smtpService = new SmtpService(transporter);

const TokenService = require('../services/token.service');

const tokenService = new TokenService(db);

const UserService = require('../services/user.service');

const userService = new UserService(db);

const IssueService = require('../services/issue.service');

const issueService = new IssueService(db);

const ProjectService = require('../services/project.service');

const projectService = new ProjectService(db);

const SegmentService = require('../services/segment.service');

const segmentService = new SegmentService(db);

// Controllers

const AuthController = require('../controllers/auth.controller');

const authController = new AuthController(smtpService, userService, tokenService, roleService, tokenHandler, db, logger);

const UserController = require('../controllers/user.controller');

const userController = new UserController(userService, roleService, tokenHandler, logger);

const ProjectController = require('../controllers/project.controller');

const projectController = new ProjectController(db, userService, roleService, fileParser, projectService, issueService, segmentService, issueParser, logger);

const SegmentController = require('../controllers/segment.controller');

const segmentController = new SegmentController(segmentService, projectService, issueService, logger);

const IssueController = require('../controllers/issue.controller');

const issueController = new IssueController(issueService, projectService, db, fileParser, issueParser, logger);

module.exports = {
  AuthController: authController,
  UserController: userController,
  ProjectController: projectController,
  SegmentController: segmentController,
  IssueController: issueController,
  logger,
};
