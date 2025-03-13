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

  // Define the event type as CustomEvent with a 'detail' property
  const handleNameChange = (e: CustomEvent) => {
    setName(e.detail.value); // Access the value from e.detail
  };

  const handleEmailChange = (e: CustomEvent) => {
    setEmail(e.detail.value); // Access the value from e.detail
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
        <IonLabel position="stacked">Enter your name</IonLabel>
        <IonInput
          value={name} // Bind state to input value
          onIonChange={handleNameChange} // Update state on change
          type="text"
          placeholder="Your name"
        />
      </IonItem>
      
      <IonItem>
        <IonLabel position="stacked">Enter your email</IonLabel>
        <IonInput
          value={email} // Bind state to input value
          onIonChange={handleEmailChange} // Update state on change
          type="text"
          placeholder="Your email"
        />
      </IonItem>

        <IonButton id="open-modal" expand="block">
            Signup
        </IonButton>
        <IonButton onClick={() => doLogin()} expand="full">
             go to login
            </IonButton>
        <IonModal ref={modal} trigger="open-modal" onWillDismiss={(event) => onWillDismiss(event)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>your inputs</IonTitle>
              <IonButtons slot="end">
                <IonButton id="open-modal2" strong={true}>
                  confirm
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

                <IonCardContent>{name}</IonCardContent>
            </IonCard>
            </IonItem>
          </IonContent>
        </IonModal>

        <IonModal ref={modal} trigger="open-modal2" onWillDismiss={(event) => onWillDismiss(event)}>    
        <IonHeader> 
            <IonTitle>you confirmed</IonTitle>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonItem>
            <IonCard>
                <IonCardHeader>
                <IonCardTitle>Your Username</IonCardTitle>
                    <IonCardSubtitle>Username:</IonCardSubtitle>
                    </IonCardHeader>

                <IonCardContent>{name}</IonCardContent>
            </IonCard>
              </IonItem>
              <IonItem>
              <IonCard>
                <IonCardHeader>
                <IonCardTitle>Your Email</IonCardTitle>
                    <IonCardSubtitle>Email:</IonCardSubtitle>
                    </IonCardHeader>

                <IonCardContent>{name}</IonCardContent>
            </IonCard>
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}

export default Registration;