#!/bin/bash

# if there is no settings.js file, create it!
if [ ! -f ./settings.js ]; then
  echo "Creating settings.js from default.settings.js"
  cp default.settings.js settings.js
fi

# make sure we are up to date!
npm install

if [ "$1" = "-dns" ]; then
	echo "DNS Mode"
	#start HappyFunTimes in DNS Mode
	sudo hft start --dns --app-mode --no-ask-name --no-menu --no-check-for-app
else
	echo "Local Mode"
	# start HappyFunTimes in LOCAL app mode
	hft start --app-mode
fi
