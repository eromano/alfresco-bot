<h1 align="center">alfresco-bot</h1>
<p align="center">
    <a title='Build Status' href="https://travis-ci.org/alfresco/alfresco-bot">
        <img src='https://travis-ci.org/alfresco/alfresco-bot.svg?branch=master' alt='travis Status' />
    </a>
    <a title='coveralls Status' href='https://coveralls.io/r/alfresco/alfresco-bot'>
        <img src='https://img.shields.io/coveralls/alfresco/alfresco-bot.svg' alt='Coverage Status' />
    </a>
</p>
<p align="center">
    <a title='closed issue' href='http://issuestats.com/github/alfresco/alfresco-bot'>
        <img src='http://issuestats.com/github/alfresco/alfresco-bot/badge/issue' alt='issue stats' />
    </a>
    <a title='blog' href='http://eromano.github.io/'>
       <img src='https://img.shields.io/badge/style-blog-blue.svg?label=my' alt='blog' />
    </a>
</p>

## About alfresco-bot
>alfresco-bot is a  node.js slack bot.
Alfresco Bot able to do live search and communicate with alfresco share

## Getting Started
1. Create a new [bot integration](https://my.slack.com/services/new/bot)
1. Choose between **One-Click Heroku** or **Manual Heroku**

 - **One-Click Heroku**
       Click this button:

       [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

 - **Manual Heroku**
    *  Install [Heroku toolbelt](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
    * Create a new bot integration (as above)
    *  `heroku create`
    *  `heroku config:set TOKEN_SLACK=[Your Slack bot integration token (obtainable at https://my.slack.com/services/new/bot)]`
    *  `git push heroku master`

## Command list

* To show the command list

    ```@alfresco command list ```

* To show the folder list

     ```@alfresco dir ```

* To show the content of folder list

     ```@alfresco dir nameFolder ```

## Development

* To test alfresco-bot

    ```$ npm run-script test```

* To debug alfresco-bot

    ```$ npm run-script debug```

* To see the test coverage alfresco-bot

    ```$ npm run-script coverage```

* To run alfresco-bot on your machine

    ```$ npm run-script start```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b alfresco-bot`
3. Commit your changes: `git commit -a `
4. Push to the branch: `git push origin alfresco-bot`
5. Submit a pull request

## History

For detailed changelog, check [Releases](https://github.com/alfresco/alfresco-bot/releases).

### Contributors

Contributor | GitHub profile |
--- | --- | ---
Eugenio Romano  (Creator) | [alfresco](https://github.com/alfresco) |

