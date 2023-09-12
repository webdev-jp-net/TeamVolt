// api/sendNotification.js
const admin = require('firebase-admin');

// Initialize only if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
  });
}

module.exports = async (req, res) => {
  const message = {
    notification: {
      title: 'Hello',
      body: 'World',
    },
    token: req.body.token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    res.json({ success: false, error });
  }
};
