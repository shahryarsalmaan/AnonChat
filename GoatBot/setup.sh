#!/bin/sh

# create the necessary directories if they do not exist
mkdir -p ./scripts/cmds
mkdir -p ./dashboard

# download the files from GitHub
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/GoatBot/anonchat.js -o ./scripts/cmds/anonchat.js
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/GoatBot/anonchat_msg.js -o ./scripts/cmds/anonchat_msg.js
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/GoatBot/app.js -o ./dashboard/app.js

# output messages to the console
echo "AnonChat API integration with GoatBot has been successfully completed."
echo "Please reach out to the appropriate developers to register your bot as an agent and obtain your unique username."
echo "After receiving your username, make sure to update the 'agent_username' variable in the files anonchat.js and anonchat_msg.js."
echo "Also, during the registration process, remember to provide the server URL where your bot will listen for incoming requests."
echo "Good luck with your AnonChat integration!"
