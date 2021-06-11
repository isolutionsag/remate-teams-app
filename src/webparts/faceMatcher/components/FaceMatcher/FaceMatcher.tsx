import * as React from 'react';
import styles from './FaceMatcher.module.scss';
import { DefaultButton, Dialog, DialogType, Icon, PrimaryButton } from "office-ui-fabric-react";
import DraggableName from '../DraggableName/DraggableName';
import IUserItem from 'data/IUserItem';
import { IFaceMatcherProps } from './IFaceMatcherProps';
import { GraphService } from 'services/GraphService';
import TenantService from 'services/TenantService';
import RankingService from 'services/RankingService';
import IResult from 'data/IResult';
import EmployeeCard from '../EmployeeCard/EmployeeCard';
import { useEffect, useState } from 'react';

const FaceMatcher: React.FunctionComponent<IFaceMatcherProps> = props => {

  const NUMBER_OF_EMPLOYEES: number = 4;

  const [shuffledUsers, setShuffledUsers] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const _getEmployees = async (): Promise<void> => {
    const graphService = new GraphService(props.graphClient);

    const users: Array<IUserItem> = await graphService.getRandomEmployeesList(NUMBER_OF_EMPLOYEES);

    const _shuffledUsers = await graphService.shuffleUsers(users);
    setShuffledUsers(_shuffledUsers);
    setResults(users.map(x => { return { employee: x, valid: false, completed: false }; }));
  };

  useEffect(() => {
    _getEmployees();
  }, []);

  const reset = () => {
    window.location.reload();
  };

  const updateRanking = async () => {

    let points: number = 1;
    switch (attempts) {
      case 0:
        points = 3;
        break;
      case 1:
        points = 2;
        break;
    }

    const tenantService = new TenantService(props.context);
    const storage = await tenantService.getStorageKey('RemateTeamsApp-SPUrl');
    const rankingService = new RankingService(props.context, storage); 
    rankingService.addPointsToCurrentUser(points);
  };

  const validateResults = async () => {
    const _assignedEmployees: string[] = [];

    for (let i = 0; i < results.length; i++) {
      if (results[i].valid) {
        _assignedEmployees.push(results[i].employee.displayName);
        results[i].completed = true;
      } else {
        results[i].selectedEmployee = null;
      }
    }

    if (_assignedEmployees.length === NUMBER_OF_EMPLOYEES) {
      setCompleted(true);
      await updateRanking();
    }

    setValidated(true);
    setResults(results);
    setAssignedEmployees(_assignedEmployees);
    setAttempts(completed ? 0 : attempts + 1);
    setShowDialog(!showDialog);

  };

  const employeeDropped = (user: IUserItem, index: number) => {
    results[index].valid = results[index].employee.id === user.id;
    results[index].selectedEmployee = user;

    setAssignedEmployees([...assignedEmployees, user.displayName]);
    setResults(results);
  };


  return (
    <div draggable={false} className={styles.faceMatcher}>
      <p>
        Welcome to the <strong>WHO'S WHO game</strong>. Do you know your mates' faces or at least what they look like?
        This is a drag & drop game in which you have to drag the names of each person under their
        respective heads and then click on the <span className={styles.button}><Icon iconName='SkypeCheck' /> Check</span> button
        below to check your answers.
      </p>
      <p>
        If you are wrong, don't worry, everyone may have a 2nd chance ! If you feel lucky, don't hesitate
        to try your luck again by clicking on <span className={styles.button}><Icon iconName='Sync' /> Play Again</span>
      </p>
      <p>
        If you find it the first try, you win 3 points | On the second try, 2 points |
        Three or more tries, 1 point.
      </p>

      <hr />

      <div className={styles.namesOuterContainer}>
        <div className={styles.namesInnerContainer}>
          <div className={styles.xxx}>
            <h3>Remate's Names</h3>
            <p>Drag the names from here:</p>
            <div className={styles.dragDropArea}>
              {shuffledUsers.map((employee: IUserItem) => {
                return assignedEmployees.indexOf(employee.displayName) === -1 &&
                  <DraggableName employee={employee}></DraggableName>;
              })}
            </div>
          </div>
        </div>

      </div>
      <div className={styles.employeeCardContainer}>
        {results.map((result: IResult, index: number) => {
          return <EmployeeCard
            expanded={completed}
            result={result}
            graphClient={props.graphClient}
            person={result.employee}
            selectedEmployee={result.selectedEmployee}
            onUserDropped={(employee: IUserItem) => employeeDropped(employee, index)}
            validated={validated}
          />;
        })}
      </div>

      <div className={styles.buttons}>
        <PrimaryButton
          iconProps={{ iconName: 'SkypeCheck' }}
          text='Check'
          disabled={assignedEmployees.length !== NUMBER_OF_EMPLOYEES || completed}
          onClick={validateResults.bind(this)}
        />
        <DefaultButton
          iconProps={{ iconName: 'Sync' }}
          text='Play Again'
          disabled={!completed}
          onClick={reset.bind(this)}
        />
      </div>

      <Dialog
        hidden={!showDialog}
        onDismiss={() => {
          setShowDialog(!showDialog);
          setValidated(false);
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: completed ? 'CONGRATULATIONS' : 'OUPS...',
          subText: completed ? 'You have found all your teammates!' : 'Some of the answers are wrong, try again!',
        }}>
      </Dialog>
    </div>
  );
};
export default FaceMatcher;