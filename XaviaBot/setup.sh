#!/bin/sh

# create the necessary directories if they do not exist
mkdir -p ./plugins/commands/anonchat
mkdir -p ./plugins/onMessage/
mkdir -p ./core/dashboard/server/

# download the files from GitHub
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/XaviaBot/anonchat.js -o ./plugins/commands/anonchat/anonchat.js
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/XaviaBot/anonchat_msg.js -o ./plugins/commands/anonchat/anonchat_msg.js
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/XaviaBot/anonchat_auto.js -o ./plugins/onMessage/anonchat_auto.js
curl https://raw.githubusercontent.com/shahryarsalmaan/AnonChat/main/XaviaBot/app.js -o ./core/dashboard/server/app.js

# output messages to the console
echo "Integration with AnonChat API has been successfully completed."
echo "To proceed further, please reach out to the AnonChat developer team for registering your bot as an agent and obtaining your unique username."
echo "Upon receiving your username, ensure to replace the 'agent_username' variable in the files: anonchat.js, anonchat_msg.js, and anonchat_auto.js."
echo "Please note that during the registration process, you will be required to provide the server URL where the bot will be listening for incoming requests."
echo "Best of luck with your AnonChat integration!"

