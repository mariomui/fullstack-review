const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const path = require('path');


const app = express();

const getReposByUserName = require('../helpers/github.js').getReposByUsername;

const { syncUserRepos, findUserRepos } = require('../database');

const DEFAULT_ROUTE = path.join(__dirname, '../client/dist');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(DEFAULT_ROUTE));

app.get('/main.css', function (req, res) {
  res.send('./main.css');
});

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  console.log('body: ', JSON.stringify(req.body, null, 2));

  var { term } = req.body;

  getReposByUserName(term, (error, data) => {
    if (error) {
      console.log(error);
      throw error;
    }

    const repos = JSON.parse(data).map(repo => ({
      name: repo.full_name,
      owner_name: repo.owner.login,
      pushed_at: repo.pushed_at,
      git_id: repo.id,
      git_url: repo.html_url,
    }));


    syncUserRepos(repos)
      .then((result) => {
        res.send(result);
      })
      .catch(() => {
        res.send('error');
      });
  });
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
  //query database
  //and grab top repos
  //send it back.

  findUserRepos({ owner_name: req.query.term })
    .then((fulfilledData) => {
      console.log(fulfilledData);
      res.send(fulfilledData);
    });
});

app.listen(1128, function () {
  console.log('listening on port 1128');
});
