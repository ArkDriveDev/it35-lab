import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonText,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { supabase } from '../utils/supaBaseClient';
import { TOTP } from 'otpauth';

const EditProfile: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
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

  const verifyCode = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_totp')
        .select('secret')
        .eq('user_id', userId)
        .single();

      if (fetchError || !data?.secret) throw fetchError || new Error('Secret not found');

      const totp = new TOTP({
        secret: data.secret,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });

      const isValid = totp.validate({ token: verificationCode, window: 1 }) !== null;

      if (isValid) {
        const { error: updateError } = await supabase
          .from('user_totp')
          .update({ is_verified: true })
          .eq('user_id', userId);

        if (updateError) throw updateError;

        setIsEnabled(true);
        setError('');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      console.error(err);
      setError('Verification failed');
    }
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
        ) : !isEnabled ? (
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
            <IonItem>
              <IonLabel position="floating">6-digit code</IonLabel>
              <IonInput
                value={verificationCode}
                onIonChange={(e) => setVerificationCode(e.detail.value!)}
                placeholder="Enter verification code"
              />
            </IonItem>
            <IonButton expand="block" onClick={verifyCode}>
              Verify Code
            </IonButton>
          </>
        ) : (
          <IonText color="success">
            <p>✅ Two-Factor Authentication is enabled!</p>
          </IonText>
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
