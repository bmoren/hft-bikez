#!/bin/bash

# if there is no settings.js file, create it!
if [ ! -f ./settings.js ]; then
  echo "Creating settings.js from default.settings.js"
  cp default.settings.js settings.js
fi

# make sure we are up to date!
npm install

# # listen for ctrl+c aka sigint
# trap killgroup SIGINT

# # kill our highscores server bg process when ctrl+c is pressed
# killgroup(){
#   ps aux | grep "node"
#   echo "$node_pid"
#   kill -INT "$node_pid"
# }

if [ "$1" = "-cleardb" ]; then
	rm -rf db
	echo "High Scores Cleared"
 	exit 

fi

if [ "$1" = "-dns" ]; then
	echo "DNS Mode"
	# start the highscores server in the background
	node hs_server.js &
	# save the process id
	# node_pid="$!"
	# 
	#start HappyFunTimes in DNS Mode
	sudo hft start --dns --app-mode --no-ask-name --no-menu --no-check-for-app
else
	echo "Local Mode"
	# start the highscores server in the background
	node hs_server.js &
	# save the process id
	# node_pid="$!"
	# 
	# start HappyFunTimes in LOCAL app mode
	hft start --app-mode
fi



