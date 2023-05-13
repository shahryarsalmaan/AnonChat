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
  const content = args.join(" ");

  if (!content) {
    return message.reply("Please provide a message to send.");
  }

  const uid = message.senderID;

  const requestData = {
    uid: uid,
    agent_username: agentUsername,
    message: content
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
