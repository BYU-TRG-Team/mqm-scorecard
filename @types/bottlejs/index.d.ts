import { Logger } from "winston"
import { CleanEnv } from "../../server/clean-env"
import FileParser from "../../server/support/fileparser.support"
import IssueParser from "../../server/support/issueparser.support"
import TokenHandler from "../../server/support/tokenhandler.support"
import DBClientPool from "../../server/db-client-pool"
import SMTPService from "../../server/services/smtp.service"
import TokenService from "../../server/services/token.service"
import IssueService from "../../server/services/issue.service"
import UserService from "../../server/services/user.service"
import ProjectService from "../../server/services/project.service"
import SegmentService from "../../server/services/segment.service"
import AuthController from "../../server/controllers/auth.controller"
import UserController from "../../server/controllers/user.controller"
import ProjectController from "../../server/controllers/project.controller"
import SegmentController from "../../server/controllers/segment.controller"
import IssueController from "../../server/controllers/issue.controller"

declare module "bottlejs" {
  interface IContainer {
    CleanEnv: CleanEnv,
    FileParser: FileParser,
    TokenHandler: TokenHandler,
    IssueParser: IssueParser,
    Logger: Logger,
    DBClientPool: DBClientPool,
    SMTPService: SMTPService,
    TokenService: TokenService,
    UserService: UserService,
    IssueService: IssueService,
    ProjectService: ProjectService,
    SegmentService: SegmentService,
    AuthController: AuthController,
    UserController: UserController,
    ProjectController: ProjectController,
    SegmentController: SegmentController,
    IssueController: IssueController
  }
}