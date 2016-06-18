module.exports = githubClient;

var githubRequest = require('./ghRequest.js');

function githubClient(token) {
  var tokenPart = '';
  if (token) tokenPart = 'access_token=' + token + '&';
  var USERS = 'https://api.github.com/users?per_page=100&' + tokenPart + 'since=';
  var USER_DETAILS = 'https://api.github.com/users/';
  var SEARCH_USER_WITH_FOLLOWERS = 'https://api.github.com/search/users?' + tokenPart + 'per_page=100&sort=joined&order=asc&q=';

  return {
    getFollowers: getFollowers
  };

  function getFollowers(user) {
    if (typeof user !== 'string') throw new Error('User has to be identified by login');

    var followersArg = createRequestArgs(USER_DETAILS + user + '/followers?per_page=100&' + tokenPart);

    return githubRequest(followersArg, true)
            .then(combineFollowers)
            .catch(handleError);

    function handleError(reason) {
      if (reason.statusCode === 404) {
        console.warn('WARNING: User ' + user + ' is not found');
        return [];
      }
      throw reason;
    }
  }

  function combineFollowers(results) {
    var allFollowers = [];
    for (var i = 0; i < results.length; ++i) {
      var items = results[i];
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        allFollowers.push(item.login);
      }
    }
    return allFollowers;
  }
}

function createRequestArgs(uri) {
  return {
    uri: uri,
    resolveWithFullResponse: true,
    headers: {
      'User-Agent': 'anvaka/nanlayut'
    }
  };
}
