/// <reference types="jest" />

import * as React from 'react';
import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as renderer from 'react-test-renderer';

import DraggableName from '../components/DraggableName/DraggableName';


configure({ adapter: new Adapter() });

describe('DraggableName', () => {

  beforeEach(() => {
    
  })

  it('should render properly', () => {
   
    const tree = renderer.create(<DraggableName 
      blocked={false}
      employee={{
          displayName: 'John Doe', id: 'xxx', mail: 'xxx', initials: 'JD'
      }}/>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render the user display name', () => {

    const wrapper = shallow(<DraggableName 
      blocked={false}
      employee={{
          displayName: 'John Doe', id: 'xxx', mail: 'xxx', initials: 'JD'
      }}/>);

    
    expect(wrapper.text()).toContain("John Doe");
  });

  it('should not allow user to drag when blocked', () => {

    const wrapper = shallow(<DraggableName 
      blocked={true}
      employee={{
          displayName: 'John Doe', id: 'xxx', mail: 'xxx', initials: 'JD'
      }}/>);

    
    expect(wrapper.find('div[draggable=true]')).toHaveLength(0);
  });

  it('should allow user to drag when not blocked', () => {

    const wrapper = shallow(<DraggableName 
      blocked={false}
      employee={{
          displayName: 'John Doe', id: 'xxx', mail: 'xxx', initials: 'JD'
      }}/>);

    
    expect(wrapper.find('div[draggable=true]')).toHaveLength(1);
  });

});