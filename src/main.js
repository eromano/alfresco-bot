var AlfrescoBot = require('./AlfrescoBot');
var nconf = require('nconf');

nconf.add('config', {type: 'file', file: './configBot.json'});

try {
  var tokenSlack = process.env.TOKEN_SLACK || nconf.get('tokenslack');
  var alfrescoShareIp = process.env.TOKEN_SLACK || nconf.get('alfrescoShareIp');

  this.alfrescoBot = new AlfrescoBot(tokenSlack, alfrescoShareIp);
  this.alfrescoBot.run();
} catch (error) {
  console.log('Bot failed' + error);
}
