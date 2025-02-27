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
    IonCardTitle,
    IonButton
} from '@ionic/react';

const Details: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonCard>
      <IonCardHeader>
        <IonCardTitle>These about these Application</IonCardTitle>
        <IonCardSubtitle>Click the button for details</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
      <IonButton>click for details</IonButton>
      </IonCardContent>
    </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Details;