import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
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
import { get } from "./components/storage";

setupIonicReact();

const App: React.FC = () => {
  let redirect = <Redirect to ="/"/>;
  let [id, setID] = useState(""); //like a variable, comes with a setter
  let [authenticated, setAuthenticated] = useState(redirect);
  useEffect(() => { //allows you to update the UI (can set when to run --> on every render, on first render, or when a state variable changes)
    get('user') //fetches the value stored under key 'user" --> uses the method from storage.tsx (uses preferences capacitor)
      .then(user => {
        setID(user.value || "");  // both || and ?? will set the default value if the given value is null/undefined/etc. 
        if (user.value)
          redirect = (<Redirect to="/user" />);
        else
          redirect = (<Redirect to="/signin" />);
        setAuthenticated(redirect);
      });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/signIn">
            {/* passes the setter for ID to the child component (SignIn) */}
            <SignIn setUserID={setID} /> 
          </Route>
          <Route exact path="/user">
            <User computingID={id} />
          </Route>
          <Route exact path="/">
            {/* because authenticated is a JSX element (HTML), it can be placed in brackets and the value of authenticated is "returned" */}
            {authenticated}
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
