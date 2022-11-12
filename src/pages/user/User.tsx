import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { triangle, ellipse, square } from "ionicons/icons";
import { Route, Redirect } from "react-router";
import Home from "./Home";
import FindRide from "./FindRide";
import GiveRide from "./GiveRide";
import "./User.css";

const User: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/user/home">
            <Home />
          </Route>
          <Route exact path="/user/findRide">
            <FindRide />
          </Route>
          <Route path="/user/giveRide">
            <GiveRide />
          </Route>
          <Route exact path="/user">
            <Redirect to="/user/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/user/home">
            <IonIcon icon={triangle} />
            <IonLabel id = "tabLabel">Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="findRide" href="/user/findRide">
            <IonIcon icon={ellipse} />
            <IonLabel id = "tabLabel">Find a Ride</IonLabel>
          </IonTabButton>
          <IonTabButton tab="giveRide" href="/user/giveRide">
            <IonIcon icon={square} />
            <IonLabel id = "tabLabel">Give a Ride</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default User;
