import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './EmployeeSelectionPanel.module.scss';
import IEmployeeSelectionPanelProps from './IEmployeeSelectionPanelProps';
import GraphService from 'services/GraphService';
import EmployeeImpostorCard from '../EmployeeImpostorCard/EmployeeImpostorCard';
import { DefaultButton, Dialog, DialogType, Icon, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import IUserItem from 'data/IUserItem';
import RankingService from 'services/RankingService';


const EmployeeSelectionPanel: React.FunctionComponent<IEmployeeSelectionPanelProps> = props => {

  const [loaded, setLoaded] = useState(false);
  const [remainingImpostors, setRemainingImpostors] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [members, setMembers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState([]);
  const [remainingResults, setRemainingResults] = useState([]);

  const _getMembers = async (): Promise<void> => {
    const service = new GraphService(props.graphClient);
    let _members: Array<any> = await service.getGroupMembers(props.group.id);
    _members = await service.appendRandomEmployees(_members, props.impostorsCount);
    
    setMembers(service.shuffleUsers(_members));
    setLoaded(true);
  };

  useEffect(() => {
    setRemainingImpostors(props.impostorsCount);
    _getMembers();
  }, []);

  const cardClicked = (employee: IUserItem, voted: boolean) => {
    setRemainingImpostors(remainingImpostors + (voted ? -1 : 1));
    const position = members.map(x => x.id).indexOf(employee.id);
    members[position].voted = voted;
    setMembers(members);
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

    const rankingService = new RankingService(props.graphClient);
    rankingService.addPointsToCurrentUser(points);
  };

  const process = async () => {
    let remaining = 0;
    let _results = [];
    let _remainingResults = [];
    let _completed = false;
    for (let i = 0; i < members.length; i++) {

      if (members[i].blocked) {
        continue;
      }

      if (members[i].voted) {
        members[i].blocked = true;
        _results.push(`${members[i].displayName} was${members[i].impostor? '' : ' not'} an impostor`);
      }

      if (!members[i].voted && members[i].impostor) {
        _remainingResults.push(`${members[i].displayName} was an impostor`);
        remaining++;
      }
    }

    setResults(_results);
    setRemainingResults(_remainingResults);

    if (remaining > 0) {
      setAttempts(attempts + 1);
    } else {
      _completed = true;
    }

    if (attempts === 2) {
      _completed = true;
    }

    if (_completed && remaining === 0) {
      await updateRanking();
    }

    setCompleted(_completed);
    setRemainingImpostors(remaining);
    setShowDialog(true);
  };

  return (
    <div className={styles.employeeSelectionPanel}>
      
      {completed ?
      <DefaultButton text='Click here to play again' onClick={() => window.location.reload()} />
      :
      !loaded ? 
      <Spinner size={SpinnerSize.large} label='Loading groups...' />
      :
      <>
        <p>Select the crew members you suspect are the impostors for
          the group: <strong>{props.group.mailNickname}</strong>
        </p>
        <div className={styles.counters}>
          <p>Remaining impostors: {remainingImpostors}</p>
          <p>Attempts: {attempts}</p>
        </div>
        <div className={styles.employeeSelectionGrid}>
            {members.map(member => {
            return <EmployeeImpostorCard
              graphClient={props.graphClient}
              employee={member} 
              remainingImpostors={remainingImpostors}
              onCardClicked={cardClicked.bind(this)}
              />;
            })}
        </div>

        <DefaultButton
          text='Process' 
          disabled={remainingImpostors > 0}
          onClick={process.bind(this)} />

      </>
      }
        
      <Dialog
        hidden={!showDialog}
        minWidth={400}
        onDismiss={() => {
          setShowDialog(!showDialog);
        }}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: completed && remainingImpostors === 0 ? 
            <span><Icon iconName='Trophy2Solid' /> CONGRATULATIONS</span> : 
            <span><Icon iconName='SadSolid' /> OUPS...</span>
        }}>
          {completed ?
            <div className={styles.popupContent}>
              {remainingImpostors === 0 ?
              <p>You found all impostors!!!!</p> :
              <>
              <p>You didn't find all impostors!!!!</p>
              <ul>
                {remainingResults.map(result => {
                  return <li>{result}</li>;
                })}
              </ul>
              </>
              }
            </div>
            :
            <div className={styles.popupContent}>
              <p>Please try again!</p>
              <ul>
                {results.map(result => {
                  return <li>{result}</li>;
                })}
              </ul>
            </div>  
          }
      </Dialog>
    </div> 
  );
};
export default EmployeeSelectionPanel;