const Notification = require('../../models/notification_model');

const getNotifications = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            title: 1,
            message: 1,
            createdAt: 1
        };
        const notifications = await Notification.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(notifications).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const putNotification = async (req, res) => {
    try {
        const { _id, title, message } = req.body;
        if (!_id) {
            const notification = new Notification({ title, message });
            await notification.save();
            return res.status(201).json(notification).send();
        }
        else {
            const notification = await Notification.findOne({ _id });
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            notification.title = title;
            notification.message = message;
            const data = await notification.save();
            res.status(201).json(data).send();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}

const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findOne({ _id: notificationId });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await Notification.deleteOne({ _id: notificationId });
        res.status(200).json("Notification deleted successfully").send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error").send();
    }
}


module.exports = { getNotifications, putNotification, deleteNotification };