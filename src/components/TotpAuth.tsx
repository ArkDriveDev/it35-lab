import { useState, useEffect } from 'react';
import {
    IonContent,
    IonButton,
    IonText,
    IonItem,
    IonLabel,
    IonAlert,
} from '@ionic/react';
import { supabase } from '../utils/supaBaseClient';
import { TOTP } from 'otpauth';
import { IonIcon } from '@ionic/react';
import { clipboardOutline } from 'ionicons/icons';

const TotpAuth: React.FC = () => {
    const [secret, setSecret] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const getUserAndTotp = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const uid = user?.id || '';
            setUserId(uid);

            // Fetch existing TOTP record
            if (uid) {
                const { data, error } = await supabase
                    .from('user_totp')
                    .select('secret, is_verified')
                    .eq('user_id', uid)
                    .single();

                if (!error && data?.is_verified) {
                    setSecret(data.secret);
                    setIsEnabled(true);
                }
            }
        };

        getUserAndTotp();
    }, []);

    const generateSecret = async () => {
        try {
            const totp = new TOTP({
                issuer: 'it35-lab',
                label: 'it35-lab:' + userId,
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
                        is_verified: true,
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

    const disableTOTP = async () => {
        try {
            const { error } = await supabase
                .from('user_totp')
                .update({ is_verified: false })
                .eq('user_id', userId);

            if (error) throw error;

            setIsEnabled(false);
            setSecret('');
            setError('');
        } catch (err) {
            console.error(err);
            setError('Error disabling 2FA');
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Secret copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
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
                        <IonLabel className="ion-text-wrap">
                            <p>Your secret key:</p>
                            <IonText color="primary">
                                <strong>{secret}</strong>
                            </IonText>
                        </IonLabel>
                        <IonIcon
                            icon={clipboardOutline}
                            slot="end"
                            style={{ fontSize: '24px', cursor: 'pointer' }}
                            onClick={() => copyToClipboard(secret)}
                        />
                    </IonItem>


                    <IonText>
                        <p>Enter this manually into your Authenticator app.</p>
                    </IonText>
                    <IonButton expand="block" onClick={regenerateSecret}>
                        Regenerate Key
                    </IonButton>
                    <IonButton expand="block" color="danger" onClick={() => setShowAlert(true)}>
                        Disable 2FA
                    </IonButton>
                </>
            )}

            {error && (
                <IonText color="danger">
                    <p>{error}</p>
                </IonText>
            )}

            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={'Are you sure?'}
                message={'Do you really want to disable Two-Factor Authentication?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        },
                    },
                    {
                        text: 'Yes, Disable',
                        handler: () => {
                            disableTOTP();
                            setShowAlert(false);
                        },
                    },
                ]}
            />
        </IonContent>
    );
};

export default TotpAuth;
