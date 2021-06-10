import * as React from 'react';
import styles from './FaceMatcher.module.scss';
import { DefaultButton, Dialog, DialogType, PrimaryButton } from "office-ui-fabric-react";
import DraggableName from '../DraggableName/DraggableName';
import IUserItem from 'data/IUserItem';
import { IFaceMatcherProps } from './IFaceMatcherProps';
import { IFaceMatcherState } from './IFaceMatcherState';
import { GraphService } from 'services/GraphService';
import TenantService from 'services/TenantService';
import RankingService from 'services/RankingService';
import IResult from 'data/IResult';
import { EmployeeCard } from '../EmployeeCard/EmployeeCard';

const NUMBER_OF_EMPLOYEES: number = 4;

export default class FaceMatcher extends React.Component<IFaceMatcherProps, IFaceMatcherState> {

  private graphService: GraphService;
  private tenantService: TenantService;
  private rankingService: RankingService;
  private storage: string;


  constructor(props: IFaceMatcherProps, state: IFaceMatcherState) {
    super(props);

    this.graphService = new GraphService(this.props.graphClient);
    this.tenantService = new TenantService(this.props.context);
       
    this.state = {
      showDialog: false,
      shuffledUsers: [],
      loading: true,
      assignedEmployees: [],
      completed: false,
      validated: false,
      results: [],
      attempts: 0
    };
  }

  public async componentDidMount(): Promise<void> {

    if (!this.props.graphClient) {
      return;
    }

    this.storage = await this.tenantService.getStorageKey('RemateTeamsApp-SPUrl');
    this.rankingService = new RankingService(this.props.context, this.storage); 
    const users: Array<IUserItem> = await this.graphService.getRandomEmployeesList(NUMBER_OF_EMPLOYEES);

    const shuffledUsers = this.shuffleUsers(users);

    this.setState({
      loading: false,
      shuffledUsers: shuffledUsers,
      assignedEmployees: [],
      completed: false,
      results: users.map(x => { return { employee: x, valid: false};})
    });

  }

  public render(): React.ReactElement<IFaceMatcherProps> {

    return !this.state.loading &&
      <div draggable={false} className={ styles.whoIsWho }>

        <div>
          <p>Welcome to the WHO'S WHO game. Do you know your mates' faces or at least what they look like? This is a drag & drop game in which you have to drag the names of each person under their respective heads and then click on theConfirm ✔️button below to check your answers.</p>
          <p>If you are wrong, don't worry, everyone may have a 2nd chance ! If you feel lucky, don't hesitate to try your luck again by clicking onPlay Again 🔄</p>
          <p>If you find it the first try, you win 3 points | On the second try, 2 points | Three or more tries, 1 point.</p>
        </div>
        
        <div className={styles.namesOuterContainer}>
          <div className={styles.namesInnerContainer}>
            <h3>Remate's Names</h3>
            <p>Drag the names from here:</p>
            <div className={styles.dragDropArea}>
            {this.state.shuffledUsers.map((result: IUserItem) => {
              return this.state.assignedEmployees.indexOf(result.displayName) === -1 &&
                <DraggableName user={result}></DraggableName>;
            })}
            </div>
          </div>
          
        </div>
        {this.state.results.map((result: IResult, index: number) => {
          return <EmployeeCard 
            expanded={this.state.completed}
            graphClient={this.props.graphClient} 
            person={result.employee} 
            selectedDisplayName={result.selectedDisplayName}
            onUserDropped={(employeeDisplayName: string) => this.employeeDropped(employeeDisplayName, index)} 
            validated={this.state.validated}
            />;
        })}

        <div className={styles.buttons}>
          <PrimaryButton
            iconProps={{iconName: 'SkypeCheck'}}
            text='Check' 
            disabled={this.state.assignedEmployees.length !== NUMBER_OF_EMPLOYEES || this.state.completed} 
            onClick={this.validateResults.bind(this)} 
            />
          <DefaultButton
            iconProps={{iconName: 'Sync'}}
            text='Play Again' 
            disabled={!this.state.completed} 
            onClick={this.reset.bind(this)}
            />
        </div>

        <Dialog
          hidden={!this.state.showDialog}
          onDismiss={() => {
            this.setState({showDialog: !this.state.showDialog});
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: this.state.completed ? 'CONGRATULATIONS' : 'OUPS...',
            subText: this.state.completed ? 'You have found all your teammates!' : 'Some of the answers are wrong, try again!',
          }}>
        </Dialog>
      </div>;
  }

  private shuffleUsers(users: Array<IUserItem>): Array<IUserItem> {
    const shuffledUsers = users.slice();

    for (let i: number = shuffledUsers.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      const temp: IUserItem = shuffledUsers[i];
      shuffledUsers[i] = shuffledUsers[j];
      shuffledUsers[j] = temp;
    }

    return shuffledUsers;
  }

  private reset() {
    window.location.reload();
  }

  private validateResults() {
    let results: Array<IResult> = JSON.parse(JSON.stringify(this.state.results));
    const assignedEmployees: string[] = [];
    for (let i=0; i<results.length; i++) {
      if (results[i].valid) {
        assignedEmployees.push(results[i].employee.displayName);
      } else {
        results[i].selectedDisplayName = null;
      }
    }

    let attempts = this.state.attempts;
    let completed: boolean = false;

    if (assignedEmployees.length === NUMBER_OF_EMPLOYEES) {
      // You won!
      completed = true;
      let points: number = 1;
      switch (attempts) {
        case 0:
            points = 3;
            break;
        case 1:
            points = 2;
            break;
      }
      this.rankingService.addPointsToCurrentUser(points);
      
    } else {
      attempts++;
    }

    this.setState({
      validated: true,
      completed: completed,
      results: results,
      assignedEmployees: assignedEmployees,
      attempts: attempts,
      showDialog: !this.state.showDialog
    });
  }

  private employeeDropped(user: string, index: number) {

    let results: Array<IResult> = JSON.parse(JSON.stringify(this.state.results));
    results[index].valid = this.state.results[index].employee.displayName === user;
    results[index].selectedDisplayName = user;
    
    this.setState({
      assignedEmployees: [...this.state.assignedEmployees, user],
      results: results
    });
  }
}
