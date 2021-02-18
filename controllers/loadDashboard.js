const DashboardEvent = require('../models/DashboardEvent');

module.exports = async (req, res) => {
    console.log('Load request received.');

    // Create a new event entry in the database
    const dashboardEvent = await DashboardEvent.create({
        dashboardId: req.body['environment']['dashboard']['uid'],
        user: req.body['context']['login'],
        startDate: Date(req.body['time'] * 1000),
        userSettings: {
            lightTheme: req.body['context']['lightTheme'],
            timezone: req.body['context']['timezone'],
            locale: req.body['context']['locale']
        }
    })

    console.log('ID assigned: %s', dashboardEvent._id);

    // Return success with the resulting object ID
    res.json({ location: dashboardEvent._id });
    res.statusCode = 201;
    res.end();
};
