import { 
  IonButtons,
    IonContent, 
    IonHeader,  
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle 
} from '@ionic/react';

const Feed: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonCard>
      <IonCardHeader>
        <IonCardTitle>Hottest Animes</IonCardTitle>
        <IonCardSubtitle>Click to watch now</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
    </IonCard>
        
      </IonContent>
    </IonPage>
  );
};

export default Feed;