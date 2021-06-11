import * as React from 'react';
import styles from './EmployeeImpostorCard.module.scss';
import { IEmployeeImpostorCardProps } from './IEmployeeImpostorCardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { GraphService } from 'services/GraphService';
import { IEmployeeImpostorCardState } from './IEmployeeImpostorCardState';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react';

export default class EmployeeImpostorCard extends React.Component<IEmployeeImpostorCardProps, IEmployeeImpostorCardState> {

  private graphService: GraphService;

  constructor(props: IEmployeeImpostorCardProps) {
    super(props);
    
    this.graphService = new GraphService(this.props.graphClient);

    this.state = {
      image: null,
      voted: false
    };

  }

  public async componentDidMount(): Promise<void> {

    if (!this.props.graphClient || !this.props.employee) {
      return;
    }

    try {
      const photo = await this.graphService.getEmployeePhoto(this.props.employee.id);

      this.setState({
          image: photo
      });  
    }
    catch {
      console.error("No user image found");
    }
  }

  public render(): React.ReactElement<IEmployeeImpostorCardProps> {
    return (
      <div className={styles.employeeImpostorCard} onClick={this.onCardClick.bind(this)}>
        {this.state.voted &&
        <div className={styles.votedOverlay}></div>
        }
        <div className={styles.container}>
          <span>
            {this.state.image ?
            <img src={this.state.image} /> :
            <div className={styles.initials}>{this.props.employee.initials}</div>
            }
          </span>
          
          {this.props.employee.displayName}
          <div className={styles.jobTitle}>
            {this.props.employee.jobTitle}
          </div>
        </div>
       
      </div>
      
    );
  }

  private onCardClick() {
    if (this.props.remainingImpostors === 0 && !this.state.voted) {
      return;
    }

    this.setState({
      voted: !this.state.voted
    });

    this.props.onCardClicked(this.props.employee, !this.state.voted);
  }
}
