import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Suite from 'components/suite/suite';
import SuiteSummary from 'components/suite/summary';
import SuiteChart from 'components/suite/chart';
import SuiteList from 'components/suite/list';
import TestList from 'components/test/list';

import basicSuite from 'sample-data/suite.json';
import nestedSuite from 'sample-data/test.json';
import hooksSuite from 'sample-data/hooks-only.json';

chai.use(chaiEnzyme());

describe('<Suite />', () => {
  let props;
  const getInstance = instanceProps => {
    const wrapper = shallow(<Suite { ...instanceProps } />);
    return {
      wrapper,
      chart: wrapper.find(SuiteChart),
      summary: wrapper.find(SuiteSummary),
      testList: wrapper.find(TestList),
      suiteList: wrapper.find(SuiteList),
      header: wrapper.find('.suite-header')
    };
  };

  beforeEach(() => {
    props = {
      className: 'test',
      enableChart: true
    };
  });

  it('renders basic suite', () => {
    const instProps = Object.assign({}, props, {
      suite: basicSuite
    });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(1);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders basic suite without title or filename', () => {
    const newSuite = Object.assign({}, basicSuite, {
      title: '',
      file: ''
    });
    const instProps = Object.assign({}, props, {
      suite: newSuite
    });
    const { wrapper } = getInstance(instProps);
    expect(wrapper.find('.suite-title')).to.have.lengthOf(0);
    expect(wrapper.find('.suite-filename')).to.have.lengthOf(0);
  });

  it('renders basic suite without chart', () => {
    const instProps = Object.assign({}, props, {
      suite: basicSuite,
      enableChart: false
    });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders a suite with only hooks', () => {
    const instProps = Object.assign({}, props, {
      suite: hooksSuite.suites
    });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(0);
  });

  it('renders a suite with only before hooks', () => {
    const suite = Object.assign({}, hooksSuite.suites);
    suite.afterHooks = [];
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(0);
  });

  it('renders a suite with only after hooks', () => {
    const suite = Object.assign({}, hooksSuite.suites);
    suite.beforeHooks = [];
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(0);
  });

  it('renders root suite with tests', () => {
    const suite = Object.assign({}, nestedSuite.suites);
    suite.rootEmpty = false;
    suite.tests = nestedSuite.suites.suites[0].tests;
    const instProps = Object.assign({}, props, { suite });
    const { chart, summary, testList, suiteList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(1);
    expect(summary).to.have.lengthOf(1);
    expect(testList).to.have.lengthOf(1);
    expect(suiteList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(1);
  });

  it('renders root suite without tests', () => {
    const instProps = Object.assign({}, props, {
      suite: nestedSuite.suites
    });
    const { chart, summary, testList, suiteList, header } = getInstance(instProps);
    expect(chart).to.have.lengthOf(0);
    expect(summary).to.have.lengthOf(0);
    expect(testList).to.have.lengthOf(0);
    expect(suiteList).to.have.lengthOf(1);
    expect(header).to.have.lengthOf(0);
  });

  describe('shouldComponentUpdate', () => {
    let scuSpy;
    beforeEach(() => {
      scuSpy = sinon.spy(Suite.prototype, 'shouldComponentUpdate');
    });

    afterEach(() => {
      scuSpy.restore();
    });

    it('returns true when next props do not equal current props', () => {
      const instProps = Object.assign({}, props, {
        suite: basicSuite
      });
      const { wrapper } = getInstance(instProps);
      wrapper.setProps({ suite: nestedSuite.suites });
      expect(scuSpy.calledOnce).to.equal(true);
      expect(scuSpy.returned(true)).to.equal(true);
    });

    it('returns false when next props equal current props', () => {
      const instProps = Object.assign({}, props, {
        suite: basicSuite
      });
      const { wrapper } = getInstance(instProps);
      wrapper.setProps({ suite: basicSuite });
      expect(scuSpy.calledOnce).to.equal(true);
      expect(scuSpy.returned(false)).to.equal(true);
    });
  });
});
