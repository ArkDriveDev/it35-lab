import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { homeOutline, informationOutline, logOutOutline, personCircleOutline, rocketOutline } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import Home from './Home';
import About from './About';
import Details from './Details';
import EditProfile from './EditProfile';
import backgroundImg from '../images/Tecno.gif';
const Menu: React.FC = () => {
  const path = [
    { name: 'Home', url: '/it35-lab/app/home', icon: homeOutline },
    { name: 'About', url: '/it35-lab/app/about', icon: rocketOutline },
    { name: 'Details', url: '/it35-lab/app/details', icon: informationOutline },
    { name: 'Profile', url: '/it35-lab/app/editProfile', icon: personCircleOutline }
  ]

  const glow = {
    animation: 'blink 2s infinite',
    filter: 'drop-shadow(0 0 8px white)',
  };

  const h1Style = {
    ...glow,
    animationDelay: '0.1s',
    color: 'skyblue',
  };
  const h2Style = {
    display: 'flex',
    color: 'skyblue',
    margin: '3%'
  };

  const h3Style = {
    display: 'flex',
    color: 'skyblue',
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle style={h1Style}>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
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
          {path.map((item, index) => (
            <IonMenuToggle key={index}>
              <IonItem style={h2Style} routerLink={item.url} routerDirection="forward">
                <IonIcon style={h1Style} icon={item.icon} slot="start"></IonIcon>
                {item.name}
              </IonItem>
            </IonMenuToggle>
          ))}
          <IonButton routerLink="/it35-lab" routerDirection="back" expand="full"
            style={{
              marginTop: '10%',
              width: '90vw',
              maxWidth: '250px',
              height: 'auto',
              padding: '1rem',
            }}>
            <IonIcon icon={logOutOutline} slot="start"> </IonIcon>
            Logout
          </IonButton>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton  style={h1Style}></IonMenuButton>
            </IonButtons>
            <IonTitle style={h3Style}>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRouterOutlet id="main">
            <Route exact path="/it35-lab/app/home" component={Home} />
            <Route exact path="/it35-lab/app/details" component={Details} />
            <Route exact path="/it35-lab/app/about" component={About} />
            <Route exact path="/it35-lab/app/editProfile" component={EditProfile} />

            <Route exact path="/it35-lab/app">
              <Redirect to="/it35-lab/app/home" />
            </Route>
          </IonRouterOutlet>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Menu;