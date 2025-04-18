import { 
      IonIcon, 
      IonLabel, 
      IonRouterOutlet, 
      IonTabBar, 
      IonTabButton, 
      IonTabs, 
      IonButton,
      IonPopover
  } from '@ionic/react';
import { useRef, useEffect, useState } from 'react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { bookOutline, search, star } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import Favorites from './home.tabs/Favorites';
import Feed from './home.tabs/Feed';
import Search from './home.tabs/Search';
  
  const Home: React.FC = () => {
    const [showTabBar, setShowTabBar] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef<HTMLIonButtonElement | null>(null);
    const tabs = [
      {name:'Feed', tab:'feed',url: '/it35-lab/app/home/feed', icon: bookOutline},
      {name:'Search', tab:'search', url: '/it35-lab/app/home/search', icon: search},
      {name:'Favorites',tab:'favorites', url: '/it35-lab/app/home/favorites', icon: star},
    ]

    const handleButtonClick = () => {
      setShowTabBar(prev => !prev); // Toggle the tab bar visibility
      setShowTooltip(false); // Close the popover on button click
    };
    
    return (
      <IonReactRouter>
        <IonTabs>
        <div>
      {/* Toggle Button */}
      <div
        style={{
          position: 'fixed',
          bottom: showTabBar ? '0px' : '0',
          right: '1rem',
          zIndex: 1000
        }}
        onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
        onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when hover ends
      >
        <IonButton
          ref={buttonRef}
          fill="clear"
          onClick={handleButtonClick} // Close popover on button click
          style={{ fontSize: '15px' }}
        >
          <IonIcon icon={showTabBar ? chevronDownOutline : chevronUpOutline} />
        </IonButton>
      </div>

      {/* Popover */}
      <IonPopover
        isOpen={showTooltip}
        event={undefined}
        showBackdrop={false}
        style={{
          position: 'absolute',
          top: 'calc(45% + 1px)', 
          left: '62%',
          transform: 'translateX(-50%)',
          '--background': '#333',
          '--color': '#fff',
          fontSize: '0.9rem',
          textAlign: 'center',
          pointerEvents: 'none', 
        }}
      >
        <div style={{ padding: '0.3rem 0.6rem' }}>
          {showTabBar ? 'Close Tab Bar' : 'Open Tab Bar'}
        </div>
      </IonPopover>

      {/* Your tab bar logic here */}
    </div>

      {/* Conditional TabBar */}
      {showTabBar && (
        <IonTabBar slot="bottom">
          {tabs.map((item, index) => (
            <IonTabButton key={index} tab={item.tab} href={item.url}>
              <IonIcon icon={item.icon} />
              <IonLabel>{item.name}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      )}
        <IonRouterOutlet>

          <Route exact path="/it35-lab/app/home/feed" render={Feed} />
          <Route exact path="/it35-lab/app/home/search" render={Search} />
          <Route exact path="/it35-lab/app/home/favorites" render={Favorites} />

          <Route exact path="/it35-lab/app/home">
            <Redirect to="/it35-lab/app/home/feed" />
          </Route>

        </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    );
  };
  
  export default Home;