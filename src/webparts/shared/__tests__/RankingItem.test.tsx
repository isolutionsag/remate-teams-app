/// <reference types="jest" />

import * as React from 'react';
import { configure, mount, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import RankingItem from 'webparts/shared/RankingItem/RankingItem';
import * as renderer from 'react-test-renderer';
import GraphServiceFake from 'services/GraphServiceFake';


configure({ adapter: new Adapter() });

describe('RankingItem', () => {

  const rankingItem = {
    rankedPoints: 30,
    rankedGames: 2,
    user: {
        id: 'xxx',
        displayName: 'John Doe',
        mail: 'xxx',
        initials: 'xxx',
        jobTitle: 'xxx',
        officeLocation: 'xxx',
        impostor: false,
        voted: false,
        blocked: false
    },
    position: 3
};

  beforeEach(() => {
    
  });

  it('should render properly', () => {
    const graphService = new GraphServiceFake();

    const tree = renderer.create(<RankingItem graphService={graphService}
      position={1}
      rankingInfo={rankingItem}
      isCurrentUser={true}
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render the user display name', () => {

    const graphService = new GraphServiceFake();

    const wrapper = shallow(<RankingItem graphService={graphService}
      position={1}
      rankingInfo={rankingItem}
      isCurrentUser={true}
    />);

    
    expect(wrapper.text()).toContain("John Doe");
  });

});