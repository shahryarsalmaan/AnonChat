const axios = require('axios');
const agentUsername = "@youragentname"; // Set your agent username here

const goatBotAnonChatMSGCommand = {
  config: {
    name: "anonchat_msg",
    aliases: ["ac"],
    shortDescription: {
      vi: "Send a message to AnonChat",
      en: "Send a message to AnonChat"
    },
    longDescription: {
      vi: "Send a message to AnonChat",
      en: "Send a message to AnonChat"
    },
    category: "anonchat",
    cooldown: 3,
    role: 0,
    credits: "AnonChat API",
    dependencies: ["axios"]
  },

  onStart: async function({ api, event, args }) {
    const content = args.join(" ");

    if (!content) {
      return api.sendMessage("Please provide a message to send.", event.threadID);
    }

    const uid = event.senderID;

    const requestData = {
      uid: uid,
      agent_username: agentUsername,
      message: content
    };

    try {
      const response = await axios.post("https://anonchat.xaviabot.repl.co/send_message", requestData);
      const data = response.data;

      if (data.success) {
        await api.setMessageReaction("✅", event.messageID, event.threadID, api);
      } else {
        return api.sendMessage(`${data.message}`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while sending the message.", event.threadID);
    }
  }
};

module.exports = goatBotAnonChatMSGCommand;
