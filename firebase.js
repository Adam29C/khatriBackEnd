const admin = require('firebase-admin');
const serviceAccount = require('./khatri555-firebase-adminsdk-n0lyi-afc7af4bfd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.messaging();;
