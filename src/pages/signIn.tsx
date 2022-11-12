import './signIn.css';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, useIonAlert } from '@ionic/react';
import { useHistory } from "react-router-dom";
import { set, get } from "../components/storage";

const isAuthenticated: boolean = true;
const computingID: string = "abc1df"


const SignIn: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const routeChange = () => {
    window.open("https://netbadge.virginia.edu");
    if (isAuthenticated) {
      let path = `/user`;
      history.push(path);
      setUsername(computingID);
    }
    else {
      presentAlert({
        header: 'Login failed',
        message: 'Sorry, user authentication failed. Try again.',
        buttons: ['OK'],
      });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="header">
          <img src="/assets/uva-logo.png" alt="UVA logo" width="350" />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="container">
          <p id="icon">HD</p>
          <p id="appName">Hoo's Driving</p>
          <p id="description">An app for cheap and convinient rideshare</p>
          <IonButton onClick={routeChange}>Login With NetBadge</IonButton>
        </div>
      </IonContent>
      <IonFooter>
        <IonToolbar id="footer">
          <h3>Made by UVA students for UVA students</h3>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SignIn;

const setUsername = async (str: string) => {
  set("user", str);
}