import * as React from 'react';
import { IRankingProps } from './IRankingProps';
import styles from './Ranking.module.scss';
import { DefaultButton, Dialog, DialogType, Icon } from 'office-ui-fabric-react';
import { useEffect, useState } from 'react';
import RankingService from 'services/RankingService';
import IRankingItem from 'data/IRankingItem';
import RankingItem from '../RankingItem/RankingItem';

const Ranking: React.FunctionComponent<IRankingProps> = props => {

  const [rankedUsers, setRankedUsers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [relativeToUser, setRelativeToUser] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  const [showFullRanking, setShowFullRanking] = useState(false);


  const _showRanking = async (): Promise<void> => {
    const rankingService = new RankingService(props.graphClient);
    const fullRanking: Array<IRankingItem> = await rankingService.getFullRanking();

    const currentUserPosition: number = fullRanking.map(ranking => ranking.user.id).indexOf(props.currentUser.id) + 1;

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
      <div className={styles.rankingCrown} onClick={async () => _showRanking()}>
        <div className={styles.containerAvatar}>
          <div className={styles.containerRankingCrownIcon}>
            <span className={'ant-avatar ant-avatar-circle ant-avatar-icon ' + styles.rankingCrownIcon + ' rankingCrown'}
              style={{ width: 42, height: 42, lineHeight: 42, fontSize: 21 }}>
              <span role="img" aria-label="crown" className={'anticon anticon-crown'}>
                <svg viewBox="64 64 896 896" focusable="false" data-icon="crown" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M899.6 276.5L705 396.4 518.4 147.5a8.06 8.06 0 00-12.9 0L319 396.4 124.3 276.5c-5.7-3.5-13.1 1.2-12.2 7.9L188.5 865c1.1 7.9 7.9 14 16 14h615.1c8 0 14.9-6 15.9-14l76.4-580.6c.8-6.7-6.5-11.4-12.3-7.9zm-126 534.1H250.3l-53.8-409.4 139.8 86.1L512 252.9l175.7 234.4 139.8-86.1-53.9 409.4zM512 509c-62.1 0-112.6 50.5-112.6 112.6S449.9 734.2 512 734.2s112.6-50.5 112.6-112.6S574.1 509 512 509zm0 160.9c-26.6 0-48.2-21.6-48.2-48.3 0-26.6 21.6-48.3 48.2-48.3s48.2 21.6 48.2 48.3c0 26.6-21.6 48.3-48.2 48.3z"></path>
                </svg>
              </span>
            </span>
          </div>
          <div className={styles.containerLetters}>
            <span className={styles.letter1}>R</span>
            <span className={styles.letter2}>A</span>
            <span className={styles.letter3}>N</span>
            <span className={styles.letter4}>K</span>
            <span className={styles.letter5}>I</span>
            <span className={styles.letter6}>N</span>
            <span className={styles.letter7}>G</span>
          </div>
        </div>
      </div>

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
                isCurrentUser={props.currentUser.id === ranking.user.id}
                graphClient={props.graphClient}
                rankingInfo={ranking}
                position={ranking.position} />;

            })
            :
            <>
              {winners.map((ranking: IRankingItem) => {

                return <RankingItem
                  isCurrentUser={props.currentUser.id === ranking.user.id}
                  graphClient={props.graphClient}
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
                      isCurrentUser={props.currentUser.id === ranking.user.id}
                      graphClient={props.graphClient}
                      rankingInfo={ranking}
                      position={ranking.position} />;

                  })}
                </>

              }

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