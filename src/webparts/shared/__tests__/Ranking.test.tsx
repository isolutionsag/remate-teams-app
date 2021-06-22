/// <reference types="jest" />

import * as React from 'react';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as renderer from 'react-test-renderer';
import GraphServiceFake from 'services/GraphServiceFake';
import Ranking from '../Ranking/Ranking';
import RankingServiceFake from 'services/RankingServiceFake';


configure({ adapter: new Adapter() });

describe('Ranking', () => {

  beforeEach(() => {
    
  });

  it('should render properly', () => {
    const graphService = new GraphServiceFake();
    const rankingService = new RankingServiceFake();

    const tree = renderer.create(<Ranking 
      graphService={graphService}
      rankingService={rankingService}
      
    />).toJSON();

    expect(tree).toMatchSnapshot();
  });


});