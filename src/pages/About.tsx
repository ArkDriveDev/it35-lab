import { 
    IonButtons,
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar,
      IonItem, 
      IonLabel, 
      IonList 
  } from '@ionic/react';
  
  const About: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
            </IonButtons>
            <IonTitle>About</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonList>
      <IonItem>
        <IonLabel>Terms and Registration</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Settings</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Support and Services</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Information</IonLabel>
      </IonItem>
    </IonList>
        </IonContent>
      </IonPage>
    );
  };
  
  export default About;