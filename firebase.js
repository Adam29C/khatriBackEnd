const admin = require('firebase-admin');
//const serviceAccount = require('./khatri555-firebase-adminsdk-n0lyi-afc7af4bfd.json');
const serviceAccount = require("./khatri-dc19d-firebase-adminsdk-rwip0-524330e408.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.messaging();;
