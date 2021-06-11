import { Icon, IconButton } from '@microsoft/office-ui-fabric-react-bundle';
import * as React from 'react';
import { GraphService } from 'services/GraphService';
import IEmployeeCardProps from './IEmployeeExtendedInfoProps';
import styles from './EmployeeExtendedInfo.module.scss';
import IEmployeeExtendedInfoProps from './IEmployeeExtendedInfoProps';
import IEmployeeExtendedInfoState from './IEmployeeExtendedInfoState';


export class EmployeeExtendedInfo extends React.Component<IEmployeeExtendedInfoProps, IEmployeeExtendedInfoState> {

  private service: GraphService;

  constructor(props: IEmployeeExtendedInfoProps) {
    super(props);

    this.service = new GraphService(this.props.graphClient);

    this.state = {
      interests: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.person) {
      return;
    }

    try {
      const interests = await this.service.getEmployeeInterests(this.props.person.id);

      this.setState({
        interests: interests
      });
    }
    catch {
      console.error("No user interests found");
    }

  }

  public render(): React.ReactElement<IEmployeeCardProps> {

    return (
      <div className={styles.employeeExtendedInfo}>
        <Icon className={styles.downArrow} iconName='DrillDownSolid' />
        <div className={styles.additionalInfo}>
          <h3>About me</h3>
          <p><IconButton iconProps={{ iconName: 'LinkedInLogo' }} href={`https://www.linkedin.com/search/results/all/?keywords=${this.props.person.displayName}&origin=GLOBAL_SEARCH_HEADER`} target='_blank' /> </p>
          <h4>Job Position:</h4>
          <p>{this.props.person.jobTitle}</p>
          <h4>Email:</h4>
          <p>{this.props.person.mail}</p>
          <h4>Office Location:</h4>
          <p>{this.props.person.officeLocation}</p>
          <h4>My Interests:</h4>
          <ul>{this.state.interests.map(interest => {
            return <li>{interest}</li>;
          })}</ul>
        </div>
      </div>
    );
  }
}