import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { triangle, ellipse, square } from "ionicons/icons";
import { Route, Redirect } from "react-router";
import Home from "./Home";
import FindRide from "./FindRide";
import GiveRide from "./GiveRide";
import "./User.css";
import { useEffect, useRef, useState } from "react";
import { set, get, saveData } from "../../components/storage";

const User: React.FC<{ computingID: string }> = (props) => {
  const [allRides, setAllRides] = useState(Array());
  const [rides, setRides] = useState(Array());
  const [drives, setDrives] = useState(Array());
  const isMounted = useRef(false);

  let saveProp: saveData = {
    ridesList: allRides,
    setRidesList: setAllRides,
    userRides: rides,
    setUserRides: setRides,
    userDrives: drives,
    setUserDrives: setDrives
  }
  
  useEffect(() => {
    const getData = async () => {
      await get("ridesList").then(list => setAllRides(JSON.parse(list.value || "")))
      await get("userRides").then(list => setAllRides(JSON.parse(list.value || "")))
      await get("userDrives").then(list => setAllRides(JSON.parse(list.value || "")))
    }
    getData();
  }, []); // code will only run on the first render (when the page is initialized)

  useEffect(() => {
    const setData = () => {
      set("ridesList", JSON.stringify(allRides));
      set("userRides", JSON.stringify(allRides));
      set("userDrives", JSON.stringify(allRides));
    }
    if (isMounted.current) {
      setData();
    }
    else
      isMounted.current = true;
  }, [allRides, rides, drives]); // code will run whenver the variables are changed (not on first render)

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/user/home">
            <Home computingID={props.computingID} />
          </Route>
          <Route exact path="/user/findRide">
            <FindRide computingID={props.computingID} saveRides={saveProp} />
          </Route>
          <Route path="/user/giveRide">
            <GiveRide computingID={props.computingID} saveRides={saveProp} />
          </Route>
          <Route exact path="/user">
            <Redirect to="/user/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/user/home">
            <IonIcon icon={triangle} />
            <IonLabel id="tabLabel">Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="findRide" href="/user/findRide">
            <IonIcon icon={ellipse} />
            <IonLabel id="tabLabel">Find a Ride</IonLabel>
          </IonTabButton>
          <IonTabButton tab="giveRide" href="/user/giveRide">
            <IonIcon icon={square} />
            <IonLabel id="tabLabel">Give a Ride</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default User;