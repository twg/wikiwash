
# WikiWash

Track whitewashing on Wikipedia. Try out WikiWash at [http://wikiwash.metronews.ca/](http://wikiwash.metronews.ca/)

A project by [TWG](https://twg.io), in collaboration with
the [Center for Investigative Reporting](http://www.centerforinvestigativereporting.org/) and
[Metro News](http://metronews.ca/), and made possible by [Google Canada](http://googlecanada.blogspot.ca/).

[![Build Status](https://img.shields.io/travis/twg/wikiwash.svg?style=flat)](https://travis-ci.org/twg/wikiwash) [![Coverage Status](https://img.shields.io/coveralls/twg/wikiwash.svg?style=flat)](https://coveralls.io/r/twg/wikiwash) [![Code Climate](https://img.shields.io/codeclimate/github/twg/wikiwash.svg?style=flat)](https://codeclimate.com/github/twg/wikiwash)

## Setup

WikiWash requires [NodeJS](http://nodejs.org/) which can be installed either
by downloading the installer or by using a package manager.


```
$ git clone git@github.com:twg/wikiwash.git
$ cd wikiwash

$ npm install
$ bower install
$ npm start
```

the application should now be available at [http://localhost:3000](http://localhost:3000).

WikiWash has been developed on Mac OS X and deployed on Linux, but in theory,
should work on any operating system. If you've tried running WikiWash on your
own machine, feel free to edit this README to update the above instructions.

## Issues & Contributions

Found a problem with WikiWash? [Submit an issue](https://github.com/twg/wikiwash/issues/new)
to let us know.

Feel free to add as much detail a you can, including:

- The observed behaviour
- The expected behaviour
- Environment details (device, operating system, browser, resolution, etc.)
- Artifacts (screenshots, screencasts, error messages)

You can also use `Labels` to categorize your issues.

| Label            | Example                     | Meaning                                                       |
|:-----------------|:----------------------------|:--------------------------------------------------------------|
| Issue Type       | `t-bug`                     | The type of issue is being reported.                          |
| Priority         | `p-critical`                | The issue's importance in relation to other issues. Higher                                                        priority is given to stability, or glaring user experience                                                                                                             issues.  |
| Area             | `a-article page`            | The area of the app that is affected by this issue.           |
| Browser/Device   | `b-firefox`, `b-mobile`     | The browser or device affected **uniquely** affected.         |
| Additional Info  | `i-difficult to reproduce`  | Other details to help with reproducing/resolving.             |
| Developer Effort | `e-challenging`             | Effort to resolve this isusue. To be used by developers only. |
| Issue State      | `s-needs work`              | The current workflow state of the issue.                      |
| Resolution       | `r-duplicate`               | If not fixed, why the issue was closed.                       |

See something that you'd like to change? We're all ears! Please, feel free to
[fork](https://github.com/twg/wikiwash/fork) WikiWash on Github and submit a
pull request to merge changes back into the application.

## Deployment

To deploy WikiWash to your own servers, you'll have to set up
[PM2](https://github.com/Unitech/pm2) on your own servers and change
[ecosystem.json](https://github.com/twg/wikiwash/blob/master/ecosystem.json)
to point at your new server environments. Once that's done, deployment is as
simple as:

```
$ bin/pm2 deploy production
```

Note that WikiWash integrates well with [Till](https://github.com/psobot/till),
a cache server that helps speed up page requests from Wikipedia. Setting up a
Till server is not required, but will make WikiWash noticeably faster for
frequently-accessed pages. (An example configuration file for Till is included
at `example/till.config.example.json`.)

WikiWash also includes two example cronjobs (`wikiwash-fetch.cron` and
`wikiwash-cache.cron`) that can run in the background to speed up WikiWash and
to display the most-read Wikipedia articles from the last hour. Note that
these cronjobs call scripts in the `scripts` folder, and do download large
amounts of data from Wikimedia's dump server.

## Libraries

#### HTTP server

* [NodeJS](http://nodejs.org/) - Platform for building fast, scalable network applications
* [Express](http://expressjs.com/) - Web application framework

#### HTML Pre-Processors

* [Jade](http://jade-lang.com/) - HTML Template Engine

#### Front-End Frameworks

* [AngularJS](https://angularjs.org/) - JS framework

#### Cache Servers

* [Till](https://github.com/psobot/till) - local files/S3 cache server

#### Package Management, Asset Build System

* [npm](https://npmjs.org) - Node Packaged Modules
* [Bower](http://bower.io) - The package manager for the web
* [Gulp](http://gulpjs.com) - The streaming build system

#### Deployment
* [PM2](https://github.com/Unitech/pm2) - Process manager
  * Modern CLI process manager for Node apps with a builtin load-balancer
* [DigitalOcean](https://www.digitalocean.com/) - Cloud hosting provider
  * [How To Use PM2 to Setup a Node.js Production Environment On An Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps)
