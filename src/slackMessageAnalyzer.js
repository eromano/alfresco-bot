'use strict';

class slackMessageAnalyzer {

    /**
     * Create a slack link format message
     *
     * @param {String} titleLink  text to show instead of the pure URL
     * @param {String} link to redirect
     *
     * @return {String} slack format message link
     */
    static createSlackMessageLink(titleLink, link) {
      return '<' + link + '|' + titleLink + '>';
    }

    /**
     * Create a slack link format message
     *
     * @param {String} textMessage message to analyze
     * @param {String} textToSearch text to search in the message
     *
     * @return {String} slack format message link
     */
    static isTextContainedInMessage(textMessage, textToSearch) {
      return textMessage && textMessage.toLowerCase().indexOf(textToSearch) > -1;
    }

    /**
     * Return the folder name
     *
     * @param {String} textMessage message to analyze
     * @param {String} wordBeforeNameFolder text to search in the message
     *
     * @return {String} fodler in the command
     */
    static getFolderNameInMessageFromText(textMessage, wordBeforeNameFolder) {
      if (slackMessageAnalyzer.isTextContainedInMessage(textMessage, wordBeforeNameFolder)) {
        var wordPos = textMessage.toLowerCase().indexOf(wordBeforeNameFolder);
        var afterStatus = textMessage.toLowerCase().substr((wordPos + wordBeforeNameFolder.length), textMessage.length).trim();

        var allPhrasesSeparateBySpace = afterStatus.split(' ');

        if (allPhrasesSeparateBySpace && allPhrasesSeparateBySpace.length > 0) {
          return allPhrasesSeparateBySpace[0].trim();
        }
      }
    }
}

module.exports = slackMessageAnalyzer;
