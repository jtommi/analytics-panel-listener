const mongoose = require('mongoose');

const { Schema } = mongoose;

const DashboardEventSchema = new Schema({
    _id: {
        type: String
    },
    dashboardId: {
        type: mongoose.Schema.Types.String,
        ref: 'dashboardId',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.String,
        ref: 'user',
        required: true,
    },
    userSettings: {
        lightTheme: Boolean,
        timezone: String,
        locale: String
    },
    startDate: {
        type: Date,
        default: new Date(),
        required: true,
    },
    lastSeen: {
        type: Date,
        default: new Date(),
        required: true,
    },
    endDate: {
        type: Date,
        default: null,
        required: false,
    },
    sessionDuration: mongoose.Schema.Types.Number
}, {
    versionKey: false
});

module.exports = mongoose.model('DashboardEvent', DashboardEventSchema);
