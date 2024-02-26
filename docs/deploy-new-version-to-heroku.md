Unlike the BaseTerm repos, we do not automatically deploy to a Heroku dev environment when new changes are merged to main. This is due to the current support Heroku offers for git submodules: 

```
" Using submodules for builds on Heroku is only supported for builds triggered with Git pushes. 
Builds created with the API don't resolve submodules. 
The same is true for GitHub sync. "
```

To deploy to heroku:

1. Checkout desired branch locally 
2. [Create a Git remote for Heroku](https://devcenter.heroku.com/articles/git#create-a-heroku-remote).
3. [Deploy the git repo to Heroku](https://devcenter.heroku.com/articles/git#deploy-your-code).