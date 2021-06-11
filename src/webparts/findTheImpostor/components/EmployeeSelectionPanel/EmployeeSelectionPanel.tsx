import * as React from 'react';
import styles from './EmployeeSelectionPanel.module.scss';
import { IEmployeeSelectionPanelProps } from './IEmployeeSelectionPanelProps';
import { GraphService } from 'services/GraphService';
import { IEmployeeSelectionPanelState } from './IEmployeeSelectionPanelState';
import EmployeeImpostorCard from '../EmployeeImpostorCard/EmployeeImpostorCard';
import { DefaultButton } from 'office-ui-fabric-react';
import IUserItem from 'data/IUserItem';

export default class EmployeeSelectionPanel extends React.Component<IEmployeeSelectionPanelProps, IEmployeeSelectionPanelState> {

  private graphService: GraphService;

  constructor(props: IEmployeeSelectionPanelProps) {
    super(props);
    
    this.graphService = new GraphService(this.props.graphClient);

    this.state = {
      members: [],
      remainingImpostors: this.props.impostorsCount,
      attempts: 0
    };

  }

  public async componentDidMount(): Promise<void> {

    if (!this.props.graphClient || !this.props.group ) {
      return;
    }

    let members: Array<any> = await this.graphService.getGroupMembers(this.props.group.id);
    members = await this.graphService.addRandomEmployees(members, 2);
    
    this.setState({
      members: members
    });

  }

  public render(): React.ReactElement<IEmployeeSelectionPanelProps> {
    return (
        <div className={styles.employeeSelectionPanel}>
          <p>Select the crew members you suspect are the impostors for
            the group: <strong>{this.props.group.mailNickname}</strong>
          </p>
          <div className={styles.counters}>
            <p>Impostor remaining: {this.state.remainingImpostors}</p>
            <p>Attempts: {this.state.attempts}</p>
          </div>
          <div className={styles.employeeSelectionGrid}>
              {this.state.members.map(member => {
              return <EmployeeImpostorCard
                graphClient={this.props.graphClient}
                employee={member} 
                remainingImpostors={this.state.remainingImpostors}
                onCardClicked={this.cardClicked.bind(this)}
                />;
              })}
          </div>
          <DefaultButton
            text='Process' 
            disabled={this.state.remainingImpostors > 0}
            onClick={this.process.bind(this)} />
        </div>
      
    );
  }

  private cardClicked(employee: IUserItem, voted: boolean) {
    this.setState({
      remainingImpostors: this.state.remainingImpostors + (voted ? -1 : 1)
    });
  }

  private process() {
    alert("process");
  }
}
