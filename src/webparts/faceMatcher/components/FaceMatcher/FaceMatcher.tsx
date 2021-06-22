import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './FaceMatcher.module.scss';
import { DefaultButton, Dialog, DialogType, Icon, PrimaryButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import DraggableName from '../DraggableName/DraggableName';
import IUserItem from 'data/IUserItem';
import IFaceMatcherProps from './IFaceMatcherProps';
import GraphService from 'services/GraphService';
import RankingService from 'services/RankingService';
import IResult from 'data/IResult';
import EmployeeCard from '../EmployeeCard/EmployeeCard';
import Ranking from 'webparts/shared/Ranking/Ranking';

const FaceMatcher: React.FunctionComponent<IFaceMatcherProps> = props => {

  const NUMBER_OF_EMPLOYEES: number = 4;

  const [shuffledUsers, setShuffledUsers] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const _getEmployees = async (): Promise<void> => {
    // const service = new GraphService(props.graphService);
    const randomEmployees: Array<IUserItem> = await props.graphService.getRandomEmployeesList(NUMBER_OF_EMPLOYEES);

    const _shuffledEmployees = props.graphService.shuffleUsers(randomEmployees);

    setShuffledUsers(_shuffledEmployees);
    setResults(randomEmployees.map(employee => { 
      return { 
        employee: employee, 
        valid: false,
        completed: false 
      }; 
    }));
    setLoaded(true);
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

    //const rankingService = new RankingService(props.graphService);
    props.rankingService.addPointsToCurrentUser(points);
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
        respective heads and then click on the <span className={styles.button}><Icon iconName='SkypeCheck' /> Confirm</span> button
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

      {!loaded ? 
      <Spinner size={SpinnerSize.large} label='Loading random employees...' />
      :
      <>
        <div className={styles.namesOuterContainer}>
          <div className={styles.namesInnerContainer}>
            <div className={styles.namesInnerGrid}>
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
              graphService={props.graphService}
              person={result.employee}
              selectedEmployee={result.selectedEmployee}
              onUserDropped={(employee: IUserItem) => employeeDropped(employee, index)}
              validated={validated}
            />;
          })}
        </div>

        <div className={styles.buttons}>
          {!completed && assignedEmployees.length === NUMBER_OF_EMPLOYEES &&
          <PrimaryButton
            iconProps={{ iconName: 'SkypeCheck' }}
            text='Confirm'
            // disabled={assignedEmployees.length !== NUMBER_OF_EMPLOYEES || completed}
            onClick={validateResults.bind(this)}
          />}
          {completed &&
          <PrimaryButton
            iconProps={{ iconName: 'Sync' }}
            text='Play Again'
            // disabled={!completed}
            onClick={reset.bind(this)}
          />}
        </div>

      </>
      }
      <Ranking graphService={props.graphService} rankingService={props.rankingService} />

      <Dialog
        hidden={!showDialog}
        minWidth={400}
        onDismiss={() => {
          setShowDialog(!showDialog);
          setValidated(false);
        }}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: completed ? 
            <span><Icon iconName='Trophy2Solid' /> CONGRATULATIONS</span> : 
            <span><Icon iconName='SadSolid' /> OUPS...</span>
        }}>
          {completed ?
            <div className={styles.popupContent}>
              <p>You have found all your teammates!</p>
              <p>Now you can see more information about them below.</p>
              <p>Check it out and don't hesitate to reach out</p>
            </div>
            :
            <div className={styles.popupContent}>
              <p>Some of the answers are wrong, try again!</p>
            </div>  
          }
      </Dialog>
    </div>
  );
};
export default FaceMatcher;