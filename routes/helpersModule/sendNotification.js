// const user = require('../../model/API/Users');
// const chunks = require('array.chunk');
// const gcm = require('node-gcm');
// // const sender = new gcm.Sender('AAAAz-Vezi4:APA91bHNVKatfjZiHl13fcF1xzWK5pLOixdZlHE8KVRwIxVHLJdWGF973uErxgjL_HkzzD1K7a8oxgfjXp4StlVk_tNOTYdFkSdWe6vaKw6hVEDdt0Dw-J0rEeHpbozOMXd_Xlt-_dM1');
// const sender = new gcm.Sender(process.env.FIREBASE_SENDER_KEY);

// module.exports = async function (req, res, sumDgit, uesrtoken) {
//     try
//     {
//         const x = req.body.gameId;
//         const str = req.body.providerId;
//         let data = '';
//         let name = '';
//         if(str){ data = str.split("|");   name = data[1];}
//         let winningDigit = sumDgit;
//         let title = '';
//         let body = '';
//         let token = uesrtoken;
//         let notificationType = '';
//         switch(x) {
//             case '1':
//                 token = await user.find({ banned : false, andarBaharNotification: true }, {firebaseId : 1,_id:0});
//                 title = winningDigit;
//                 body = name; 
//                 notificationType = "Result";
//                 break;
//             case '2':
//                 token = await user.find({ banned : false, starLineNotification: true }, {firebaseId : 1,_id:0});;
//                 title = winningDigit;
//                 body = name;              
//                 notificationType = "Result";
//                 break;
//             case '3':
//                 token = await user.find({ banned : false, gameNotification: true }, {firebaseId : 1,_id:0});;
//                 title = winningDigit;
//                 body = name;              
//                 notificationType = "Result";

//                 break;
//             case '4':
//                 token = await user.find({ banned : false, mainNotification: true }, {firebaseId : 1,_id:0});
//                 title = req.body.message;
//                 body = req.body.title;
//                 notificationType = "Notification";
//                 break;
//             default : 
//                 body  = 'Congrats For Your '+ winningDigit +' Game Win';
//                 title = 'Points Successfully Credited To Your Wallet For '+ winningDigit  +' Win';
//                 notificationType = "Wallet";
//                 break;
//             }

//             var message = new gcm.Message({
//                 priority: 'high',
//                 data: {
//                     title: title,
//                     icon: "ic_launcher",
//                     body: body,
//                     type: notificationType
//                 }
//             });
//             let length  = token.length;
//             if(length > 1000){
//                 const userToken = token.map(token => token.firebaseId); 
//                 console.log(userToken,'if condition')
//                 token = chunks(userToken, 1000);
//                 let newLength = token.length;
//                 for(j = 0 ; j < newLength; j++)
//                 {
//                     let tokenArr = token[j];

//                     sender.send(message, { registrationTokens: tokenArr }, function (err, response) {
//                         if (err) console.log(err);
//                         else console.log(response);
//                     });
//                 }
//             }
//             else{
//                 const userToken = token.map(token => token.firebaseId); 
//                 console.log(userToken,'else condition')
//                 sender.send(message, { registrationTokens: userToken }, function (err, response) {
//                     if (err) console.log(err,'error');
//                     else console.log(response) ;
//                 });
//             }
//         }
//     catch (e) {
//         console.log(e)
//     //    return e;
//     }
// };

const user = require('../../model/API/Users');
const chunks = require('array.chunk');
const admin = require("../../firebase");
// const gcm = require('node-gcm');
// const sender = new gcm.Sender('AAAAz-Vezi4:APA91bHNVKatfjZiHl13fcF1xzWK5pLOixdZlHE8KVRwIxVHLJdWGF973uErxgjL_HkzzD1K7a8oxgfjXp4StlVk_tNOTYdFkSdWe6vaKw6hVEDdt0Dw-J0rEeHpbozOMXd_Xlt-_dM1');
// const sender = new gcm.Sender(process.env.FIREBASE_SENDER_KEY);

module.exports = async function (req, res, sumDgit, uesrtoken) {
    try {
        const x = req.body.gameId;
        const str = req.body.providerId;
        let data = '';
        let name = '';
        if (str) { data = str.split("|"); name = data[1]; }
        let winningDigit = sumDgit;
        let title = '';
        let body = '';
        let token = uesrtoken;
        let notificationType = '';
        if (x == '1' || x == '2' || x == '3' || x == '4') {
            switch (x) {
                case '1':
                    token = await user.find({ banned: false, andarBaharNotification: true }, { firebaseId: 1, _id: 0 });
                    title = name;
                    body = winningDigit;
                    notificationType = "Result";
                    break;
                case '2':
                    token = await user.find({ banned: false, starLineNotification: true }, { firebaseId: 1, _id: 0 });;
                    title = name;
                    body = winningDigit;
                    notificationType = "Result";
                    break;
                case '3':
                    token = await user.find({ banned: false, gameNotification: true }, { firebaseId: 1, _id: 0 });;
                    title = name;
                    body = winningDigit;
                    notificationType = "Result";

                    break;
                case '4':
                    token = await user.find({ banned: false, mainNotification: true }, { firebaseId: 1, _id: 0 });
                    title = req.body.title;
                    body = req.body.message;
                    notificationType = "Notification";
                    break;
            }
            let length = token.length;
            if (length > 1000) {
                const userToken = token.map(token => token.firebaseId);
                token = chunks(userToken, 1000);
                let newLength = token.length;
                for (j = 0; j < newLength; j++) {
                    let tokenArr = token[j];
                    // sender.send(message, { registrationTokens: tokenArr }, function (err, response) {
                    //     if (err) console.log(err);
                    //     else console.log(response);
                    // });
                    sendMutipalNotification(tokenArr, title, body, notificationType)
                }
            }
            else {
                const userToken = token.map(token => token.firebaseId);
                // sender.send(message, { registrationTokens: userToken }, function (err, response) {
                //     if (err) console.log(err, 'error');
                //     else console.log(response);
                // });
                sendMutipalNotification(userToken, title, body, notificationType)
            }
        } else {
            for (let i = 0; i < token.length; i++) {
                // var message = new gcm.Message({
                //     priority: 'high',
                //     data: {
                //         title: `${token[i].amount}/-rs Successfully Added To Your Wallet..`,
                //         icon: "ic_launcher",
                //         body: `🥳CONGRATS FOR ${winningDigit} GAME WIN 🎉`,
                //         type: "Wallet"
                //     }
                // });
                // sender.send(message, { registrationTokens: [token[i].firebaseId] }, function (err, response) {
                //     if (err) console.log(err);
                //     else console.log(response);
                // });
                let  priority='high'
                const message = {
                    notification: {
                        title: `🥳CONGRATS FOR ${winningDigit} GAME WIN 🎉`,
                        body: `${token[i].amount}/-rs Successfully Added To Your Wallet..`,
                    },
                    data: {
                        type: "Wallet"
                    },
                    android: {
                        priority: priority  // Setting the priority for Android
                    },
                    apns: {
                        payload: {
                            aps: {
                                'content-available': 1,
                                'priority': priority === 'high' ? 10 : 5  // Setting the priority for iOS
                            }
                        }
                    },
                    token: token[i].firebaseId
                };
                try {
                    const response = await admin.messaging().send(message);
                } catch (error) {
                    console.log('Error sending message:', error);
                }
            }
        }
    }
    catch (e) {
        console.log(e)
        //    return e;
    }
};

const sendMutipalNotification = async (tokenArr, title, body, notificationType) => {
    let priority = 'high'
    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            type: notificationType
        },
        android: {
            priority: priority  // Setting the priority for Android
        },
        apns: {
            payload: {
                aps: {
                    'content-available': 1,
                    'priority': priority === 'high' ? 10 : 5  // Setting the priority for iOS
                }
            }
        },
    };
    try {
        const response = await admin.messaging().sendMulticast({
            tokens: tokenArr,
            ...message
        });
    } catch (error) {
        console.log('Error sending message:', error);
    }
}