const deepFreeze = require("deep-freeze");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));
chai.use(require("chai-subset"));
const sinon = require("sinon");
chai.use(require("sinon-chai"));
const Bottle = require("bottlejs");
const proxyquire = require("proxyquire");
const lolex = require("lolex");

const statics = {
  chai, expect, sinon, deepFreeze, Bottle,
  proxyquire,
  lolex,
};

function setup() {
  return { ...statics, bottle: new Bottle };
}

module.exports = setup;
