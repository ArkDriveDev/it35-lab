import { 
    IonButton,
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar, 
      useIonRouter,
      IonInput, 
      IonItem, 
  } from '@ionic/react';
  
  const Login: React.FC = () => {
    const navigation = useIonRouter();

    const doLogin = () => {
        navigation.push('/it35-lab/app','forward','replace');
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
          <h1>User Login</h1>
        <IonInput label="Text input" placeholder="Username:"></IonInput>
        <IonItem>
        <IonInput label="Password input" type="password" value="Password"></IonInput>
      </IonItem>
      </IonItem>
            <IonButton onClick={() => doLogin()} expand="full">
                Login
            </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;