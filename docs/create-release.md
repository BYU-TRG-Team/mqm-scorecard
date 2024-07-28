# Create a release from the main branch

## 1. Create release commit

From your local, bump the package version with `npm version <action>`. This creates a new commit.

Bump the version in the footer of the React app. Apply this change to the newly created commit using `git commit --amend`.

This commit should now be merged to remote main branch.

## 2. Create a GitHub release

Create a new GitHub release, configured with a new tag `v<x>.<y>.<x>`. **Generate release notes** can be used. 

**Please note any updates to the database configuration.**

If merging from a branch, please delete the branch.

## 3. Deploy new version

### BYU TRG Scorecard instance

Unlike the BaseTerm repos, we do not automatically deploy to a Heroku dev environment when new changes are merged to main. This is due to the current support Heroku offers for git submodules: 

```
" Using submodules for builds on Heroku is only supported for builds triggered with Git pushes. 
Builds created with the API don't resolve submodules. 
The same is true for GitHub sync. "
```

The follow steps will need to be completed to upgrade the BYU TRG Scorecard Heroku instance.

#### Deploy new version to Heroku stack:

1. Checkout desired branch locally 
2. [Create a Git remote for Heroku](https://devcenter.heroku.com/articles/git#create-a-heroku-remote).
3. [Deploy the git repo to Heroku](https://devcenter.heroku.com/articles/git#deploy-your-code).


#### Apply new database migrations

To apply new database migrations, the following can be run from the repository root: 

```
# Retrieve the database url from Heroku
npm ci
DATABASE_URL=<url for the database> \
APP_ENV=production \
PGSSLMODE=no-verify \
npm --prefix api run migrate up
```

### New deployment

See the [Deploy Heroku stack guide](deploy-heroku-stack.md).






