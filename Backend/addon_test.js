import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const addon = require('../Cpp/build/Release/addon');

console.log(addon.hello());