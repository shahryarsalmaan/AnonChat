import axios from 'axios';

const config = {
    name: "anonchat",
    aliases: ["acsettings"],
    version: "0.0.3",
    credits: "AnonChat API",
    description: "Manage AnonChat account",
    usage: "<subcommand> [arguments]",
    cooldown: 5
};

async function onCall({ message }) {
    const { senderID, body } = message;

    const args = body.split(' ');
    const subCommand = args[1]; // The subcommand is the second argument

    const agent_username = "@your_agent_username"; // Set your agent username here

    switch(subCommand) {
        case 'info':
            return accountInfo();
        case 'delete':
            return accountDelete();
        case 'link':
            return accountLink();
        case 'change':
            return accountChange();
        case 'create':
            return accountCreate();
        case 'sendreq':
            return accountSendReq();
        case 'pair':
            return accountAccept();
        case 'dismiss':
            return accountDismiss();
        case 'pairnoti':
            return pairNotification();
        default:
            return message.reply("Invalid subcommand. Please use 'create', 'info', 'link', 'change', 'sendreq', 'pair', 'pairnoti', 'dismiss' or 'delete'.");
    }

    async function accountInfo() {
    message.reply("Reply with your passkey.")
        .then(data => data.addReplyEvent({ callback: getInfo, myData: 'myData' }))
        .catch(err => console.error(err));

    function getInfo({ message }) {
        const passkey = `${message.body}`;
        message.send("Retrieving account info, please wait...");

        axios.get(`https://anonchat.xaviabot.repl.co/menu/account?uid=${senderID}&passkey=${passkey}`)
            .then(response => {
                if (response.data.success) {
                    const { name, anonchat_username, language, pairing_partner } = response.data;
                    let reply = `Name: ${name}\nUsername: ${anonchat_username}\nLanguage: ${language ? language : "None"}`;

                    if (pairing_partner) {
                        reply += `\nPairing Partner: ${pairing_partner.name} (${pairing_partner.anonchat_username})`;
                    }

                    message.reply(reply);
                } else {
                    message.reply(`Error retrieving account info: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error retrieving account info. Please try again.`);
            });
    }
}

async function pairNotification() {
  message.send("Changing pairing notification, please wait...");

  const accountDetails = { uid: senderID, linked_agent: agent_username };

  axios.post("https://anonchat.xaviabot.repl.co/menu/pairing", accountDetails)
    .then(response => {
      if (response.data.success) {
        message.reply(response.data.message);
      } else {
        message.reply(`Error changing pairing notification: ${response.data.message}`);
      }
    })
    .catch(error => {
      message.reply(`Error changing pairing notification. Please try again.`);
    });
}
    async function accountDelete() {
        message.reply("Reply with your passkey.")
            .then(data => data.addReplyEvent({ callback: deleteAccount, myData: 'myData' }))
            .catch(err => console.error(err));

        function deleteAccount({ message, eventData }) {
            const passkey = `${message.body}`;
            message.send("Deleting account, please wait...");

            const accountDetails = { uid: senderID, passkey };

            axios.put("https://anonchat.xaviabot.repl.co/menu/delete-account", accountDetails)
                .then(response => {
                    if (response.data.success) {
                        message.reply(`Account deleted successfully.`);
                    } else {
                        message.reply(`Error deleting account: ${response.data.message}`);
                    }
                })
                .catch(error => {
                    message.reply(`Error deleting account. Please try again.`);
                });
        }
    }

async function accountLink() {
    message.reply("Reply with your passkey.")
        .then(data => data.addReplyEvent({ callback: linkAccount, myData: 'myData' }))
        .catch(err => console.error(err));

    function linkAccount({ message, eventData }) {
        const passkey = `${message.body}`;
        message.send("Linking account, please wait...");

        const accountDetails = { uid: senderID, passkey, newLinkedAgent: agent_username };

        axios.put("https://anonchat.xaviabot.repl.co/menu/change", accountDetails)
            .then(response => {
                if (response.data.success) {
                    message.reply(`Account linked successfully with ${agent_username}`);
                } else {
                    message.reply(`Error linking account: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error linking account. Please try again.`);
            });
    }
}

async function accountChange() {
    message.reply("What do you want to change? Reply with name/username/passkey/language.")
        .then(data => data.addReplyEvent({ callback: changePrompt, myData: 'myData' }))
        .catch(err => console.error(err));

    function changePrompt({ message, eventData }) {
        const changeType = `${message.body}`;

        if (!['name', 'username', 'passkey', 'language'].includes(changeType)) {
            return message.reply(`Invalid option. Please reply with name, username, passkey or language.`);
        }

        message.reply(`Reply with your new ${changeType}.`)
            .then(data => data.addReplyEvent({ callback: passkeyPrompt, myData: { changeType } }))
            .catch(err => console.error(err));
    };

    function passkeyPrompt({ message, eventData }) {
        const newValue = `${message.body}`;
        message.reply("Reply with your passkey.")
            .then(data => data.addReplyEvent({ callback: changeAccount, myData: { ...eventData.myData, newValue } }))
            .catch(err => console.error(err));
    };

    function changeAccount({ message, eventData }) {
        const passkey = `${message.body}`;
        const { changeType, newValue } = eventData.myData;
        const changeMapping = {
            name: 'newName',
            username: 'newUsername',
            passkey: 'newPasskey',
            language: 'newLanguage'
        };
        const changeKey = changeMapping[changeType];

        message.send("Updating account, please wait...");

        const accountDetails = { uid: senderID, passkey, [changeKey]: newValue };

        axios.put("https://anonchat.xaviabot.repl.co/menu/change", accountDetails)
            .then(response => {
                if (response.data.success) {
                    message.reply(`Account ${changeType} changed successfully.`);
                } else {
                    message.reply(`Error changing account ${changeType}: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error changing account. Please try again.`);
            });
    }
}

async function accountCreate() {
    message.reply("Reply with your name.")
        .then(data => data.addReplyEvent({ callback: passkeyPrompt, myData: 'myData' }))
        .catch(err => console.error(err));

    function passkeyPrompt({ message, eventData }) {
        const name = `${message.body}`;
        message.reply("Reply with your passkey.")
            .then(data => data.addReplyEvent({ callback: createAccount, myData: { name } }))
            .catch(err => console.error(err));
    };

    function createAccount({ message, eventData }) {
        const passkey = `${message.body}`;
        const { name } = eventData.myData;
        message.send("Creating account, please wait...");

        const accountDetails = { uid: senderID, name, passkey, agent_username };

        axios.post("https://anonchat.xaviabot.repl.co/create_account", accountDetails)
            .then(response => {
                if (response.data.success) {
                    message.reply(`Account created successfully. Welcome, ${name}! Your AnonChat username is ${response.data.anonchat_username}`);
                } else {
                    message.reply(`Error creating account: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error creating account. Please try again.`);
            });
    };
}

async function accountSendReq() {
    message.reply("Reply with your message.")
        .then(data => data.addReplyEvent({ callback: sendRequest, myData: 'myData' }))
        .catch(err => console.error(err));

    function sendRequest({ message, eventData }) {
        const msg = `${message.body}`;
        message.send("Sending request, please wait...");

        const requestDetails = { uid: senderID, agent_username, message: msg };

        axios.post("https://anonchat.xaviabot.repl.co/pair_request/send", requestDetails)
            .then(response => {
                if (response.data.success) {
                    message.reply(`Pairing request sent successfully.`);
                } else {
                    message.reply(`Error sending pairing request: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error sending pairing request. Please try again.`);
            });
    };
}

async function accountAccept() {
    message.reply("Reply with the username of the person you want to pair with.")
        .then(data => data.addReplyEvent({ callback: acceptRequest, myData: 'myData' }))
        .catch(err => console.error(err));

    function acceptRequest({ message, eventData }) {
        const username = `${message.body}`;
        message.send("Accepting request, please wait...");

        const requestDetails = { uid: senderID, username };

        axios.post("https://anonchat.xaviabot.repl.co/pair_request/accept", requestDetails)
            .then(response => {
                if (response.data.success) {
                    message.reply(`Pairing request accepted successfully.`);
                } else {
                    message.reply(`Error accepting pairing request: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error accepting pairing request. Please try again.`);
            });
    };
}

async function accountDismiss() {
    message.reply("Reply with your passkey.")
        .then(data => data.addReplyEvent({ callback: dismissPair, myData: 'myData' }))
        .catch(err => console.error(err));

        function dismissPair({ message, eventData }) {
        const passkey = `${message.body}`;
        message.send("Dismissing pair, please wait...");

        const pairDetails = { 
          uid: message.senderID,
          passkey };

        axios.post("https://anonchat.xaviabot.repl.co/dismiss_pair/dismiss", pairDetails)
            .then(response => {
                if (response.data.success) {
                    message.reply(`Pair dismissed successfully.`);
                } else {
                    message.reply(`Error dismissing pair: ${response.data.message}`);
                }
            })
            .catch(error => {
                message.reply(`Error dismissing pair. Please try again.`);
            });
    };
}
}

export {
    onCall,
    config
}