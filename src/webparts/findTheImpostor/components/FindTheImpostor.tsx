import * as React from 'react';
import styles from './FindTheImpostor.module.scss';
import { IFindTheImpostorProps } from './IFindTheImpostorProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { GraphService } from 'services/GraphService';
import { IFindTheImpostorState } from './IFindTheImpostorState';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react';

export default class FindTheImpostor extends React.Component<IFindTheImpostorProps, IFindTheImpostorState> {

  private graphService: GraphService;

  constructor(props: IFindTheImpostorProps) {
    super(props);
    
    this.graphService = new GraphService(this.props.graphClient);

    this.state = {
      groups: [],
      loaded: false
    };

  }

  public async componentDidMount(): Promise<void> {

    if (!this.props.graphClient) {
      return;
    }

    const groups: Array<any> = await this.graphService.getAllGroups();
    
    this.setState({
      groups: groups,
      loaded: true
    });


  }

  public render(): React.ReactElement<IFindTheImpostorProps> {
    return (
      <div>
        <p>
          Your team is in a secret mission and you all have been boarded into a spaceship to accomplish it. While you are in the far space, you get an anonymous message informing that one or various members of the crew are impostors and want to sabotage the whole mission. ¿Will you be able to detect who or whom are the impostors in less than three attempts?
        </p>
        <p>Select a team from the list below:</p>
        {this.state.loaded && 
        <Dropdown
          placeholder="Select a team"
          label="Select a team from the list below:"
          onChange={this.onChange.bind(this)}
          options={this.state.groups.map(group => {
            return { key: group.id, text: group.mailNickname }
          })}
        />}
      </div>
      
    );
  }

  private async onChange (event: React.FormEvent<HTMLDivElement>, item: any): Promise<void> {
    //setSelectedItem(item);
    await this.graphService.getGroupMembers(item.key);
  };
}
