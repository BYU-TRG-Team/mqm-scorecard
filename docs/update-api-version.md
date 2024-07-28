# Update API version

The MQM Scorecard API is integrated into the MQM Scorecard source code via a Git submodule.

To update the API to a new version, the Git submodule will need to be checked out at the commit of the new version. 

# 1. Update .gitmodules with branch of new version

For the api submodule, update branch to match new version.

# 2. Locally update commit of submodule 
From repository root: 

```
git submodule update --remote --init
```

# 3. Push changes to remote

Commit the changed submodule commit and merge to remote main branch.