/*global describe, it, beforeEach, afterEach */
'use strict';
var  AlfrescoBot = require('../src/AlfrescoBot');

var expect = require('chai').expect;
var sinon = require('sinon');
var Bot = require('slackbots');
var nock = require('nock');

var Channel = require('../test/mockObjects/channel');

describe('Alfresco bot command', function () {

  beforeEach(function () {
    this.textCheck = '';

    this.slackbotStub = sinon.stub(Bot.prototype, 'postTo', (name, text, params) => {
      this.textCheck = params.attachments[0].text;
      this.colorMessage = params.attachments[0].color;
      this.fields = params.attachments[0].fields;
      this.title = params.attachments[0].title;
      this.title_link = params.attachments[0].title_link;
    });

    this.alfrescoBot = new AlfrescoBot('Fake-token-slack', 'http://192.168.99.100:8080/');
    this.alfrescoBot.bot.self = {id: '1234'};
    this.alfrescoBot.bot.channels = Channel.createChannelList();
    this.alfrescoBot.run();
  });

  afterEach(function () {
    this.slackbotStub.restore();
    nock.cleanAll();
  });

  it('should respond with the command list if asked "help" ', function (done) {
    this.alfrescoBot.bot.emit('message', {
      username: 'Gegge',
      user: 'C3P0',
      channel: 'general',
      type: 'message',
      text: 'help'
    });

    setTimeout(()=> {
      expect(this.textCheck).to.be.equal('This is the command list \n • dir "nameFolder"  \n • list root \n • help ');
      expect(this.colorMessage).to.be.equal(this.alfrescoBot.infoColor);
      done();
    }, 20);
  });
});
