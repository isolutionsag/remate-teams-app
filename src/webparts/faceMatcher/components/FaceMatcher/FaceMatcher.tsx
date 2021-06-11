import * as React from 'react';
import styles from './FaceMatcher.module.scss';
import { DefaultButton, Dialog, DialogType, Icon, PrimaryButton } from "office-ui-fabric-react";
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

    const users: Array<IUserItem> = await this.graphService.getRandomEmployeesList(NUMBER_OF_EMPLOYEES);

    const shuffledUsers = this.graphService.shuffleUsers(users);

    this.setState({
      loading: false,
      shuffledUsers: shuffledUsers,
      assignedEmployees: [],
      completed: false,
      results: users.map(x => { return { employee: x, valid: false, completed: false};})
    });

  }

  public render(): React.ReactElement<IFaceMatcherProps> {

    return !this.state.loading &&
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
        
        <hr/>
        
        <div className={styles.namesOuterContainer}>
          <div className={styles.namesInnerContainer}>
            <div className={styles.xxx}>
            <h3>Remate's Names</h3>
            <p>Drag the names from here:</p>
            <div className={styles.dragDropArea}>
            {this.state.shuffledUsers.map((employee: IUserItem) => {
              return this.state.assignedEmployees.indexOf(employee.displayName) === -1 &&
                <DraggableName employee={employee}></DraggableName>;
            })}
            </div>
            </div>
          </div>
          
        </div>
        <div className={styles.employeeCardContainer}>
          {this.state.results.map((result: IResult, index: number) => {
            return <EmployeeCard 
              expanded={this.state.completed}
              result={result}
              graphClient={this.props.graphClient} 
              person={result.employee} 
              selectedEmployee={result.selectedEmployee}
              //selectedDisplayName={result.selectedDisplayName}
              onUserDropped={(employee: IUserItem) => this.employeeDropped(employee, index)} 
              validated={this.state.validated}
              />;
          })}
        </div>

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
            this.setState({showDialog: !this.state.showDialog, validated: false});
          }}
          dialogContentProps={{
            type: DialogType.normal,
            title: this.state.completed ? 'CONGRATULATIONS' : 'OUPS...',
            subText: this.state.completed ? 'You have found all your teammates!' : 'Some of the answers are wrong, try again!',
          }}>
        </Dialog>
      </div>;
  }

  private reset() {
    window.location.reload();
  }

  private async updateRanking() {
    let attempts = this.state.attempts;

    let points: number = 1;
      switch (attempts) {
        case 0:
            points = 3;
            break;
        case 1:
            points = 2;
            break;
      }

      this.storage = await this.tenantService.getStorageKey('RemateTeamsApp-SPUrl');
      this.rankingService = new RankingService(this.props.context, this.storage); 
      this.rankingService.addPointsToCurrentUser(points);

  }

  private async validateResults() {
    let results: Array<IResult> = JSON.parse(JSON.stringify(this.state.results));
    const assignedEmployees: string[] = [];
    
    for (let i = 0; i < results.length; i++) {
      if (results[i].valid) {
        assignedEmployees.push(results[i].employee.displayName);
        results[i].completed = true;
      } else {
        results[i].selectedEmployee = null;
      }
    }

    let completed: boolean = false;

    if (assignedEmployees.length === NUMBER_OF_EMPLOYEES) {
      completed = true;
      await this.updateRanking();
    } 

    this.setState({
      validated: true,
      completed: completed,
      results: results,
      assignedEmployees: assignedEmployees,
      attempts: completed ? 0 : this.state.attempts + 1,
      showDialog: !this.state.showDialog
    });
  }

  private employeeDropped(user: IUserItem, index: number) {

    let results: Array<IResult> = JSON.parse(JSON.stringify(this.state.results));
    results[index].valid = this.state.results[index].employee.id === user.id;
    results[index].selectedEmployee = user;
    
    this.setState({
      assignedEmployees: [...this.state.assignedEmployees, user.displayName],
      results: results
    });
  }
}
