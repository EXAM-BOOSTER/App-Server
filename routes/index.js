var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(`
    <html>
      <head>
        <title>Server Information</title>
      </head>
      <body>
        <h1>Check your URL</h1>
        <p>Permission Denied!</p>
        <p>Server Name: App Server</p>
        <p>Server Version: 1.0.0</p>
        <p>Server Status: Online</p>
      </body>
    </html>
  `);
});

module.exports = router;
