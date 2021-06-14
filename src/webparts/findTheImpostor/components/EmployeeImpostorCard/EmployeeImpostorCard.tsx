import * as React from 'react';
import styles from './EmployeeImpostorCard.module.scss';
import { IEmployeeImpostorCardProps } from './IEmployeeImpostorCardProps';
import { GraphService } from 'services/GraphService';
import { useEffect, useState } from 'react';

const EmployeeImpostorCard: React.FunctionComponent<IEmployeeImpostorCardProps> = props => {

  const [image, setImage] = useState("");
  const [voted, setVoted] = useState(false);

  const _getImage = async (): Promise<void> => {
    const service = new GraphService(props.graphClient);
    const photo = await service.getEmployeePhoto(props.employee.id);
    setImage(photo);
  };

  useEffect(() => {
    _getImage();
  }, []);

  const onCardClick = () => {

    if (props.employee.blocked) {
      return;
    }

    if (props.remainingImpostors === 0 && !voted) {
      return;
    }

    setVoted(!voted);

    props.onCardClicked(props.employee, !voted);
  };

  return (
    <div className={props.employee.blocked ? styles.employeeBlockedCard : styles.employeeImpostorCard} onClick={onCardClick.bind(this)}>
    
    {voted &&
    <div className={styles.votedOverlay}></div>}

    <div className={styles.container}>
      <span>
        {image ?
        <img src={image} /> :
        <div className={styles.initials}>{props.employee.initials}</div>}
      </span>
      
      {props.employee.displayName}
      <div className={styles.jobTitle}>
        {props.employee.jobTitle}
      </div>
    </div>
   
  </div>
  );
};
export default EmployeeImpostorCard;