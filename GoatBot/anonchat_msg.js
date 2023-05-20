const axios = require('axios');
const agentUsername = "@your_agent_username"; // Set your agent username here

const goatBotAnonChatMSGCommand = {
  config: {
    name: "anonchat_msg",
    aliases: ["ac"],
    shortDescription: {
      vi: "Gửi tin nhắn đến AnonChat",
      en: "Send a message to AnonChat"
    },
    longDescription: {
      vi: "Gửi tin nhắn đến AnonChat",
      en: "Send a message to AnonChat"
    },
    category: "anonchat",
    cooldown: 3,
    role: 0,
    credits: "AnonChat API",
    dependencies: ["axios"]
  },

  onStart: async function({ api, event, args, threadsData, getLang }) {
  const uid = event.senderID;

  if (args[0] === "on" || args[0] === "off") {
    if (args.length === 1) {
      let settings = await threadsData.get(event.threadID, "settings") || {};
      if (args[0] === "on") {
        settings.anonchat = settings.anonchat || {};
        settings.anonchat[uid] = true;
        await threadsData.set(event.threadID, settings, "settings");
        return api.sendMessage("AnonChat is now on", event.threadID);
      } else if (args[0] === "off") {
        settings.anonchat = settings.anonchat || {};
        settings.anonchat[uid] = false;
        await threadsData.set(event.threadID, settings, "settings");
        return api.sendMessage("AnonChat is now off", event.threadID);
      }
    }
    return;
  } else {
    const content = args.join(" ");
    if (!content) {
      return api.sendMessage("Please provide a message to send.", event.threadID);
    }

    const requestData = {
      uid: uid,
      agent_username: agentUsername,
      message: content
    };

    try {
      const response = await axios.post("https://chat.whisperly.repl.co/send_message", requestData);
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
},

  onChat: async function({ api, event, threadsData, isUserCallCommand, getLang }) {
    if (isUserCallCommand) return;

    const content = event.body;

    if (!content) return;

    let settings = await threadsData.get(event.threadID, "settings") || {};
    const uid = event.senderID;

    if (!settings.anonchat || !settings.anonchat[uid]) return;

    const requestData = {
      uid: uid,
      agent_username: agentUsername,
      message: content
    };

    try {
      const response = await axios.post("https://chat.whisperly.repl.co/send_message", requestData);
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