import * as React from 'react';
import { IRankingProps } from './IRankingProps';
import styles from './Ranking.module.scss';
import { DefaultButton, Dialog, DialogType, Icon } from 'office-ui-fabric-react';
import { useEffect, useState } from 'react';
import IRankingItem from 'data/IRankingItem';
import RankingItem from '../RankingItem/RankingItem';
import IUserItem from 'data/IUserItem';
import RankingButton from '../RankingButton/RankingButton';

const Ranking: React.FunctionComponent<IRankingProps> = props => {

  const [currentUser, setCurrentUser] = useState(null);
  const [rankedUsers, setRankedUsers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [relativeToUser, setRelativeToUser] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  const [showFullRanking, setShowFullRanking] = useState(false);

  const _getCurrentUser = async (): Promise<void> => {
    const user: IUserItem = await props.graphService.getCurrentUserProfile();

    setCurrentUser(user);
  };

  useEffect(() => {
    _getCurrentUser();
  }, []);

  const _showRanking = async (): Promise<void> => {

    const fullRanking: Array<IRankingItem> = await props.rankingService.getFullRanking();
    const currentUserPosition: number = fullRanking.map(ranking => ranking.user.id).indexOf(currentUser.id) + 1;

    if (currentUserPosition < 7) {
      setWinners(fullRanking.slice(0, 6));
    } else {
      setWinners(fullRanking.slice(0, 3));
      setRelativeToUser(fullRanking.slice(currentUserPosition - 2, currentUserPosition + 1));
    }

    setRankedUsers(fullRanking);
    setShowRanking(true);
  };

  return (
    <>
      <RankingButton onButtonClicked={() => _showRanking()} />

      <Dialog
        hidden={!showRanking}
        minWidth={700}
        onDismiss={() => {
          setShowRanking(!showRanking);
          setShowFullRanking(false);
        }}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: <span><Icon iconName='Trophy2Solid' /> RANKING</span>
        }}>
        <div className={styles.dialogContainer}>

          {showFullRanking ?

            rankedUsers.map((ranking: IRankingItem, index: number) => {

              return <RankingItem
                isCurrentUser={currentUser.id === ranking.user.id}
                graphService={props.graphService}
                rankingInfo={ranking}
                position={ranking.position} />;

            })
            :
            <>
            {winners.map((ranking: IRankingItem) => {

              return <RankingItem
                isCurrentUser={currentUser.id === ranking.user.id}
                graphService={props.graphService}
                rankingInfo={ranking}
                position={ranking.position} />;

            })}

              {relativeToUser.length > 0 &&
              <>
                <div className={styles.dividerContainer}>
                  <div className={styles.divider}>
                    <span className={styles.dividerText}>...</span>
                  </div>
                </div>

                {relativeToUser.map((ranking: IRankingItem, index: number) => {

                  return <RankingItem
                    isCurrentUser={currentUser.id === ranking.user.id}
                    graphService={props.graphService}
                    rankingInfo={ranking}
                    position={ranking.position} />;

                })}
              </>}

              {!showFullRanking &&
              <DefaultButton text='See Full Ranking' onClick={() => { setShowFullRanking(true); }} />}

            </>
          }
        </div>
      </Dialog>
    </>
  );
};
export default Ranking;