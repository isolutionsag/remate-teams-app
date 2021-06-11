import * as React from 'react';
import styles from './FindTheImpostor.module.scss';
import { IFindTheImpostorProps } from './IFindTheImpostorProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { GraphService } from 'services/GraphService';
import { IFindTheImpostorState } from './IFindTheImpostorState';
import { DefaultButton, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import EmployeeSelectionPanel from '../EmployeeSelectionPanel/EmployeeSelectionPanel';

export default class FindTheImpostor extends React.Component<IFindTheImpostorProps, IFindTheImpostorState> {

  private graphService: GraphService;

  constructor(props: IFindTheImpostorProps) {
    super(props);

    this.graphService = new GraphService(this.props.graphClient);

    this.state = {
      groups: []
    };

  }

  public async componentDidMount(): Promise<void> {

    if (!this.props.graphClient) {
      return;
    }

    const groups: Array<any> = await this.graphService.getAllGroups();

    this.setState({
      groups: groups
    });
  }

  public render(): React.ReactElement<IFindTheImpostorProps> {
    return (
      <div className={styles.findTheImpostor}>
        <p>
          Your team is in a secret mission and you all have been boarded into a spaceship to accomplish it. While you are in the far space, you get an anonymous message informing that one or various members of the crew are impostors and want to sabotage the whole mission. ¿Will you be able to detect who or whom are the impostors in less than three attempts?
        </p>

        {!this.state.impostorsCount ? 
        <>
          <p>Choose with how many impostors do you want to play:</p>
          <div className={styles.numberOfImpostorSelector}>
            <p className={styles.oneImpostor} onClick={this.selectImpostorsCount.bind(this, 1)}></p>  
            <p className={styles.twoImpostors} onClick={this.selectImpostorsCount.bind(this, 2)}></p>  
          </div>
        </> 
        :
        !this.state.selectedGroup ?
        <>
          <p>Select a team from the list below:</p>
          <Dropdown
            placeholder="Select a team"
            label="Select a team from the list below:"
            onChange={this.onChange.bind(this)}
            options={this.state.groups.map(group => {
              return { key: group.id, text: group.mailNickname };
            })}
          />
        </>
        :
        <EmployeeSelectionPanel
          graphClient={this.props.graphClient}
          group={this.state.selectedGroup} 
          impostorsCount={this.state.impostorsCount}/>
        }
      </div>

    );
  }

  private async selectImpostorsCount(impostorsCount: number) {
    this.setState({
      impostorsCount: impostorsCount
    });
  }

  private async onChange(event: React.FormEvent<HTMLDivElement>, item: any): Promise<void> {
    this.setState({
      selectedGroup: { id: item.key, mailNickname: item.text }
    });
  }
}
