import * as React from 'react';
import { IRankingItemProps } from './IRankingItemProps';
import styles from './RankingItem.module.scss';
import { Icon } from 'office-ui-fabric-react';
import { useEffect, useState } from 'react';
import { GraphService } from 'services/GraphService';

const RankingItem: React.FunctionComponent<IRankingItemProps> = props => {

  const [image, setImage] = useState("");

  const _getImage = async (): Promise<void> => {
    const service = new GraphService(props.graphClient);
    const photo = await service.getEmployeePhoto(props.rankingInfo.user.id);
    setImage(photo);
  };

  useEffect(() => {
    _getImage();
  }, []);

  const getMetalColor = (position: number): string => {
    switch (position) {
      case 1:
        return "gold";
        break;
      case 2:
        return "silver";
        break;
    }

    return "#A67D3D";
  };

  return (
    <div className={`${props.isCurrentUser ? styles.rankingMeContainer: styles.rankingUserContainer}`}>
      <div className={styles.innerContainer}>
        <span className={styles.medal}>
          {props.position < 4 ?
            <Icon iconName='MedalSolid'
              style={{ color: getMetalColor(props.position) }} /> :
            <p>{props.position}</p>}
        </span>
        <div className={styles.pictureContainer}>
          {image ?
            <img className={styles.userPicture} src={image} /> :
            <div className={styles.userPicture}>{props.rankingInfo.user.initials}</div>}
        </div>
        <div className={styles.rankingContainer}>
          <p style={{ flex: '1.1 1 0%' }}><b>Name:</b><br /> {props.rankingInfo.user.displayName}</p>
          <p><b>Score:</b><br /> {props.rankingInfo.rankedPoints}</p>
          <p style={{ flex: '1.2 1 0%' }}><b>Game(s) Played:</b><br /> {props.rankingInfo.rankedGames}</p></div>
      </div>

    </div>

  );
};
export default RankingItem;