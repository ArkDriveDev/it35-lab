import React, { useState, useRef } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonInput,
  useIonRouter,
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle,
  IonLabel
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';

function Registration() {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
 const navigation = useIonRouter();

    const doLogin = () => {
        navigation.push('/it35-lab','forward','replace');
    }
  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      setMessage(`Hello, ${event.detail.data}!`);
    }
  }
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  
  const handleNameChange = (e: CustomEvent) => {
    setName(e.detail.value); 
  };

  const handleEmailChange = (e: CustomEvent) => {
    setEmail(e.detail.value); 
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <IonItem>
        <IonLabel position="stacked">Enter your Username</IonLabel>
        <IonInput
          value={name} 
          onIonChange={handleNameChange} 
          type="text"
          placeholder="Your Username"
        />
      </IonItem>
      
      <IonItem>
        <IonLabel position="stacked">Enter your Email</IonLabel>
        <IonInput
          value={email} 
          onIonChange={handleEmailChange} 
          type="text"
          placeholder="Your Email"
        />
      </IonItem>

        <IonButton id="open-modal" expand="block">
            Signup
        </IonButton>
            <IonButton onClick={() => doLogin()} expand="full">
              go to login
            </IonButton>
            <IonModal 
              ref={modal} 
              trigger="open-modal" 
              onWillDismiss={(event) => onWillDismiss(event)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
       
                    <IonButton onClick={() => modal.current?.dismiss(null, 'cancel')}>Cancel</IonButton>
                  </IonButtons>
                  <IonTitle>your inputs</IonTitle>
                  <IonButtons slot="end">
                    <IonButton strong={true} onClick={() => confirm()}>
                        Confirm
                    </IonButton>
                 </IonButtons>
                </IonToolbar>
              </IonHeader>
            <IonContent className="ion-padding">
              <IonItem>
              <IonCard>
                <IonCardHeader>
                <IonCardTitle>Your username input</IonCardTitle>
                    <IonCardSubtitle>Username:</IonCardSubtitle>
                    </IonCardHeader>

                <IonCardContent>{name}</IonCardContent>
              </IonCard>
              </IonItem>
              <IonItem>
              <IonCard>
                <IonCardHeader>
                <IonCardTitle>Your email input</IonCardTitle>
                    <IonCardSubtitle>Email:</IonCardSubtitle>
                    </IonCardHeader>

                <IonCardContent>{email}</IonCardContent>
            </IonCard>
            </IonItem>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
}

export default Registration;