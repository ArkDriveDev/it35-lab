import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { supabase } from '../utils/supaBaseClient';
import { TOTP } from 'otpauth';

const EditProfile: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || '');
    };
    getUser();
  }, []);

  const generateSecret = async () => {
    try {
      const totp = new TOTP({
        issuer: 'YourAppName',
        label: 'YourAppName:' + userId,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });

      const newSecret = totp.secret.base32;

      const { error: insertError } = await supabase
        .from('user_totp')
        .upsert(
          {
            user_id: userId,
            secret: newSecret,
            is_verified: false,
          },
          { onConflict: 'user_id' }
        );

      if (insertError) throw insertError;

      setSecret(newSecret);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error generating or saving secret');
    }
  };

  const regenerateSecret = async () => {
    setSecret('');
    generateSecret();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Profile - 2FA Setup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Two-Factor Authentication</h2>
        </IonText>

        {!secret ? (
          <IonButton expand="block" onClick={generateSecret}>
            Generate Secret Key
          </IonButton>
        ) : (
          <>
            <IonItem>
              <IonLabel>Your secret key:</IonLabel>
              <IonText color="primary">
                <strong>{secret}</strong>
              </IonText>
            </IonItem>
            <IonText>
              <p>Enter this manually into your Authenticator app.</p>
            </IonText>
            <IonButton expand="block" onClick={regenerateSecret}>
              Regenerate Key
            </IonButton>
          </>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
