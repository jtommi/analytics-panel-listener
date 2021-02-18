const DashboardEvent = require('../models/DashboardEvent');

module.exports = async (req, res) => {
    switch (req.body['type']) {
        case 'start':
            console.log("'start'-event received for UUID %s", req.body['uuid']);
            // Create a new event entry in the database
            const dashboardEvent = await DashboardEvent.create({
                _id: req.body['uuid'],
                dashboardId: req.body['dashboard']['uid'],
                user: req.body['user']['login'],
                startDate: Date(req.body['time'] * 1000),
                lastSeen: Date(req.body['time'] * 1000),
                userSettings: {
                    lightTheme: req.body['user']['lightTheme'],
                    timezone: req.body['user']['timezone'],
                    locale: req.body['user']['locale']
                }
            })
            break;

        case 'heartbeat':
            console.log("'heartbeat'-event received for UUID %s", req.body['uuid']);
            // Get the corresponding dashboard event
            var event = await DashboardEvent.findOne({ _id: req.body['uuid'] });
            // Set lastSeen and calculate session duration before updating the DB
            event.lastSeen = Date(req.body['time'] * 1000);
            event.sessionDuration = (event.lastSeen.getTime() - event.startDate.getTime()) / 1000;
            event.save();
            break;

        case 'end':
            console.log("'end'-event received for UUID %s", req.body['uuid']);
            // Get the corresponding dashboard event
            var event = await DashboardEvent.findOne({ _id: req.body['uuid'] });
            // Set endDate and calculate session duration before updating the DB
            event.endDate = Date(req.body['time'] * 1000);
            event.sessionDuration = (event.endDate.getTime() - event.startDate.getTime()) / 1000;
            event.save();
            break;

        default:
            break;
    }

    res.statusCode = 201;
    res.end();
};
