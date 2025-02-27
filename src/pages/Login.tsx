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
        <h1>User Login</h1>
        <IonItem>
        <IonInput label="Text input" placeholder="Username:"></IonInput>
        </IonItem>
        <IonItem>
        <IonInput label="Password input" type="password" value="Password"></IonInput>
      </IonItem>
            <IonButton onClick={() => doLogin()} expand="full">
                Login
            </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;