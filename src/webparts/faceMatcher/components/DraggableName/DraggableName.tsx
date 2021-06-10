import * as React from 'react';
import styles from './DraggableName.module.scss';
import { IDraggableNameProps } from './IDraggableNameProps';


export default class MyFirstSpfxTab extends React.Component<IDraggableNameProps, {}> {

    private handleDragStart = (e: any) => {
        e.dataTransfer.setData("drag-item", this.props.user.displayName);
    }

    public render(): React.ReactElement<IDraggableNameProps> {

        return (
            <div draggable
                key={this.props.user.id}
                onDragStart={(e) => this.handleDragStart(e)}
                className={styles.draggableUser}>
                    {this.props.user.displayName}
            </div> 
        );
    }
}
