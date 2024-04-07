const MOT = require("../../models/mot_model");


const getMOTResources = async (req, res) => {
    try {
        const limit = 10;
        let page = req.query.page;
        if (!page || page < 1) {
            page = 1;
        }
        const projection = {
            _id: 1,
            description: 1,
            price: 1,
            motNumber: 1,
        };
        const user = await MOT.find({}, projection).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const putMOTResource = async (req, res) => {
    try {
        const { _id, description, price, motNumber } = req.body;
        if (!_id) {
            const mot = new MOT({ description, price, motNumber });
            await mot.save();
            res.status(201).json(mot);
        }
        const mot = await MOT.findOne({ _id });
        if (!mot) {
            return res.status(404).json({ error: 'MOT not found' });
        }
        mot.description = description;
        mot.price = price;
        mot.motNumber = motNumber;
        const data = await mot.save();
        res.status(201).json(data);        
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

const deleteMOTResource = async (req, res) => {
    try {
        const motId = req.params.id;
        const mot = await MOT.findOne({ _id: motId });
        if (!mot) {
            return res.status(404).json({ error: 'MOT not found' });
        }
        await MOT.deleteOne({ _id: motId });
        res.status(200).json("MOT deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { getMOTResources, deleteMOTResource, putMOTResource };