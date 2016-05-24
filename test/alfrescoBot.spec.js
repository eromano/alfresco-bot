/*global describe, it, beforeEach, afterEach */
'use strict';

var  AlfrescoBot = require('../src/AlfrescoBot');
var expect = require('chai').expect;
var sinon = require('sinon');
var Bot = require('slackbots');

describe('Bot Initialization', function () {

  beforeEach(function () {
    this.textCheck = '';

    this.slackbotStub = sinon.stub(Bot.prototype, 'postTo', (name, text, params) => {
      this.textCheck = params.attachments[0].text;
    });

    this.loginStub = sinon.stub(Bot.prototype, 'login', function () {});

    this.alfrescoBot = new AlfrescoBot('Fake-token-slack', 'http://192.168.99.100:8080/');
    this.alfrescoBot.run();
  });

  afterEach(function () {
    this.slackbotStub.restore();
    this.loginStub.restore();
  });

  it('should the BOT token present', function () {
    expect(this.alfrescoBot.bot.token).to.be.equal('Fake-token-slack');
  });

  it('should the BOT say hello to the the channel when start', function () {
    this.alfrescoBot.bot.emit('start');

    expect(this.textCheck).to.be.equal('Hello I am alfresco-bot');
  });
});
