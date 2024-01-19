const express = require('express');
const bodyParser = require('body-parser');

const Notification = require('../models/notification_model');

const notRouter = express.Router();
notRouter.use(bodyParser.json());


notRouter.route('/')
    .get(async (req, res) => {
        try {
            const data = await Notification.find({});
            res.send(data);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });

module.exports = notRouter;