'use strict';

var Bot = require('slackbots');
var assert = require('assert');
var AlfrescoApi = require('./alfrescoApi');
var slackMessageAnalyzer = require('./slackMessageAnalyzer');
var _ = require('lodash');

class AlfrescoBot {

    /**
     * @param {String} slackToken Your Slack bot integration token (obtainable at https://my.slack.com/services/new/bot)
     * @param {String} alfrescoShareIp Your share server IP or DNS name
     */
    constructor(slackToken, alfrescoShareIp) {
      assert(slackToken, 'Slack Token is necessary obtain it at https://my.slack.com/services/new/bot and copy in configBot.json');
      assert(alfrescoShareIp, 'alfrescoShareIp is missing,  Your share server IP or DNS name is necessary add it in  configBot.json');

      var settingsBot = {
        token: slackToken,
        name: 'alfresco-bot'
      };

      this.bot = new Bot(settingsBot);

      this.alfrescoApi = new AlfrescoApi('admin', 'admin', alfrescoShareIp);
    }

    run() {
      this._startChannelMessageListener();
      this._listenerFolderRequest();
      this._listenerFolderRootRequest();
      this._listenerCommandListMessage();
      this._listenerMoveFolder();
    }

    /**
     * Post a message in any channel where the bot is present at Start
     */
    _startChannelMessageListener() {
      this.bot.on('start', (function () {
        var message = 'Hello I am alfresco-bot';
        var fallBack = 'alfresco-bot is here';
        var color = 'warning';
        var title = 'alfresco-bot greetings';
        var titleLink = 'Hello I am alfresco-bot';

        this.postSlackMessage(message, fallBack, color, null, title, titleLink, 'general');
      }).bind(this));
    }

    /**
     * Listener for request command list root
     */
    _listenerFolderRootRequest() {
      this._listenerMessage(this.isFileAndFolderRootMessage, () => {
        this.alfrescoApi.getFoldersFileRoot().then((result)=> {
          var nodes = _.map(result, 'entry');

          var message = '';
          nodes.forEach((node)=> {

            var name = node.name ? node.name : '';

            var nodeRef = '';
            var url = this.alfrescoApi.getContentUrl(nodeRef);

            message += '* ' + this._icon(node) + ' ' + slackMessageAnalyzer.createSlackMessageLink(name, url) + '\n';
          });

          var fallBack = 'List Folder and File';
          var color = 'warning';
          var title = 'List Folder and File';

          this.postSlackMessage(message, fallBack, color, null, title, '', 'general');
        }, this.handleErrorFolder);
      });
    }

    /**
     * Listener for request command dir
     */
    _listenerFolderRequest() {
      this._listenerMessage(this.isFileAndFolderMessage, (message) => {

        var folderName = slackMessageAnalyzer.getFolderNameInMessageFromText(message.text, 'dir') || slackMessageAnalyzer.getFolderNameInMessageFromText(message.text, 'ls');

        if (folderName) {
          this.alfrescoApi.getListByFolder(folderName).then((this.showFolder).bind(this), this.handleErrorFolder);
        } else {
          this.alfrescoApi.getCurrentFolder().then((this.showFolder).bind(this), this.handleErrorFolder);
        }

      });
    }

    _listenerMoveFolder() {
      this._listenerMessage(this.isMoveFodlerMessage, (message) => {
        var folderName = slackMessageAnalyzer.getFolderNameInMessageFromText(message.text, 'cd');
        this.alfrescoApi.moveFolder(folderName).then((this.showFolder).bind(this), this.handleErrorFolder);
      });
    }

    handleErrorFolder() {
      var fallBack = 'List Folder and File';
      var color = 'warning';
      var title = 'List Folder and File';

      this.postSlackMessage('Folder Not found', fallBack, color, null, title, '', 'general');
    }

    showFolder(folderEntries) {
      var nodes = _.map(folderEntries, 'entry');

      var message = '';
      nodes.forEach((node)=> {
        var name = node.name ? node.name : '';
        var nodeRef = '';
        var url = this.alfrescoApi.getContentUrl(nodeRef);
        message += '* ' + this._icon(node) + ' ' + slackMessageAnalyzer.createSlackMessageLink(name, url) + '\n';
      });

      if (nodes.length === 0) {
        message = 'The folder is empty';
      }

      var fallBack = 'List Folder and File';
      var color = 'warning';
      var title = 'List Folder and File';

      this.postSlackMessage(message, fallBack, color, null, title, '', 'general');
    }

    /**
     * Post a message on slack with the command list when the bot is asked about it
     */
    _listenerCommandListMessage() {
      this._listenerMessage(this.isCommandListMessage, () => {
        this.postSlackMessage('This is the command list \n • dir "nameFolder" or ls "nameFolder" \n • cd "nameFolder"  \n • list root \n • help ', 'Command list',
            this.infoColor, null, 'Command list', '', 'general');
      });
    }

    /**
     * recognize if in the message is present the command "help"
     *
     * @param {String} textMessage to analyze
     */
    isCommandListMessage(textMessage) {
      return slackMessageAnalyzer.isTextContainedInMessage(textMessage, 'help');
    }

    /**
     * recognize if in the message is present the command "list root"
     *
     * @param {String} textMessage to analyze
     */
    isFileAndFolderRootMessage(textMessage) {
      return slackMessageAnalyzer.isTextContainedInMessage(textMessage, 'list root');
    }

    /**
     * recognize if in the message is present the command "dir" or ls
     *
     * @param {String} textMessage to analyze
     */
    isFileAndFolderMessage(textMessage) {
      return slackMessageAnalyzer.isTextContainedInMessage(textMessage, 'dir') || slackMessageAnalyzer.isTextContainedInMessage(textMessage, 'ls');
    }

    /**
     * recognize if in the message is present the command "cd"
     *
     * @param {String} textMessage to analyze
     */
    isMoveFodlerMessage(textMessage) {
      return slackMessageAnalyzer.isTextContainedInMessage(textMessage, 'cd');
    }

    /**
     * Post a message in the slack general chat
     *
     * @param {String} message
     * @param {String} fallback
     * @param {successColor|failColor|infoColor} color of the vertical line before the message default infoColor yellow
     * @param {Array} fields is an Array of messages  { 'title': 'Project', 'value': 'Awesome Project','short': true},
     * @param {String} title title message,
     * @param {String} titleLink link message
     * @param {String} nameChannelOrUser where posts a message  channel | group | user by name,
     */
    postSlackMessage(message, fallback, color, fields, title, titleLink, nameChannelOrUser) {
      var params = {
        as_user: true,
        attachments: [
                {
                  'fallback': fallback,
                  'color': color || this.infoColor,
                  'title': title ? title : 'alfresco-bot',
                  'title_link': titleLink,
                  'text': message,
                  'fields': fields,
                  'mrkdwn_in': ['text', 'pretext']
                }
            ]
      };

      this.bot.postTo(nameChannelOrUser, '', params);
    }

    /**
     * Call a callback in the case a message from slack meets the condition
     *
     * @param {Boolean}  condition to meet to call the callback
     * @param {Function} callback to call if the condition is satisfied
     */
    _listenerMessage(condition, callback) {
      this.bot.on('message', (message) => {
        if (condition.call(this, message.text, message.username)) {
          callback.call(this, message);
        }
      });
    }

    _icon(node) {
      if (this._isFolder(node)) {
        return ':file_folder:';
      } else {
        return ':notebook:';
      }
    }

    _isFolder(node) {
      return node.isFolder ? true : false;
    }
}

module.exports = AlfrescoBot;
