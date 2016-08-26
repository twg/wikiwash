
# WikiWash

[![Build Status](https://img.shields.io/travis/twg/wikiwash.svg?style=flat)](https://travis-ci.org/twg/wikiwash) [![Coverage Status](https://img.shields.io/coveralls/twg/wikiwash.svg?style=flat)](https://coveralls.io/r/twg/wikiwash) [![Code Climate](https://img.shields.io/codeclimate/github/twg/wikiwash.svg?style=flat)](https://codeclimate.com/github/twg/wikiwash)

Track whitewashing on Wikipedia.

A project by [TWG](https://twg.io), in collaboration with
the [Center for Investigative Reporting](http://www.centerforinvestigativereporting.org/) and
[Metro News](http://metronews.ca/), and made possible by [Google Canada](http://googlecanada.blogspot.ca/).


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

### Vagrant Setup

You can also try using a pre-configured Vagrant box to run WikiWash. This method will provide you with a standard development environment that you can use on any system.

First you need to install the following:
* [VirtualBox](https://www.virtualbox.org)
* [Vagrant](http://vagrantup.com)

Then run the following commands to setup the VM:
```
host $ git clone git@github.com:twg/wikiwash.git
host $ cd wikiwash
host $ vagrant up
```
Finally, login to the machine and you're good to go:
```
host $ vagrant ssh
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-34-generic x86_64)
...
ubuntu@wikiwash-dev-box:~$ npm start
```

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

## Toolchain

This project uses

* [Angular](https://angularjs.org/) as a browser application framework
* [Bower](http://bower.io) for front-end dependency management
* [Express](http://expressjs.com/) as an http server framework
* [Gulp](http://gulpjs.com) for our web application assembly
* [Jade](http://jade-lang.com/) as our HTML template engine
* [Mocha](https://mochajs.org/) for testing
* [NodeJS](http://nodejs.org/) as a development environment
* [npm](https://npmjs.org) for dependency management and build system
* [PM2](https://github.com/Unitech/pm2) for deployment automation and process monitoring
* [Till](https://github.com/psobot/till) as a local file/S3 cache server
