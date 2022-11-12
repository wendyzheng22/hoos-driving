import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import User from "./pages/user/User";
import SignIn from "./pages/signIn";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useEffect, useState } from "react";
import { clearAll, get} from "./components/storage";

setupIonicReact();

const App: React.FC = () => {
  let[id, setID] = useState(""); //like a variable, comes with a setter

  useEffect(() =>{ //allows you to update the UI (can set when to run --> on every render, on first render, or when a state variable changes)
    get('user') //fetches the value stored under key 'user" --> uses the method from storage.tsx (uses preferences capacitor)
    .then(user => {console.log(user);setID(user.value ?? "")}); // ?? defines the default value for when the first value is null
  })
  console.log(id);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/signIn">
            <SignIn setUserID = {setID} />
          </Route>
          <Route exact path="/user">
            <User computingID = {id} />
          </Route>
          <Route exact path="/">
            {(id && authenticateUser(id))} 

          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;

const authenticateUser = (id:string) => { //authenticates the user
  if(id != ""){
    return(<Redirect to="/user" />); //if the user has logged in already, they're redirected to home
  }
  return(<Redirect to="/signIn" />); // else, they're redirected to sign in
};