import React, { useState, useEffect } from 'react';
import {
  IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader,
  IonBackButton, IonButtons, IonItem, IonText, IonCol, IonGrid,
  IonRow, IonInputPasswordToggle, IonImg, IonAvatar, IonToast,
  IonModal, IonToolbar, IonTitle, IonFooter
} from '@ionic/react';
import { supabase } from '../utils/supaBaseClient';
import { useHistory } from 'react-router-dom';
import { generateTOTP, verifyTOTP } from '../utils/totpUtils';
import QRCode from 'react-qr-code';

const EditProfile: React.FC = () => {
  const history = useHistory();

  interface TOTPState {
    secret: string;
    qrCodeUrl: string;
    verificationCode: string;
    isSettingUp: boolean;
    isActive: boolean;
    backupCodes: string[];
  }

  const [totpSetup, setTotpSetup] = useState<TOTPState>({
    secret: '',
    qrCodeUrl: '',
    verificationCode: '',
    isSettingUp: false,
    isActive: false,
    backupCodes: [],
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    header: '',
    message: '',
    buttons: ['OK'],
    redirectAfterClose: '' as string | ''
  });

  useEffect(() => {
    const checkTOTPStatus = async () => {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session) return;

      const { data: totpData, error } = await supabase
        .from('user_totp')
        .select('is_active, backup_codes')
        .eq('user_id', session.session.user.id)
        .single();

      if (!error && totpData) {
        setTotpSetup(prev => ({
          ...prev,
          isActive: totpData.is_active,
          backupCodes: totpData.backup_codes
            ? totpData.backup_codes.filter((code: any) => !code.used).map((code: any) => code.code)
            : []
        }));
      }
    };

    checkTOTPStatus();
  }, []);

  const showAlert = (
    header: string,
    message: string,
    isError = false,
    redirectTo = ''
  ) => {
    setAlert({
      isOpen: true,
      header: isError ? 'Error' : header,
      message,
      buttons: ['OK'],
      redirectAfterClose: redirectTo
    });
  };

  const startTOTPSetup = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user?.email) {
      showAlert('Session Expired', 'Please login again', true, '/login');
      return;
    }

    try {
      const { secret, qrCodeUrl } = await generateTOTP(user.email);
      setTotpSetup({
        ...totpSetup,
        secret,
        qrCodeUrl,
        isSettingUp: true,
        isActive: false,
      });
    } catch (err) {
      showAlert('Setup Failed', 'Could not generate 2FA setup', true);
    }
  };

  const verifyTOTPSetup = async () => {
    if (!totpSetup.verificationCode || totpSetup.verificationCode.length !== 6) {
      showAlert('Invalid Code', 'Please enter a valid 6-digit code', true);
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.id) {
      showAlert('Session Expired', 'Please login again', true, '/login');
      return;
    }

    try {
      const isValid = await verifyTOTP(totpSetup.secret, totpSetup.verificationCode);

      if (isValid) {
        const backupCodes = generateBackupCodes();

        const { error: dbError } = await supabase.from('user_totp').upsert({
          user_id: user.id,
          secret: totpSetup.secret,
          backup_codes: backupCodes.map(code => ({ code, used: false })),
          is_active: true,
        });

        if (dbError) throw dbError;

        setTotpSetup({
          ...totpSetup,
          isActive: true,
          isSettingUp: false,
          backupCodes,
        });

        showAlert('2FA Enabled', 'Two-factor authentication is now active!');
      } else {
        showAlert('Invalid Code', 'The verification code is incorrect', true);
      }
    } catch (err) {
      showAlert('Verification Failed', 'Could not enable 2FA', true);
    }
  };

  const disableTOTP = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.id) {
      showAlert('Session Expired', 'Please login again', true, '/login');
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('user_totp')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setTotpSetup({
        secret: '',
        qrCodeUrl: '',
        verificationCode: '',
        isSettingUp: false,
        isActive: false,
        backupCodes: [],
      });

      showAlert('2FA Disabled', 'Two-factor authentication has been turned off');
    } catch (err) {
      showAlert('Disable Failed', 'Could not disable 2FA', true);
    }
  };

  const generateBackupCodes = () => {
    return Array.from({ length: 8 }, () => {
      const part1 = Math.random().toString(36).substring(2, 6);
      const part2 = Math.random().toString(36).substring(2, 6);
      return `${part1}-${part2}`.toUpperCase();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText color="secondary">
                <h3>Two-Factor Authentication</h3>
              </IonText>

              {!totpSetup.isActive ? (
                !totpSetup.isSettingUp ? (
                  <IonButton expand="block" onClick={startTOTPSetup}>
                    Enable 2FA
                  </IonButton>
                ) : (
                  <IonModal isOpen={totpSetup.isSettingUp}>
                    <IonHeader>
                      <IonToolbar>
                        <IonTitle>Setup 2FA</IonTitle>
                      </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                      <p>Scan this QR code with your authenticator app:</p>
                      {totpSetup.qrCodeUrl && (
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                          <QRCode
                            value={totpSetup.qrCodeUrl || ''}
                            size={200}
                            fgColor="#000000"
                            bgColor="#ffffff"
                          />
                        </div>
                      )}
                      <p>Or enter this secret manually: {totpSetup.secret}</p>

                      <IonInput
                        label="Verification Code"
                        type="text"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Enter 6-digit code"
                        value={totpSetup.verificationCode}
                        onIonChange={(e) =>
                          setTotpSetup({ ...totpSetup, verificationCode: e.detail.value! })
                        }
                      />
                    </IonContent>
                    <IonFooter>
                      <IonToolbar>
                        <IonButton expand="block" onClick={verifyTOTPSetup}>
                          Verify and Enable
                        </IonButton>
                        <IonButton
                          expand="block"
                          fill="clear"
                          onClick={() => setTotpSetup({ ...totpSetup, isSettingUp: false })}
                        >
                          Cancel
                        </IonButton>
                      </IonToolbar>
                    </IonFooter>
                  </IonModal>
                )
              ) : (
                <>
                  <p>Two-factor authentication is enabled for your account.</p>
                  {totpSetup.backupCodes.length > 0 && (
                    <IonModal isOpen={totpSetup.backupCodes.length > 0}>
                      <IonHeader>
                        <IonToolbar>
                          <IonTitle>Backup Codes</IonTitle>
                        </IonToolbar>
                      </IonHeader>
                      <IonContent className="ion-padding">
                        <p><strong>Save these codes in a safe place:</strong></p>
                        <ul>
                          {totpSetup.backupCodes.map((code, i) => (
                            <li key={i}>{code}</li>
                          ))}
                        </ul>
                      </IonContent>
                      <IonFooter>
                        <IonToolbar>
                          <IonButton expand="block" onClick={() => setTotpSetup({ ...totpSetup, backupCodes: [] })}>
                            I've Saved These
                          </IonButton>
                        </IonToolbar>
                      </IonFooter>
                    </IonModal>
                  )}
                  <IonButton expand="block" color="danger" onClick={disableTOTP}>
                    Disable 2FA
                  </IonButton>
                </>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      {/* Fixed Alert component */}
      <IonAlert
        isOpen={alert.isOpen}
        onDidDismiss={() => {
          setAlert({ ...alert, isOpen: false });
          if (alert.redirectAfterClose) {
            history.push(alert.redirectAfterClose);
          }
        }}
        header={alert.header}
        message={alert.message}
        buttons={alert.buttons}
      />
    </IonPage>
  );
};

export default EditProfile;
