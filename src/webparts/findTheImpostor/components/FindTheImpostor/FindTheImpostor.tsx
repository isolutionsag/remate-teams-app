import * as React from 'react';
import styles from './FindTheImpostor.module.scss';
import { IFindTheImpostorProps } from './IFindTheImpostorProps';
import GraphService from 'services/GraphService';
import { Dropdown, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import EmployeeSelectionPanel  from '../EmployeeSelectionPanel/EmployeeSelectionPanel';
import { useEffect, useState } from 'react';
import Ranking from 'webparts/shared/Ranking/Ranking';

const FindTheImpostor: React.FunctionComponent<IFindTheImpostorProps> = props => {

  const [loaded, setLoaded] = useState(false);
  const [impostorsCount, setImpostorsCount] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  
  const _getGroups = async (): Promise<void> => {
    // const service = new GraphService(props.graphService);
    const _groups: Array<any> = await props.graphService.getAllGroups();
    
    setGroups(_groups);
    setLoaded(true);
  };

  useEffect(() => {
    _getGroups();
  }, []);

  const selectImpostorsCount = (_impostorsCount: number) => {
    setImpostorsCount(_impostorsCount);
  };

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: any) => {
    setSelectedGroup({ id: item.key, mailNickname: item.text });
  };

  return (
    <div className={styles.findTheImpostor}>
    <p>
      Your team is in a secret mission and you all have been boarded into a spaceship to accomplish it. While you are in the far space, you get an anonymous message informing that one or various members of the crew are impostors and want to sabotage the whole mission. Will you be able to detect who or whom are the impostors in less than three attempts?
    </p>

    {!loaded ? 
    <Spinner size={SpinnerSize.large} label='Loading groups...' />
    :
    !impostorsCount ? 
    <>
      <p>Choose with how many impostors do you want to play:</p>
      <div className={styles.numberOfImpostorSelector}>
        <p onClick={selectImpostorsCount.bind(this, 1)}>1</p>  
        <p onClick={selectImpostorsCount.bind(this, 2)}>2</p>  
      </div>
    </> 
    :
    !selectedGroup ?
      <div className={styles.groupsListContainer}>
        <p>Select a team from the list below:</p>
        <Dropdown
          className={styles.groupsList}
          placeholder="Select a group"
          onChange={onChange.bind(this)}
          options={groups.map(group => {
            return { key: group.id, text: group.mailNickname };
          })} />
      </div>
    :
      <EmployeeSelectionPanel
        graphService={props.graphService}
        rankingService={props.rankingService}
        group={selectedGroup} 
        impostorsCount={impostorsCount}/>
    }

    <Ranking graphService={props.graphService} rankingService={props.rankingService} />
 
  </div>
  );
};
export default FindTheImpostor;