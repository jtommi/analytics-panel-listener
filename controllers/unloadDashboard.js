const DashboardEvent = require('../models/DashboardEvent');

module.exports = async (req, res) => {
    console.log('Unload request received for %s', req.params.id);

    // Get the corresponding dashboard event
    var event = await DashboardEvent.findOne({ _id: req.params.id });
    // Set endDate and calculate session duration before updating the DB
    event.endDate = Date(req.body['time'] * 1000);
    event.sessionDuration = (event.endDate.getTime() - event.startDate.getTime()) / 1000;
    event.save();

    // Return success
    res.statusCode = 201;
    res.end();
};