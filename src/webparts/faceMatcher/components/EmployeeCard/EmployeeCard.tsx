import * as React from 'react';
import { GraphService } from 'services/GraphService';
import IEmployeeCardProps from './IEmployeeCardProps';
import styles from './EmployeeCard.module.scss';
import DraggableName from '../DraggableName/DraggableName';
import EmployeeExtendedInfo from '../EmployeeExtendedInfo/EmployeeExtendedInfo';
import { useEffect, useState } from 'react';

const EmployeeCard: React.FunctionComponent<IEmployeeCardProps> = props => {

  const [image, setImage] = useState("");

  const _getImage = async (): Promise<void> => {
    const service = new GraphService(props.graphClient);
    const photo = await service.getEmployeePhoto(props.person.id);
    setImage(photo);
  };

  useEffect(() => {
    _getImage();
  }, []);

  const dragEmployeeOver = (event: any): void => {
    event.preventDefault();

    if (props.selectedEmployee) {
      return;
    }

    event.target.style.backgroundColor = "skyblue";
  };

  const dragEmployeeLeave = (event: any): void => {
    event.preventDefault();

    if (props.selectedEmployee) {
      return;
    }

    event.target.style.backgroundColor = "white";
  };

  const dropEmployeeName = (event: any): void => {
    if (props.selectedEmployee) {
      return;
    }

    event.target.style.backgroundColor = "white";

    const employee = JSON.parse(event.dataTransfer.getData("employee"));

    if (employee) {
      props.onUserDropped(employee);
    }
  };

  const getCardBackgroundColor = (): string => {
    if (props.result.completed) {
      return "#90ee90";
    }

    if (!props.validated) {
      return '#f0f2f5';
    }

    if (props.selectedEmployee && props.person.id === props.selectedEmployee.id) {
      return "#90ee90";
    }

    return "#ffd2d2";
  };

  return (
    <div className={styles.employeeCard}>

      <div className={styles.container}
        style={{
          backgroundColor: getCardBackgroundColor()
        }}>
        {image ?
          <img className={styles.userPicture} src={image} /> :
          <div className={styles.userPicture}>{props.person.initials}</div>}
        <p>Drop the name over here:</p>
        <div
          className={styles.dropZone}
          onDragOver={(e) => dragEmployeeOver(e)}
          onDrop={(e) => dropEmployeeName(e)}
          onDragLeave={(e) => dragEmployeeLeave(e)}
        >
          {props.selectedEmployee &&
            <DraggableName employee={props.selectedEmployee} blocked={true} />}
        </div>
        {props.expanded &&
          <EmployeeExtendedInfo person={props.person} graphClient={props.graphClient} />}
      </div>
    </div>
  );
};
export default EmployeeCard;