const webPush = require('web-push');
const fs = require('fs');
const vapidKeys = webPush.generateVAPIDKeys();
fs.writeFileSync('scripts/keys.json', JSON.stringify(vapidKeys, null, 2));
console.log('Keys written to scripts/keys.json');
