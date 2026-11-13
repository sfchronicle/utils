const assert = require('assert')
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const os = require('os')
const source = fs.readFileSync(path.join(__dirname, 'copy/c2p_sheet.js'), 'utf8')
let copied
let writes
const api = { spreadsheets: { values: {
  get: (opts, callback) => callback(null, { data: { values: [['Market_Key', 'Slug', 'Paywall']] } }),
  batchUpdate: (opts, callback) => { writes = opts.resource.data; callback(null, {}) }
} } }
const drive = { files: { copy: (opts, callback) => { copied = opts.fileId; callback(null, { data: { id: 'new-sheet' } }) } }, permissions: { create: (opts, callback) => callback(null, {}) } }
const fakeRequire = name => ({ googleapis: { google: { sheets: () => api, drive: () => drive } }, write: () => {}, './googleauth': { authenticate: async () => ({}) }, fs: { readFileSync: () => '{"gmail":"test@example.com"}' }, os, path })[name]
const moduleObject = { exports: {} }
vm.runInNewContext(source, { require: fakeRequire, module: moduleObject, console: { log() {} } })
async function main() {
  const config = () => ({ PROJECT: { SLUG: 'test', MARKET_KEY: 'SFC', SUBFOLDER: 'projects/2026' } })
  await moduleObject.exports.googleAuth(config())
  assert.equal(copied, '1DUvYnFdxtBv1AXcDI9X00s_opUSu4uHJmd5LNemCN9E')
  await moduleObject.exports.googleAuth(config(), 'new-template')
  assert.equal(copied, 'new-template')
  assert(writes.some(write => write.range === 'story_settings!R2C2' && write.values[0][0] === 'test'))
  assert(!writes.some(write => write.range === 'story_settings!R2C3'))
  console.log('Sheet template selection checks passed')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
