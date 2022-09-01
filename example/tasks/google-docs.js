#!/usr/bin/env node

const { googleAuth } = require('../../copy/docs')
const project = require('../project-config.json')

/*

  * The docs googleAuth function uses the Google Drive API to parse Google Doc with ArchieML generate JSON file
  * Docs must be shared with the service account email before they can be accessed with this task
  * @param {object} config standard object from project-config.json or project.json
  * @param {string} directory optional alternate path to directory in which to save the output
  * @param {array} filenames optional array of objects with name and id key/values used to specify a filename for a specific doc

 */

googleAuth(project)
