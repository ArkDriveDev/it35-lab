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
  IonLabel,
  IonAlert,
  IonInputPasswordToggle
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';
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
    setShowAlert(true); // Show alert after dismissing modal
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
  const [showAlert, setShowAlert] = useState(false);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Create your account</h1>

        <IonInput label="Username" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter a unique username" style={{ marginTop: '15px' }} />
        <IonInput label="First Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your first name"  style={{ marginTop: '15px' }} />
        <IonInput label="Last Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your last name" style={{ marginTop: '15px' }} />
        <IonInput label="Email" labelPlacement="stacked" fill="outline" type="email" placeholder="youremail@nbsc.edu.ph" value={email} onIonChange={e => setEmail(e.detail.value!)} style={{ marginTop: '15px' }} />
        <IonInput label="Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Enter password" style={{ marginTop: '15px' }} >
        <IonInputPasswordToggle slot="end" />
        </IonInput>
        <IonInput label="Confirm Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Confirm password" style={{ marginTop: '15px' }} >
          <IonInputPasswordToggle slot="end" />
        </IonInput>

          <IonButton expand="full" shape='round' style={{ marginTop: '15px' }}>
            Register
          </IonButton>
          <IonButton routerLink="/it35-lab" expand="full" fill="clear" shape='round'>
            Already have an account? Sign in
          </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default Registration;