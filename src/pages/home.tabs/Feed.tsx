import { 
  IonButtons,
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react';
import FeedContainer from '../../components/FeedContainer';

const Feed: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          Feed
        </div>
        <FeedContainer />
      </IonContent>
    </IonPage>
  );
};

export default Feed;