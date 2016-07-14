'use strict';

var AlfrescoApi = require('alfresco-js-api');
var _ = require('lodash');

class AlfrescoApiExp {

    /**
     * @param {String} username
     * @param {String} password
     * @param {String} alfrescoShareIp Your share server IP or DNS name
     */
    constructor(username, password, alfrescoShareIp) {
        this.alfrescoHost = alfrescoShareIp;

        this.lastQuery = '-root-';

        this.config = {
            host: this.alfrescoHost,
            username: username,
            password: password
        };

        this.loginNew();
    }

    loginNew() {
        this.alfrescoJsApi = new AlfrescoApi(this.config);

        this.alfrescoJsApi.on('unauthorized', function () {
            console.log('You are unauthorized you can use this event to redirect to login');
        });

        this.alfrescoJsApi.login().then((data)=> {
            this.getFoldersFileRoot();
            console.log('login called successfully. Ticket ' + data);
        }, (error)=> {
            console.log(error);
        })

    }

    getFoldersFileRoot() {
        return new Promise((resolve, reject) => {
            this.alfrescoJsApi.nodes.getNodeChildren('-root-', {include: ['path']}).then((data) => {
                this.lastQuery = data.list.entries;
                this.lastFolderId = '-root-';
                resolve(data.list.entries);
            }, (error) => {
                if (error) {
                    reject(new Error(('Alfresco Access Error ' + err)));

                }
            });
        });
    }

    getListByFolder(folderShortName) {
        return new Promise((resolve, reject) => {
            var dataNode = _.find(this.lastQuery, (data)=> {
                return data.entry.name && data.entry.name.toUpperCase() === folderShortName.toUpperCase();
            });

            this.alfrescoJsApi.nodes.getNodeChildren(dataNode.entry.id, {include: ['path']}).then((data)=> {
                this.lastQuery = data.list.entries;
                this.lastFolderId = dataNode.entry.id;
                resolve(data.list.entries);
            }, () => {
                reject('Folder not found or not Authorized');
            });
        });
    }

    getCurrentFolder() {
        return new Promise((resolve, reject) => {
            this.alfrescoJsApi.nodes.getNodeChildren(this.lastFolderId, {include: ['path']}).then((data)=> {
                resolve(data.list.entries);
            }, () => {
                reject('Folder not found or not Authorized');
            });
        });
    }

    moveFolder(folderShortName) {
        return new Promise((resolve, reject) => {
            var dataNode = _.find(this.lastQuery, (data)=> {
                return data.entry.name && data.entry.name.toUpperCase() === folderShortName.toUpperCase();
            });

            this.alfrescoJsApi.nodes.getNodeChildren(dataNode.entry.id, {include: ['path']}).then((data) => {
                this.lastQuery = data.list.entries;
                this.lastFolderId = dataNode.entry.id;
                resolve(data.list.entries);
            }, () => {
                reject('Folder not found or not Authorized');
            });
        });
    }

    getContentUrl(url) {
        return this.alfrescoHost + 'share/page/context/mine/document-details?nodeRef=' + url;
    }
}

module.exports = AlfrescoApiExp;
