import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './EmployeeExtendedInfo.module.scss';
import GraphService from 'services/GraphService';
import { Icon, IconButton } from '@microsoft/office-ui-fabric-react-bundle';
import IEmployeeExtendedInfoProps from './IEmployeeExtendedInfoProps';

const EmployeeExtendedInfo: React.FunctionComponent<IEmployeeExtendedInfoProps> = props => {
  const [interests, setInterests] = useState([]);

  const _getInterests = async () => {
    const service = new GraphService(props.graphClient);
    const _interests: string[] = await service.getEmployeeInterests(props.person.id);
    setInterests(_interests);
  };
 
  useEffect(() => {
    _getInterests();
  }, []);
  
  return (
    <div className={styles.employeeExtendedInfo}>
      <Icon className={styles.downArrow} iconName='DrillDownSolid' />
      <div className={styles.additionalInfo}>
        <h3>About me</h3>
        <p><IconButton iconProps={{ iconName: 'LinkedInLogo' }} 
          href={`https://www.linkedin.com/search/results/all/?keywords=${props.person.displayName}&origin=GLOBAL_SEARCH_HEADER`} target='_blank' /> </p>
        <h4>Job Position:</h4>
        <p>{props.person.jobTitle}</p>
        <h4>Email:</h4>
        <p>{props.person.mail}</p>
        <h4>Office Location:</h4>
        <p>{props.person.officeLocation}</p>
        <h4>My Interests:</h4>
        <ul>{interests.map(interest => {
        return <li>{interest}</li>;
        })}</ul>
      </div>
    </div>
  );
  
};
export default EmployeeExtendedInfo;