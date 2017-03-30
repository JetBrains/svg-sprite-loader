const chai = require('chai');

chai.should();

global.jestExpect = global.expect;
global.expect = chai.expect;
