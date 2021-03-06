# iCast

> Cast audio from your Mac using Chromecast

This little menu bar app allows you to cast audio from your Mac to any available
Chromecast devices. Just run the app, and choose an option from the menu bar.

## Install

Before installing iCast, you need to install
[Soundflower](https://github.com/mattingalls/Soundflower). You must also have
[Node](https://nodejs.org) and symlink it to `/usr/local/bin/node` (weird bug).

Then, download a [release](https://github.com/ajay-gandhi/icast/releases), copy
to your applications folder, and run.

## Build and Run

Install [Soundflower](https://github.com/mattingalls/Soundflower), as mentioned
above.

Clone this repo and install dependencies:

```bash
git clone https://github.com/ajay-gandhi/icast.git
cd icast
npm install
```

Run the app:

```bash
npm start
```

## Todos

* Fix absolute path node bug
