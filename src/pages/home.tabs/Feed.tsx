import { 
  IonButtons,
    IonContent, 
    IonHeader,  
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
} from '@ionic/react';

const Feed: React.FC = () => {
  const Gowebsite= () => {
    // Open the link programmatically
    window.open('https://animepahe.ru/', '_blank', 'noopener,noreferrer');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
    <IonCard>
      <img alt="Silhouette of mountains" src="https://wallpapers.com/images/hd/all-anime-epic-japanese-anime-characters-2e92kjl5ii5i7rwz.jpg"onClick={Gowebsite}/>
      <IonCardHeader>
        <IonCardTitle>Hottest Animes</IonCardTitle>
        <IonCardSubtitle>Click to watch now</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>The best Animes of 2025 can be watch now in Animepahe.com click the image to redirect to the website.</IonCardContent>
    </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Feed;