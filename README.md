# AnonChat Plugin Documentation

Welcome to the AnonChat Plugin Documentation. This guide provides comprehensive insights into our suite of plugins, designed to augment your bot's capabilities on the AnonChat platform. Let's explore each plugin and delve into their functionalities.

## AnonChat.js

The `anonchat.js` plugin is your key to customizing AnonChat account settings. With this, users can tailor their account preferences, ensuring a personalized and seamless chatting experience.

## AnonChat_msg.js & AnonChat_auto.js

The `anonchat_msg.js` and `anonchat_auto.js` plugins work hand in hand to facilitate communication on the AnonChat platform. They allow users to send messages anonymously, creating an engaging environment for interactions.

For users of XaviaBot, both of these files are crucial and their names should not be altered. The `anonchat_auto.js` is essentially a part of `anonchat_msg.js` and should be saved in the `onMessage` folder. This setup allows the use of `anonchat_msg.js` without explicitly invoking it. Users can easily toggle it on or off using the `xac on/off` command.

## Integration Guide

### Bot Integration

To add the AnonChat API to your bot, you'll need to update your `app.js` file with the following code:

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

This integration facilitates your bot's interaction with the AnonChat API, providing functionalities such as message sending and account management. Be sure to conduct thorough testing to ensure optimal user experience.

### Bot Agent Registration

To register your bot agent, reach out to us via [Facebook](https://www.facebook.com/LEEMINHTAKI). During registration, provide the URL of your listening server. Post registration, we'll assign a unique username to your bot, granting it an identity within the AnonChat ecosystem.

Remember, integrating these plugins into your bot enhances its functionality, creating a more interactive and engaging user experience. Enjoy exploring the possibilities with AnonChat Plugins!
