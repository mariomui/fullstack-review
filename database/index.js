const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/repos')
  .then(function () {
    console.log('mongoose connection has fired');
  });


const repoSchema = new mongoose.Schema({
  // TODO: your schema here!
  git_id: {
    type: String,
    required: true,
  },
  owner_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  git_url: {
    type: String,
    required: true,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'users',
  // },
  pushed_at: {
    type: Date,
  },
});
// const userSchema = new mongoose.Schema({
//   user_name: {
//     type: String,
//     required: true,
//   },
// });

const Repo = mongoose.model('repos', repoSchema);
// const User = mongoose.model('users', userSchema);

const syncUserRepos = (repos) => {
  var promiseArr = [];

  for (var i = 0; i < repos.length; i++) {
    const currRepo = repos[i];
    var promiser = new Promise((resolve, reject) => {
      Repo.findOne({ git_id: currRepo.git_id }, function (err, data) {
        if (!data) {
          Repo.create(currRepo, function (error, doc) {
            resolve(doc);
          });
        } else {
          resolve(data);
        }
      });
    });
    promiseArr.push(promiser);
  }
  return Promise.all(promiseArr).then((arr) => {
    return arr;
  });
};

const findUserRepos = (query) => {
  return Repo.find(query)
    .limit(25)
    .exec();
};

module.exports = { syncUserRepos, findUserRepos };
