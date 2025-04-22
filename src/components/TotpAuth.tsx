import { useState, useEffect } from 'react';
import {
    IonContent,
    IonButton,
    IonText,
    IonItem,
    IonLabel,
    IonAlert,
    IonToast,
    IonCard,
    IonCardContent
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
    const [showPopover, setShowPopover] = useState(false);
    const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
    const [showToast, setShowToast] = useState(false);

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

    const handleCopyClick = async (e: React.MouseEvent) => {
        try {
            await navigator.clipboard.writeText(secret);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        setPopoverEvent(e.nativeEvent);
        setShowPopover(true);
    };

    const handleMouseLeave = () => {
        setShowPopover(false);
    };

    return (
        <IonContent className="ion-padding">
            <IonCard>
                <IonCardContent>
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

                                <div
                                    slot="end"
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleCopyClick}
                                    onMouseEnter={() => setShowPopover(true)}
                                    onMouseLeave={() => setShowPopover(false)}
                                >
                                    <IonIcon icon={clipboardOutline} style={{ fontSize: '24px', marginRight: '6px' }} />
                                    <IonText color="primary"><small>Copy</small></IonText>

                                    {/* Custom Tooltip */}
                                    {showPopover && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '100%',
                                                right: 0,
                                                marginBottom: '6px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                color: '#fff',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                whiteSpace: 'nowrap',
                                                zIndex: 9999,
                                            }}
                                        >
                                            Copy to clipboard
                                        </div>
                                    )}
                                </div>
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

                    <IonToast
                        isOpen={showToast}
                        message="Copied to clipboard!"
                        duration={1500}
                        onDidDismiss={() => setShowToast(false)}
                        color="success"
                    />
                </IonCardContent>
            </IonCard>

        </IonContent>
    );
};

export default TotpAuth;