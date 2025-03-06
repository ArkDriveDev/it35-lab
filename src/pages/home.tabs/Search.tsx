import { 
    IonButtons,
      IonContent, 
      IonHeader, 
      IonSearchbar,
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import SearchContainer from '../../components/SearchContainer';
  
  const Search: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
            </IonButtons>
            <IonTitle>Search</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <SearchContainer/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Search;