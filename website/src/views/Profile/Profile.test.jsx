import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Profile } from './Profile';
import '../../utils/tests/test.css';

configure({ adapter: new Adapter() });

describe('Profile View when userData is undefined', () => {
  it('Expect the Profile page to match snap shot', () => {
    const component = renderer.create(
      <Profile />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as student. Empty university with empty requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {},
      universities: {},
      type: 'student',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as student. a university with empty requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {},
      universities: {
        universityName: 'CUNY City College',
      },
      type: 'student',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as student. empty university with a requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {
        universityName: 'CUNY City College',
      },
      universities: {},
      type: 'student',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as student. a university with a requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {
        universityName: 'CUNY City College',
      },
      universities: {
        universityName: 'CUNY City College',
      },
      type: 'student',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as teacher. empty university with empty requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {},
      universities: {},
      type: 'teacher',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as teacher. a university with empty requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {},
      universities: {
        universityName: 'CUNY City College',
      },
      type: 'teacher',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as teacher. empty university with a requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {
        universityName: 'CUNY City College',
      },
      universities: {},
      type: 'teacher',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Profile View when userData is defined as teacher. a university with a requested Class', () => {
  it('Expect the Profile page to match snap shot', () => {
    const wrapper = shallow(<Profile />);
    const userData = {
      requested: {
        universityName: 'CUNY City College',
      },
      universities: {
        universityName: 'CUNY City College',
      },
      type: 'teacher',
    };
    wrapper.setState({ userData });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('When userData is null', () => {
  const wrapper = shallow(<Profile />);
  it('we should find the center-loading-icon class', () => {
    expect(wrapper.exists('.center-loading-icon')).toBe(true);
  });
  it('the card should not exists', () => {
    expect(wrapper.exists('.profile-card')).toBe(false);
  });
});

describe('when userData is defined, but empty element for universities and requested and type is student ', () => {
  const wrapper = shallow(<Profile />);
  const userData = {
    requested: {},
    universities: {
    },
    type: 'student',
  };
  wrapper.setState({ userData });
  it('it should find the card tag', () => {
    expect(wrapper.exists('.profile-card')).toBe(true);
  });
  it('it should not find the center-loading-icon', () => {
    expect(wrapper.exists('.center-loading-icon')).toBe(false);
  });
  it('it should contains the p tag which shows empty university', () => {
    expect(wrapper.contains(<p>{'You haven\'t joined any universities/classes yet.'}</p>)).toBe(true);
  });
  it('it should not contains the p tag which shows joined class', () => {
    expect(wrapper.contains(<p className="academics-subtitle">Joined classes</p>)).toBe(false);
  });
  it('it should contains the p tag which shows empty requested classes message', () => {
    expect(wrapper.contains(<p>No other requested classes.</p>)).toBe(true);
  });
  it('it should not contains the p tag with shows requested classes message', () => {
    expect(wrapper.contains(<p className="academics-subtitle">Requested classes</p>)).toBe(false);
  });
  it('it should has the button for join class', () => {
    expect(wrapper.find({ href: '/class/join' }).length).toBe(1);
  });
  it('it have not has the button for create class', () => {
    expect(wrapper.find({ href: '/class/create' }).length).toBe(0);
  });
});

describe('when userData is defined, but one element for universities and requested and the type is teacher', () => {
  const wrapper = shallow(<Profile />);
  const userData = {
    requested: {
      universityName: 'CUNY City College',
    },
    universities: {
      universityName: 'CUNY City College',
    },
    type: 'teacher',
  };
  wrapper.setState({ userData });
  it('it should not contains the p tag which shows empty university', () => {
    expect(wrapper.contains(<p>{'You haven\'t joined any universities/classes yet.'}</p>)).toBe(false);
  });
  it('it should contains the p tag which shows joined class', () => {
    expect(wrapper.contains(<p className="academics-subtitle">Joined classes</p>)).toBe(true);
  });
  it('it should not contains the p tag which shows empty requested classes message', () => {
    expect(wrapper.contains(<p>No other requested classes.</p>)).toBe(false);
  });
  it('it should contains the p tag with shows requested classes message', () => {
    expect(wrapper.contains(<p className="academics-subtitle">Requested classes</p>)).toBe(true);
  });
  it('it have not has the button for join class', () => {
    expect(wrapper.find({ href: '/class/join' }).length).toBe(0);
  });
  it('it should has the button for create class', () => {
    expect(wrapper.find({ href: '/class/create' }).length).toBe(1);
  });
});
