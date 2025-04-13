import { 
    IonButton,
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar, 
      useIonRouter,
      IonInput,
      IonInputPasswordToggle,
      IonAlert,
      IonToast,
      IonCard, 
      IonCardContent, 
  } from '@ionic/react';
  import { useState,useEffect } from 'react';
  import { supabase } from '../utils/supaBaseClient';
  import backgroundImg from '../images/space.gif';
  import Logo from '../images/logo.gif';
  import BGM from '../bgm/PARTY OF YOUR LIFETIME.mp3'
  const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
    return (
      <IonAlert
        isOpen={isOpen}
        onDidDismiss={onClose}
        header="Notification"
        message={message}
        buttons={['OK']}
      />
    );
  };
    const Login: React.FC = () => {
      const navigation = useIonRouter();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [alertMessage, setAlertMessage] = useState('');
      const [showAlert, setShowAlert] = useState(false);
      const [showToast, setShowToast] = useState(false);
  
      useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }, []);
      const h1Style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'purple',
        textShadow: '0 0 8px #d580ff, 0 0 15px #d580ff, 0 0 20px #aa00ff'
      };

      useEffect(() => {
        const audio = new Audio(BGM); 
        audio.loop = true;
        audio.volume = 0.5;
    
       
        audio.play().catch((err) => {
          console.warn('Autoplay failed:', err);
        });
    
        return () => {
          audio.pause(); 
        };
      }, []);
    const doLogin = async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
  
      if (error) {
        setAlertMessage(error.message);
        setShowAlert(true);
        return;
      }
  
      setShowToast(true); 
      setTimeout(() => {
        navigation.push('/it35-lab/app', 'forward', 'replace');
      }, 300);
    };
    
    return (
      <IonPage>
        <IonHeader >
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
        <img
          src={backgroundImg}
          alt="background"
          style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          }}
        />
        <div
          style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70%',
          width: '100%',
        }}
        >
          
        <IonCard
            style={{
            background: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10%',
            width: '500px',
            height: '600px',
            backdropFilter: 'blur(3px)',
            border: '2px solid #ff69b4', 
            boxShadow: '0 0 15px #ff69b4, 0 0 15px #ff69b4, 0 0 15px #ff69b4', 
            borderRadius: '10px',
            animation: 'glowBlink 1.8s infinite' 
         }}>
            <IonCardContent>
              <div style={{
                display: 'flex',
                flexDirection:'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop:'40%'
              }}>

              <img
                src={Logo}
                alt="background"
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '50%',
                  width: '20%',
                  height: '20%',
                  transform: 'translate(-50%, -50%)',
              }}
            />    
             <h1 style={h1Style}>
                USER LOGIN
             </h1>
             <IonInput
                label="Email"
                labelPlacement="floating"
                fill="outline"
                type="email"
                placeholder="Enter Email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                style={{
                boxShadow: '0 0 8px rgba(138, 43, 226, 0.6)', 
                border: '1px solid rgba(138, 43, 226, 0.8)',
                color: 'white', 
                backdropFilter: 'blur(3px)', 
             }}
            />

          <IonInput
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          style={{
             marginTop: '10px',
             boxShadow: '0 0 8px rgba(138, 43, 226, 0.6)',
             border: '1px solid rgba(138, 43, 226, 0.8)',
             color: 'white',
             backdropFilter: 'blur(3px)',
          }}
          >
            <IonInputPasswordToggle slot="end" color="tertiary"></IonInputPasswordToggle>
          </IonInput>
          </div>
          <IonButton onClick={doLogin} expand="full" shape='round' color="tertiary">
            Login
          </IonButton>

          <IonButton routerLink="/it35-lab/Registration" expand="full" fill="clear" shape='round'>
            Don't have an account? Register here
          </IonButton>
        
          <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Login successful! Redirecting..."
            duration={1500}
            position="top"
            color="primary"
          />
            </IonCardContent>
          </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  export default Login;