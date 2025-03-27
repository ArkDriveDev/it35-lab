import { 
    IonButton,
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar, 
      useIonRouter,
      IonItem,
      IonInput,
      IonInputPasswordToggle
  } from '@ionic/react';
  import { useState } from 'react';
  const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div style={{
          display: 'flex',
          flexDirection:'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:'5%'
        }}>
         
          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>USER LOGIN</h1>
          <IonInput
            label="Email" 
            labelPlacement="floating" 
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
          />
          <IonInput style={{ marginTop:'10px' }}      
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
          </IonInput>
        </div>
        <IonButton onClick={doLogin} expand="full" shape='round'>
          Login
        </IonButton>

        <IonButton routerLink="/it35-lab/register" expand="full" fill="clear" shape='round'>
          Don't have an account? Register here
        </IonButton>

        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;