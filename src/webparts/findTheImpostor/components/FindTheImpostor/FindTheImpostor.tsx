import * as React from 'react';
import styles from './FindTheImpostor.module.scss';
import { IFindTheImpostorProps } from './IFindTheImpostorProps';
import { GraphService } from 'services/GraphService';
import { Dropdown } from 'office-ui-fabric-react';
import EmployeeSelectionPanel  from '../EmployeeSelectionPanel/EmployeeSelectionPanel';
import { useEffect, useState } from 'react';
import Ranking from 'webparts/shared/Ranking/Ranking';
import IUserItem from 'data/IUserItem';

const FindTheImpostor: React.FunctionComponent<IFindTheImpostorProps> = props => {

  const [currentUser, setCurrentUser] = useState(null);
  const [impostorsCount, setImpostorsCount] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  const _getCurrentUser = async (): Promise<void> => {
    const graphService = new GraphService(props.graphClient);
    const user: IUserItem = await graphService.getCurrentUserProfile();

    setCurrentUser(user);
  };
  
  const _getGroups = async (): Promise<void> => {
    const service = new GraphService(props.graphClient);
    const groups: Array<any> = await service.getAllGroups();
    
    setGroups(groups);
  };

  useEffect(() => {
    _getCurrentUser();
  }, []);

  useEffect(() => {
    _getGroups();
  }, []);

  const selectImpostorsCount = (impostorsCount: number) => {
    setImpostorsCount(impostorsCount);
  }

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: any) => {
    setSelectedGroup({ id: item.key, mailNickname: item.text });
  }

  return (
    <div className={styles.findTheImpostor}>
    <p>
      Your team is in a secret mission and you all have been boarded into a spaceship to accomplish it. While you are in the far space, you get an anonymous message informing that one or various members of the crew are impostors and want to sabotage the whole mission. Will you be able to detect who or whom are the impostors in less than three attempts?
    </p>

    {!impostorsCount ? 
    <>
      <p>Choose with how many impostors do you want to play:</p>
      <div className={styles.numberOfImpostorSelector}>
        <p className={styles.oneImpostor} onClick={selectImpostorsCount.bind(this, 1)}></p>  
        <p className={styles.twoImpostors} onClick={selectImpostorsCount.bind(this, 2)}></p>  
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
        graphClient={props.graphClient}
        group={selectedGroup} 
        impostorsCount={impostorsCount}/>
    }
     {currentUser &&
      <Ranking graphClient={props.graphClient} currentUser={currentUser} />}
 
  </div>
  );
};
export default FindTheImpostor;