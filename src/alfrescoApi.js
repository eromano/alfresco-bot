'use strict';

var alfrescoApiClient = require('alfresco-api-client');

class AlfrescoApi {

    /**
     * @param {String} username
     * @param {String} password
     * @param {String} alfrescoShareIp Your share server IP or DNS name
     */
    constructor(username, password, alfrescoShareIp) {
      this.alfrescoHost = alfrescoShareIp;

      this.config = {
        host: this.alfrescoHost,
        user: username,
        password: password
      };

      this._loginAlfresco();
    }

    _loginAlfresco() {
      return new Promise((resolve, reject) => {
        alfrescoApiClient.loginPromise(this.config).then(()=> {
          resolve();
        }, ()=> {
          reject();
        });
      });
    }

    getFoldersFileRoot() {
      return new Promise((resolve, reject) => {
        alfrescoApiClient.cmisBrowserPromise(null, 'children').then((result) => {
          resolve(result);
        }, (err) => {
          if (err) {
            reject(new Error(('Alfresco Access Error ' + err)));
          }
        });
      });
    }

    getListByFolder(folderShortName) {
      return new Promise((resolve, reject) => {
        if (folderShortName && folderShortName.indexOf(0, '/') < 0) {
          folderShortName = '/' + folderShortName;
        }

        alfrescoApiClient.cmisBrowserPromise(folderShortName, alfrescoApiClient.CMIS_SELECTOR_CHILDREN).then(function (result) {
          resolve(result);
        }, () => {
          reject('Folder not found or not Authorized');
        });
      });
    }

    getContentUrl(url) {
      return this.alfrescoHost + 'share/page/context/mine/document-details?nodeRef=' + url;
    }
}

module.exports = AlfrescoApi;
