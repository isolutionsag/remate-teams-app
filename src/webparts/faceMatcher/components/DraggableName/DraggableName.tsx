import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import styles from './DraggableName.module.scss';
import { IDraggableNameProps } from './IDraggableNameProps';


export default class MyFirstSpfxTab extends React.Component<IDraggableNameProps, {}> {

    private handleDragStart = (e: any) => {
        e.dataTransfer.setData("employee", JSON.stringify(this.props.employee));
    }

    public render(): React.ReactElement<IDraggableNameProps> {

        return (
            <div draggable={!this.props.blocked}
                onDragStart={(e) => this.handleDragStart(e)}
                className={styles.draggableUser}>
                    <Icon iconName='Contact' /> {this.props.employee.displayName}
            </div> 
        );
    }
}
