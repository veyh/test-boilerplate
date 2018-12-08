const deepFreeze = require("deep-freeze");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));
chai.use(require("chai-subset"));
const sinon = require("sinon");
chai.use(require("sinon-chai"));
const Bottle = require("bottlejs");
const enzyme = require("enzyme");
enzyme.configure({ adapter: new (require("enzyme-adapter-react-16")) });
const { shallow } = enzyme;
chai.use(require("chai-enzyme"));
const proxyquire = require("proxyquire");
const lolex = require("lolex");

const statics = {
  chai, expect, sinon, deepFreeze, Bottle,
  enzyme, shallowUntilTarget,
  proxyquire,
  lolex,
}

function setup() {
  return { ...statics, bottle: new Bottle };
}

module.exports = setup;

/*
 * From https://github.com/mozilla/addons-frontend/blob/58d1315409f1ad6dc9b979440794df44c1128455/tests/unit/helpers.js#L276
 *
 * Repeatedly render a component tree using enzyme.shallow() until
 * finding and rendering TargetComponent.
 *
 * This is useful for testing a component wrapped in one or more
 * HOCs (higher order components).
 *
 * The `componentInstance` parameter is a React component instance.
 * Example: <MyComponent {...props} />
 *
 * The `TargetComponent` parameter is the React class (or function) that
 * you want to retrieve from the component tree.
 */
function shallowUntilTarget(componentInstance, TargetComponent, {
  maxTries = 10,
  shallowOptions,
  _shallow = shallow,
} = {}) {
  if (!componentInstance) {
    throw new Error('componentInstance parameter is required');
  }
  if (!TargetComponent) {
    throw new Error('TargetComponent parameter is required');
  }

  let root = _shallow(componentInstance, shallowOptions);

  if (typeof root.type() === 'string') {
    // If type() is a string then it's a DOM Node.
    // If it were wrapped, it would be a React component.
    throw new Error(
      'Cannot unwrap this component because it is not wrapped');
  }

  for (let tries = 1; tries <= maxTries; tries++) {
    if (root.is(TargetComponent)) {
      // Now that we found the target component, render it.
      return root.shallow(shallowOptions);
    }
    // Unwrap the next component in the hierarchy.
    root = root.dive();
  }

  throw new Error(oneLine`Could not find ${TargetComponent} in rendered
    instance: ${componentInstance}; gave up after ${maxTries} tries`
  );
}
