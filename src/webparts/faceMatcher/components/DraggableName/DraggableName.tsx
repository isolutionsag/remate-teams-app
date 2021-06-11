import * as React from 'react';
import { IDraggableNameProps } from './IDraggableNameProps';
import styles from './DraggableName.module.scss';
import { Icon } from 'office-ui-fabric-react';

const DraggableName: React.FunctionComponent<IDraggableNameProps> = props => {

    const handleDragStart = (event: any) => {
        event.dataTransfer.setData("employee", JSON.stringify(props.employee));
    };

    return (
        <div draggable={!props.blocked}
            onDragStart={(event) => handleDragStart(event)}
            className={styles.draggableUser}>
                <Icon iconName='Contact' /> {props.employee.displayName}
        </div> 
    );
};
export default DraggableName;