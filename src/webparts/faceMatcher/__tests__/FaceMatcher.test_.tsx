// /// <reference types="jest" />

// import * as React from 'react';
// import { configure, mount, ReactWrapper, shallow } from 'enzyme';
// import * as Adapter from 'enzyme-adapter-react-16';
// import * as renderer from 'react-test-renderer';

// import DraggableName from '../components/DraggableName/DraggableName';
// import IFaceMatcherProps from '../components/FaceMatcher/IFaceMatcherProps';
// import FaceMatcher from '../components/FaceMatcher/FaceMatcher';
// import GraphServiceFake from 'services/GraphServiceFake';
// import RankingServiceFake from 'services/RankingServiceFake';


// configure({ adapter: new Adapter() });

// describe('FaceMatcher', () => {

//   let reactComponent: ReactWrapper<IFaceMatcherProps, {}>;  

//   beforeEach(() => {
//     reactComponent = mount(React.createElement(  
//       FaceMatcher,  
//       {  
//         graphService: new GraphServiceFake(),
//         rankingService: new RankingServiceFake()  
//       }  
//     ));  
//   })

//   afterEach(() => {  
//     reactComponent.unmount();  
//   });  

//   it('should render properly', () => {
   
//    // define the css selector  
//     let cssSelector: string = 'div';  
  
//     // find the element using css selector  
//     const element = reactComponent.find(cssSelector);  
//     expect(element.length).toBeGreaterThan(0);  
//   });

// });