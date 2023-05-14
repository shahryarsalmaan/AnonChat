import axios from 'axios';

const config = {
  name: "anonchat_msg",
  aliases: ["ac"],
  description: "Send a message to AnonChat",
  usage: "[message]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "AnonChat API",
  dependencies: ["axios"]
};

const agentUsername = "@youragentname"; // Set your agent username here

async function onCall({ message, args }) {
  const input = args.join(" ");

  if (!input) {
    return message.reply("Please provide a message to send.");
  }

  if (input == "on" || input == "off") {

    if (input == "on") {
      if (global.anonchat_msg.hasOwnProperty(message.threadID)) return message.reply("AnonChat is already on");
      global.anonchat_msg[message.threadID] = true;
      return message.reply("AnonChat is now on");
    } else if (input == "off") {
      if (!global.anonchat_msg.hasOwnProperty(message.threadID)) return message.reply("AnonChat is already off");
      delete global.anonchat_msg[message.threadID];
      return message.reply("AnonChat is now off");
    }
  }

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

export default {
  config,
  onCall
};
