# Macropower-analytics-panel-listener

This is a server that listens for events from the Grafana plugin [macropower-analytics-panel](https://grafana.com/grafana/plugins/macropower-analytics-panel?src=tw) ([Github](https://github.com/MacroPower/macropower-analytics-panel))

## What does it do

The app receives a POST request when a Grafana dashboard containing the Analytics Panel is loaded.  
The app stores a new event with the provided UUID in the database.
It can also handle heartbeat events sent by the plugin, which will the update the lastseen date and session duration for that UUID.
Once the dashboard gets properly unloaded (closing the tab won't work), a last POST request is received and the app updates the endtime and session duration of the load event.

## Requirements

This app is specifically designed to work with the [macropower-analytics-panel](https://grafana.com/grafana/plugins/macropower-analytics-panel?src=tw).  
Furthermore this app only works with version 2.x and up of the plugin.  
If you are using version 1.x of the plugin, checkout this previous release: [works_with_1.1.1](https://github.com/jtommi/analytics-panel-listener/releases/tag/works_with_1.1.1)  
The app currently only supports MongoDB for backend storage.

## Configuration

The database settings have to be defined through environment variables.  
The list of variables can be found in [devcontainer.env.sample](.devcontainer/devcontainer.env.sample).  
If you want to use this with the devcontainer functionality of VSCode, simply remove the ".sample" from the end.  
