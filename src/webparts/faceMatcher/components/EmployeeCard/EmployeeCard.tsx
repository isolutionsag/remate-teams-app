import * as React from 'react';
import { GraphService } from 'services/GraphService';
import IEmployeeCardProps from './IEmployeeCardProps';
import IEmployeeCardState from './IEmployeeCardState';
import styles from './EmployeeCard.module.scss';
import DraggableName from '../DraggableName/DraggableName';
import { EmployeeExtendedInfo } from '../EmployeeExtendedInfo/EmployeeExtendedInfo';


export class EmployeeCard extends React.Component<IEmployeeCardProps, IEmployeeCardState> {

  private service: GraphService;

  constructor(props: IEmployeeCardProps) {
    super(props);

    this.service = new GraphService(this.props.graphClient);

    this.state = {
      image: null
    };
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.person) {
      return;
    }

    try {
      const photo = await this.service.getEmployeePhoto(this.props.person.id);

      this.setState({
        image: photo
      });
    }
    catch {
      console.error("No user image found");
    }
  }

  public render(): React.ReactElement<IEmployeeCardProps> {

    return (
      <div className={styles.employeeCard}>

        <div className={styles.container}
          style={{
            backgroundColor: this.getCardBackgroundColor()
          }}>
          {this.state.image ?
            <img className={styles.userPicture} src={this.state.image} /> :
            <div className={styles.userPicture}>{this.props.person.initials}</div>}
          <p>Drop the name over here:</p>
          <div
            className={styles.dropZone}
            onDragOver={(e) => this.dragEmployeeOver(e)}
            onDrop={(e) => this.dropEmployeeName(e)}
            onDragLeave={(e) => this.dragEmployeeLeave(e)}
          >
            {this.props.selectedEmployee &&
            <DraggableName employee={this.props.selectedEmployee} blocked={true} />}
          </div>
            {this.props.expanded &&
            <EmployeeExtendedInfo person={this.props.person} graphClient={this.props.graphClient} />}
        </div>
      </div>
    );
  }

  private dragEmployeeOver(ev: any) {
    ev.preventDefault();

    if (this.props.selectedEmployee) {
      return;
    }

    ev.target.style.backgroundColor = "skyblue";
  }

  private dragEmployeeLeave(ev) {
    ev.preventDefault();

    if (this.props.selectedEmployee) {
      return;
    }

    ev.target.style.backgroundColor = "white";
  }

  private dropEmployeeName(ev) {
    if (this.props.selectedEmployee) {
      return;
    }

    ev.target.style.backgroundColor = "white";

    const employee = JSON.parse(ev.dataTransfer.getData("employee"));
    
    if (employee) {
      this.props.onUserDropped(employee);
    }
  }

  private getCardBackgroundColor(): string {
    if (this.props.result.completed) {
      return "#90ee90";
    }
    
    if (!this.props.validated) {
      return '#f0f2f5';
    }

    if (this.props.selectedEmployee && this.props.person.id === this.props.selectedEmployee.id) {
      return "#90ee90";
    }

    return "#ffd2d2";
  }
}