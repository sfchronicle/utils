#!/usr/bin/env node

const { googleAuth } = require('../../copy/sheets')
const project = require('../project-config.json')

/*
 * The sheets googleAuth function uses the Google Sheets API to pull data from Sheets and load it onto shared
 * state. Writes the data out to JSON for later reference. Does not currently
 * check for existing data to merge--it does a fresh pull every time.
 * Sheets must be shared with the service account email before they can be accessed with this task
 * @param {object} project standard object from project-config.json or project.json
 * @param {string} directory optional alternate path to directory in which to save the output
 * @param {bool} forces all values to strings if true

*/

googleAuth(project, null, true)
