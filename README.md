# Macropower-analytics-panel-listener

This is a server that listens for events from the Grafana plugin [macropower-analytics-panel](https://grafana.com/grafana/plugins/macropower-analytics-panel?src=tw)

## What does it do

The app receives a POST request when a Grafana dashboard containing the Analytics Panel is loaded.  
The app stores a new event in the database and replies with the newly created object ID.  
Once the dashboard gets properly unloaded (closing the tab won't work), a second POST request is received and the app updates the endtime and session duration of the load event.

## Requirements

This app is specifically designed to work with the macropower plugin.  
It currently only supports MongoDB for backend storage.

## Configuration

The database settings have to be defined through environment variables.  
The list of variables can be found in [devcontainer.env.sample](.devcontainer/devcontainer.env.sample).  
If you want to use this with the devcontainer functionality of VSCode, simply remove the ".sample" from the end.  
