const assert = require('node:assert/strict');
const { hasValidRealmAccessToken } = require('./accountswap');

const tokenFor = (exp) =>
  `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;

global.window = {
  treg: { realm: { Oidc: { getUser: () => ({ access_token: tokenFor(Date.now() / 1000 + 60) }) } } },
  localStorage: { getItem: () => null },
};
assert.equal(hasValidRealmAccessToken(), true);
window.treg.realm.Oidc.getUser = () => ({ access_token: tokenFor(Date.now() / 1000 - 60) });
assert.equal(hasValidRealmAccessToken(), false);
delete global.window;
