const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const path = require('path');

const app = express();

const getReposByUserName = require('../helpers/github.js').getReposByUsername;

const { save } = require('../database');

var defaultRoute = path.join(__dirname, '../client/dist');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(__dirname + '/../client/dist'));
app.use(express.static(defaultRoute));
app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  console.log(typeof req.body, 'what is reqbody afer json');
  var clientSearchTerm = req.body.term;
  getReposByUserName(clientSearchTerm, (error, data) => {
    //do the db.query but for whatever.
    if (error) {
      console.log(error);
      return;
    }
    // [{},{},{}]
    // console.dir(JSON.parse(data), 'this is my data');
    var curatedRepos = Array.from(JSON.parse(data)).map((repos) => {
      return (
        {
          repo_id: repos.id,
          repo_owner: repos.full_name,
          owner: {
            owner_id: repos.owner.id,
            owner_name: repos.owner.login,
          },
          pushed_at: repos.pushed_at,
          url: repos.html_url,
        }
      );
    });
    console.log(curatedRepos);

    // console.log(curatedRepos, 'test');
    // save(data, (err, saveReceipt) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log(saveReceipt);
    // });
  });

  res.send('hello');
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

const port = 1128;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
