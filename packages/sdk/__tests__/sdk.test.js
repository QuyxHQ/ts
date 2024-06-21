'use strict';

const sdk = require('..');
const assert = require('assert').strict;

assert.strictEqual(sdk(), 'Hello from sdk');
console.info('sdk tests passed');
