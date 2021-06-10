import { Icon, IconButton } from '@microsoft/office-ui-fabric-react-bundle';
import * as React from 'react';
import { GraphService } from 'services/GraphService';
import IEmployeeCardProps from './IEmployeeCardProps';
import IEmployeeCardState from './IEmployeeCardState';
import styles from './EmployeeCard.module.scss';


export class EmployeeCard extends React.Component<IEmployeeCardProps, IEmployeeCardState> {
  
  private service: GraphService;

  constructor(props: IEmployeeCardProps) {
    super(props);

    this.service = new GraphService(this.props.graphClient);

    this.state = {
      image: null,
      interests: [],
      selectedUserDisplayName: null
    };
  }
  
  public async componentDidMount(): Promise<void> {
    if (!this.props.person) {
      return;
    }

    try {
      const photo = await this.service.getEmployeePhoto(this.props.person.id);
      const interests = await this.service.getEmployeeInterests(this.props.person.id);

      this.setState({
          image: photo,
          interests: interests
      });  
    }
    catch {
     console.error("No user image found");
    }

  }

  public render(): React.ReactElement<IEmployeeCardProps> {
   
    // https://www.linkedin.com/search/results/all/?keywords=Patric%20Much%20&origin=GLOBAL_SEARCH_HEADER
    return (
        <div className={styles.userPictureContainer}>
             <div className={styles.topContainer}>
            <div className={styles.subContainer}
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
                    {this.props.selectedDisplayName && 
                    <div className={styles.selectedEmployee}>
                        {this.props.selectedDisplayName}
                    </div>}
                </div>
                {this.props.expanded &&
                <div className={styles.hiddenData}>
                  <Icon className={styles.downArrow} iconName='DrillDownSolid' />
                  <div className={styles.additionalInfo}>
                    <h3>About me</h3>
                    <p><IconButton iconProps={{iconName: 'LinkedInLogo'}} href={`https://www.linkedin.com/search/results/all/?keywords=${this.props.person.displayName}&origin=GLOBAL_SEARCH_HEADER`} target='_blank' /> </p>
                    <h4>Job Position:</h4>
                    <p>{this.props.person.jobTitle}</p>
                    <h4>Email:</h4>
                    <p>{this.props.person.mail}</p>
                    <h4>Office Location:</h4>
                    <p>{this.props.person.officeLocation}</p>
                    <h4>My Interests:</h4>
                    <ul>{this.state.interests.map(x => {
                      return <li>{x}</li>;
                    })}</ul>
                  </div>
                </div>}
            </div>
            </div>
        </div>
    );
   
  }

  private dragEmployeeOver(ev: any) {
    ev.preventDefault();

    if (this.props.selectedDisplayName) {
        return;
    }

    ev.target.style.backgroundColor = "skyblue";
  }

  private dragEmployeeLeave(ev) {
    ev.preventDefault();

    if (this.props.selectedDisplayName) {
        return;
    }

    ev.target.style.backgroundColor = "white";
  }
  
  private dropEmployeeName(ev) {
    if (this.props.selectedDisplayName) {
        return;
    }

    ev.target.style.backgroundColor = "white";

    const droppedItem = ev.dataTransfer.getData("drag-item");
    if (droppedItem) {
        // this.setState({
        //     selectedUserDisplayName: droppedItem
        // });
        this.props.onUserDropped(droppedItem);
    }
  }

  private getCardBackgroundColor(): string {
      if (!this.props.validated) {
          return '#f0f2f5';
      }

      if (this.props.person.displayName === this.props.selectedDisplayName) {
          return "#90ee90";
      }

      return "#ffd2d2";
  }
}