const axios = require('axios');
const agent_username = "@your_agent_username"; // Set your agent username here

const goatBotAnonchatCommand = {
  config: {
    name: "anonchat",
    version: "0.0.2",
    author: "AnonChat API",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Manage AnonChat account",
      en: "Manage AnonChat account"
    },
    longDescription: {
      vi: "Manage AnonChat account",
      en: "Manage AnonChat account"
    },
    category: "anonchat"
  },

  onStart: async function({ api, event, commandName }) {
    try {
      const body = event.body.split(' ');
      const subCommand = body[1]; // The subcommand is the second argument
      switch(subCommand) {
        case 'info':
            return accountInfo();
        case 'delete':
            return accountDelete();
        case 'link':
            return accountLink();
        case 'create':
            return accountCreate();
        case 'sendreq':
            return accountSendReq();
        case 'pair':
            return accountPair();
        case 'dismiss':
            return accountDismiss();
        case 'change':
            return accountChange();
        default:
            return api.sendMessage("Invalid subcommand. Please use 'create', 'info', 'link', 'change', 'sendreq', 'pair', 'dismiss' or 'delete'.", event.threadID);
      }

      async function accountInfo() {
    axios.get(`https://anonchat.xaviabot.repl.co/menu/account?uid=${event.senderID}`)
        .then(response => {
            if (response.data.success) {
                const { name, anonchat_username, language, pairing_partner } = response.data;
                let reply = `Name: ${name}\nUsername: ${anonchat_username}\nLanguage: ${language ? language : "None"}`;

                if (pairing_partner) {
                    reply += `\nPairing Partner: ${pairing_partner.name} (${pairing_partner.anonchat_username})`;
                }

                api.sendMessage(reply, event.threadID);
            } else {
                api.sendMessage(`Error retrieving account info: ${response.data.message}`, event.threadID);
            }
        })
        .catch(error => {
            api.sendMessage(`Error retrieving account info. Please try again.`, event.threadID);
        });
}

      async function accountDelete() {
        try {
          const reply = await api.sendMessage(`Reply with your passkey.`, event.threadID);
          global.GoatBot.onReply.set(reply.messageID, {
            commandName,
            author: event.senderID,
            messageID: reply.messageID,
            subCommand: "delete",
            passkey: ""
          });
        } catch (error) {
          console.error(error);
        }
      }
      
      async function accountLink() {
    try {
        const reply = await api.sendMessage("Reply with your passkey.", event.threadID);
        global.GoatBot.onReply.set(reply.messageID, {
            commandName,
            author: event.senderID,
            messageID: reply.messageID,
            subCommand: "link",
            passkey: ""
        });
    } catch (error) {
        console.error(error);
    }
}
    } catch (error) {
      console.error(error);
    }
    
    async function accountCreate() {
      try {
        const reply = await api.sendMessage("Reply with your name.", event.threadID);
        global.GoatBot.onReply.set(reply.messageID, {
          commandName,
          author: event.senderID,
          messageID: reply.messageID,
          subCommand: "create",
          name: ""
        });
      } catch (error) {
        console.error(error);
      }
    }
    
    async function accountSendReq() {
      try {
        const reply = await api.sendMessage("Reply with your message.", event.threadID);
        global.GoatBot.onReply.set(reply.messageID, {
          commandName,
          author: event.senderID,
          messageID: reply.messageID,
          subCommand: "sendreq",
          message: ""
        });
      } catch (error) {
        console.error(error);
      }
    }
    
    async function accountPair() {
      try {
        const reply = await api.sendMessage("Reply with the username of the person you want to pair with.", event.threadID);
        global.GoatBot.onReply.set(reply.messageID, {
          commandName,
          author: event.senderID,
          messageID: reply.messageID,
          subCommand: "pair",
          username: ""
        });
      } catch (error) {
        console.error(error);
      }
    }
    
   async function accountDismiss() {
     try {
       const reply = await api.sendMessage("Reply with your passkey.", event.threadID);
       global.GoatBot.onReply.set(reply.messageID, {
         commandName,
         author: event.senderID,
         messageID: reply.messageID,
         subCommand: "dismiss",
         passkey: ""
       });
     } catch (error) {
       console.error(error);
     }
   }
   
   async function accountChange() {
     try {
       const reply = await api.sendMessage("What do you want to change? Reply with name/username/passkey/language.", event.threadID);
       global.GoatBot.onReply.set(reply.messageID, {
         commandName,
         author: event.senderID,
         messageID: reply.messageID,
         subCommand: "change",
         changeType: ""
       });
     } catch (error) {
       console.error(error);
     }
   }
  },

  onReply: async function({ api, event, args, Reply, commandName }) {
    try {
      if (event.senderID != Reply.author) {
        return api.sendMessage("Sorry, you are not authorized to use this command. 😐", event.threadID);
      }

      if (Reply.subCommand === "delete" && Reply.passkey === "") {
        Reply.passkey = event.body;
        api.sendMessage("Deleting account, please wait...", event.threadID);

        const accountDetails = { uid: event.senderID, passkey: Reply.passkey };

        axios.put("https://anonchat.xaviabot.repl.co/menu/delete-account", accountDetails)
            .then(response => {
                if (response.data.success) {
                    api.sendMessage(`Account deleted successfully.`, event.threadID);
                } else {
                    api.sendMessage(`Error deleting account: ${response.data.message}`, event.threadID);
                }
            })
            .catch(error => {
                            api.sendMessage(`Error deleting account. Please try again.`, event.threadID);
            });

        // Clear the onReply listener after use
        global.GoatBot.onReply.delete(Reply.messageID);
      }
    } catch (error) {
      console.error(error);
    }
    
    if (Reply.subCommand === "link" && Reply.passkey === "") {
    Reply.passkey = event.body;
    api.sendMessage("Linking account, please wait...", event.threadID);

    const accountDetails = { uid: event.senderID, passkey: Reply.passkey, newLinkedAgent: agent_username };

    axios.put("https://anonchat.xaviabot.repl.co/menu/change", accountDetails)
        .then(response => {
            if (response.data.success) {
                api.sendMessage(`Account linked successfully with ${agent_username}`, event.threadID);
            } else {
                api.sendMessage(`Error linking account: ${response.data.message}`, event.threadID);
            }
        })
        .catch(error => {
            api.sendMessage(`Error linking account. Please try again.`, event.threadID);
        });

    // Clear the onReply listener after use
    global.GoatBot.onReply.delete(Reply.messageID);
}

if (Reply.subCommand === "create") {
    if (Reply.name === "") {
        Reply.name = event.body;
        const passkeyPromptReply = await api.sendMessage("Reply with your passkey.", event.threadID);

        global.GoatBot.onReply.set(passkeyPromptReply.messageID, {
            commandName,
            author: event.senderID,
            messageID: passkeyPromptReply.messageID,
            subCommand: "create",
            name: Reply.name
        });

    } else {
        Reply.passkey = event.body;
        api.sendMessage("Creating account, please wait...", event.threadID);

        const accountDetails = {
            uid: event.senderID,
            name: Reply.name,
            passkey: Reply.passkey,
            agent_username
        };

        axios.post("https://anonchat.xaviabot.repl.co/create_account", accountDetails)
            .then(response => {
                if (response.data.success) {
                    api.sendMessage(`Account created successfully. Welcome, ${Reply.name}! Your AnonChat username is ${response.data.anonchat_username}`, event.threadID);
                } else {
                    api.sendMessage(`Error creating account: ${response.data.message}`, event.threadID);
                }
            })
            .catch(error => {
                api.sendMessage(`Error creating account. Please try again.`, event.threadID);
            });

        // Clear the onReply listener after use
        global.GoatBot.onReply.delete(Reply.messageID);
    }
}

if (Reply.subCommand === "sendreq") {
    Reply.message = event.body;
    api.sendMessage("Sending request, please wait...", event.threadID);

    const requestDetails = {
        uid: event.senderID,
        agent_username,
        message: Reply.message
    };

    axios.post("https://anonchat.xaviabot.repl.co/pair_request/send", requestDetails)
        .then(response => {
            if (response.data.success) {
                api.sendMessage(`Pairing request sent successfully.`, event.threadID);
            } else {
                api.sendMessage(`Error sending pairing request: ${response.data.message}`, event.threadID);
            }
        })
        .catch(error => {
            api.sendMessage(`Error sending pairing request. Please try again.`, event.threadID);
        });

    // Clear the onReply listener after use
    global.GoatBot.onReply.delete(Reply.messageID);
}

if (Reply.subCommand === "pair") {
    Reply.username = event.body;
    api.sendMessage("Accepting request, please wait...", event.threadID);

    const requestDetails = {
        uid: event.senderID,
        username: Reply.username
    };

    axios.post("https://anonchat.xaviabot.repl.co/pair_request/accept", requestDetails)
        .then(response => {
            if (response.data.success) {
                api.sendMessage(`Pairing request accepted successfully.`, event.threadID);
            } else {
                api.sendMessage(`Error accepting pairing request: ${response.data.message}`, event.threadID);
            }
        })
        .catch(error => {
            api.sendMessage(`Error accepting pairing request. Please try again.`, event.threadID);
        });

    // Clear the onReply listener after use
    global.GoatBot.onReply.delete(Reply.messageID);
}

if (Reply.subCommand === "dismiss") {
    Reply.passkey = event.body;
    api.sendMessage("Dismissing pair, please wait...", event.threadID);

    const pairDetails = {
        uid: event.senderID,
        passkey: Reply.passkey
    };

    axios.post("https://anonchat.xaviabot.repl.co/dismiss_pair/dismiss", pairDetails)
        .then(response => {
            if (response.data.success) {
                api.sendMessage(`Pair dismissed successfully.`, event.threadID);
            } else {
                api.sendMessage(`Error dismissing pair: ${response.data.message}`, event.threadID);
            }
        })
        .catch(error => {
            api.sendMessage(`Error dismissing pair. Please try again.`, event.threadID);
        });

    // Clear the onReply listener after use
    global.GoatBot.onReply.delete(Reply.messageID);
}
if (Reply.subCommand === "change") {
    if (Reply.changeType === "") {
        const changeType = event.body.toLowerCase();
        if (!['name', 'username', 'passkey', 'language'].includes(changeType)) {
            api.sendMessage(`Invalid option. Please reply with name, username, passkey or language.`, event.threadID);
            return;
        }
        Reply.changeType = changeType;

        const promptReply = await api.sendMessage(`Reply with your new ${changeType}.`, event.threadID);
        global.GoatBot.onReply.set(promptReply.messageID, {
            commandName,
            author: event.senderID,
            messageID: promptReply.messageID,
            subCommand: "change",
            changeType: Reply.changeType,
            newValue: ""
        });

        // Clear the onReply listener for the previous message after use
        global.GoatBot.onReply.delete(Reply.messageID);
    } else if (Reply.newValue === "") {
        Reply.newValue = event.body;
        const passkeyPromptReply = await api.sendMessage("Reply with your passkey.", event.threadID);
        global.GoatBot.onReply.set(passkeyPromptReply.messageID, {
            commandName,
            author: event.senderID,
            messageID: passkeyPromptReply.messageID,
            subCommand: "change",
            changeType: Reply.changeType,
            newValue: Reply.newValue,
            passkey: ""
        });

        // Clear the onReply listener for the previous message after use
        global.GoatBot.onReply.delete(Reply.messageID);
    } else if (Reply.passkey === "") {
        Reply.passkey = event.body;
        api.sendMessage("Updating account, please wait...", event.threadID);

        const changeMapping = {
            name: 'newName',
            username: 'newUsername',
            passkey: 'newPasskey',
            language: 'newLanguage'
        };
        const changeKey = changeMapping[Reply.changeType];

        const accountDetails = {
            uid: event.senderID,
            passkey: Reply.passkey,
            [changeKey]: Reply.newValue
        };

        axios.put("https://anonchat.xaviabot.repl.co/menu/change", accountDetails)
            .then(response => {
                if (response.data.success) {
                    api.sendMessage(`Account ${Reply.changeType} changed successfully.`, event.threadID);
                } else {
                    api.sendMessage(`Error changing account ${Reply.changeType}: ${response.data.message}`, event.threadID);
                }
            })
            .catch(error => {
                api.sendMessage(`Error changing account. Please try again.`, event.threadID);
            });

        // Clear the onReply listener after use
        global.GoatBot.onReply.delete(Reply.messageID);
    }
}

  }
};

module.exports = goatBotAnonchatCommand;