const DashboardEvent = require('../models/DashboardEvent');

module.exports = async (req, res, next) => {
    switch (req.body['type']) {
        case 'start':
            console.log(req.body);
            console.log("'%s'-event received for UUID %s", req.body['type'], req.body['uuid']);
            // Create a new event entry in the database
            const dashboardEvent = DashboardEvent({
                _id: req.body['uuid'],
                dashboardId: req.body['dashboard']['uid'],
                user: req.body['user']['login'],
                startDate: new Date(req.body['time'] * 1000),
                lastSeen: new Date(req.body['time'] * 1000),
                userSettings: {
                    lightTheme: req.body['user']['lightTheme'],
                    timezone: req.body['user']['timezone'],
                    locale: req.body['user']['locale']
                }
            })
            dashboardEvent.save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        status: "success",
                        data: {
                            uuid: result._id,
                            sessionDuration: 0,
                            logged_time: result.lastSeen.getTime() / 1000
                        },
                        message: ""
                    });
                })
                .catch(err => {
                    console.log(err)
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // Duplicate UUID
                        const error = Error("Duplicate UUID");
                        error.statusCode = 422;
                        next(error);
                    }
                    else {
                        next(err);
                    }
                });
            break;

        case 'heartbeat':
        case 'end':
            console.log("'%s'-event received for UUID %s", req.body['type'], req.body['uuid']);
            // Get the corresponding dashboard event
            var event = await DashboardEvent.findOne({ _id: req.body['uuid'] });
            // Set lastSeen and calculate session duration before updating the DB
            if (event) {
                event.lastSeen = new Date(req.body['time'] * 1000);
                event.sessionDuration = (event.lastSeen.getTime() - event.startDate.getTime()) / 1000;
                if (req.body['type'] === 'end') {
                    if (event.endDate) {
                        // Session already ended
                        const error = Error("Session already ended");
                        error.statusCode = 422;
                        next(error);
                    }
                    event.endDate = event.lastSeen
                }
            }
            else {
                // If no event is found we create one
                event = DashboardEvent({
                    _id: req.body['uuid'],
                    dashboardId: req.body['dashboard']['uid'],
                    user: req.body['user']['login'],
                    startDate: new Date(req.body['time'] * 1000),
                    lastSeen: new Date(req.body['time'] * 1000),
                    userSettings: {
                        lightTheme: req.body['user']['lightTheme'],
                        timezone: req.body['user']['timezone'],
                        locale: req.body['user']['locale']
                    },
                    sessionDuration: 0
                })
                if (req.body['type'] === 'end') {
                    event.endDate = event.lastSeen
                }
            }
            event.save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        status: "success",
                        data: {
                            uuid: result._id,
                            logged_time: result.lastSeen.getTime() / 1000,
                            sessionDuration: result.sessionDuration
                        },
                        message: ""
                    });
                })
                .catch(err => {
                    console.log(err)
                    next(err);
                });
            break;

        default:
            const error = Error("Missing or unknown type");
            error.statusCode = 422;
            next(error);
            break;
    }
};
