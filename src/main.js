var AlfrescoBot = require('./AlfrescoBot');
var nconf = require('nconf');

nconf.add('config', {type: 'file', file: './configBot.json'});

  var tokenSlack = process.env.TOKEN_SLACK || nconf.get('tokenslack');
  var alfrescoShareIp = process.env.TOKEN_SLACK || nconf.get('alfrescoShareIp');

  this.alfrescoBot = new AlfrescoBot(tokenSlack, alfrescoShareIp);
  this.alfrescoBot.run();

