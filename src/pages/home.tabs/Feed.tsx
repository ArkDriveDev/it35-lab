import { 
  IonButtons,
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react';
import FeedContainer from '../../components/FeedContainer';

const glow = {
  animation: 'blink 2s infinite',
  filter: 'drop-shadow(0 0 8px white)',
};

const h1Style = {
  ...glow,
  animationDelay: '0.1s',
  color: ' #2B99E2',
  border: ' #2B99E2',
  boxShadow: '0 0 6px #2B99E2, 0 0 6px #2B99E2, 0 0 6px #2B99E2',
};
const Feed: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={h1Style}>Feed</IonTitle>
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