import axios from 'axios';

const config = {
  name: "anonchat_msg",
  aliases: ["ac"],
  description: "Send a message to AnonChat",
  usage: "[message] on/off",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "AnonChat API",
  dependencies: ["axios"]
};

const agentUsername = "@youragentusername"; // Set your agent username here

// Initialize the global object in the onLoad function
function onLoad() {
  if (!global.hasOwnProperty("anonchat_msg")) global.anonchat_msg = {};
}

async function onCall({ message, args, userPermissions }) {
  const input = args.join(" ");

  if (!input) {
    return message.reply("Please provide a message to send.");
  }

  if (input == "on") {
    if (global.anonchat_msg.hasOwnProperty(message.threadID)) return message.reply("AnonChat is already on");
    global.anonchat_msg[message.threadID] = true;
    return message.reply("AnonChat is now on");
  } else if (input == "off") {
    if (!global.anonchat_msg.hasOwnProperty(message.threadID)) return message.reply("AnonChat is already off");
    delete global.anonchat_msg[message.threadID];
    return message.reply("AnonChat is now off");
  } else {
    // If the chat is on, or the input is neither "on" nor "off", it sends the message directly
    if (global.anonchat_msg[message.threadID] || !global.anonchat_msg.hasOwnProperty(message.threadID)) {
      const uid = message.senderID;
      const requestData = {
        uid: uid,
        agent_username: agentUsername,
        message: input
      };

      try {
        const response = await axios.post("https://anonchat.xaviabot.repl.co/send_message", requestData);
        const data = response.data;

        if (data.success) {
          await message.react("✅");
        } else {
          await message.reply(`${data.message}`);
        }
      } catch (error) {
        console.error(error);
        await message.reply("An error occurred while sending the message.");
      }
    }
  }
}

export default {
  config,
  onLoad,
  onCall
};
