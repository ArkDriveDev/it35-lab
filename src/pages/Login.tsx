import { 
    IonButton,
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar, 
      useIonRouter,
      IonItem,
      IonInput
  } from '@ionic/react';
  
  const Login: React.FC = () => {
    const navigation = useIonRouter();

    const doLogin = () => {
        navigation.push('/it35-lab/app','forward','replace');
    }
    const doregister = () => {
      navigation.push('/it35-lab/registration','forward','replace');
  }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
        <IonItem>
        <IonInput label="Text input" placeholder="Username:"></IonInput>
        </IonItem>
        <IonItem>
        <IonInput label="Text input" placeholder="Email:"></IonInput>
      </IonItem>
            <IonButton onClick={() => doLogin()} expand="full">
                Login
            </IonButton>
            <IonButton onClick={() => doregister()} expand="full">
               register
            </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;