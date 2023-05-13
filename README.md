# AnonChat Plugins Documentation

Welcome to the AnonChat Plugins documentation. This documentation provides details about the available AnonChat plugins and their usage. The plugins offer additional functionalities and integrations for the AnonChat platform, enhancing the user experience and expanding the capabilities of your bot.

## Available Plugins

### AnonChat.js

The `anonchat.js` plugin enables AnonChat account settings. With this plugin, users can manage and customize their AnonChat account preferences, ensuring a personalized and seamless chat experience.

### AnonChat_msg.js

The `anonchat_msg.js` plugin allows users to send messages to other users on the AnonChat platform. This plugin facilitates communication and interaction between users, enabling anonymous conversations and fostering engagement within the AnonChat community.

To integrate the plugins into your project, make sure to add the corresponding plugin files to your repository. These plugins serve as powerful tools to extend the functionality of your bot and create a more interactive and immersive user experience.

## Integration with Your Bot

To integrate the AnonChat API with your bot, ensure that your `app.js` file is updated with the following code snippet:

```javascript
// AnonChat API integration for XaviaBot

app.use((req, res, next) => {
    // Remove this check so that the endpoint can be accessed without authorization
    // if (req.headers['xva-access-token'] != serverAdminPassword) return res.status(401).send('Unauthorized');
    next();
});

app.post('/sendToUser', async (req, res) => {
    const { uid, message } = req.body;
    if (!uid || !message) return res.status(400).send('Bad Request');

    try {
      const messageInfo = await global.api.sendMessage(message, uid);
      return res.status(200).json({ messageInfo });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
});

// AnonChat API integration for GoatBot

app.post('/sendToUser', async (req, res) => {
  let { uid: userID, message } = req.body;
  if (!userID || !message) return res.status(400).send('Bad Request');

  try {
    const messageInfo = await api.sendMessage({ body: message }, userID);
    return res.status(200).json({ messageInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});
```

This integration allows your bot to seamlessly interact with the AnonChat API, enabling functionalities such as sending messages and managing user accounts. Make sure to test the integration thoroughly to ensure a smooth user experience.

## Registration of Bot Agent

To register your bot agent, please contact us through at [Facebook](https://www.facebook.com/LEEMINHTAKI). When registering, provide the URL of your listening server. Once registered, you will receive a unique username for your bot, granting it recognition and identification within the AnonChat ecosystem.

