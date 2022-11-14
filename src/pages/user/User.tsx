import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { triangle, ellipse, square } from "ionicons/icons";
import { Route, Redirect } from "react-router";
import Home from "./Home";
import FindRide from "./FindRide";
import GiveRide from "./GiveRide";
import "./User.css";
import { useEffect, useRef, useState } from "react";
import { fetchAPI } from "../../components/dataStructures";
import { saveData } from "../../components/dataStructures";
import { set, get } from "../../components/storage";


const [apiURL, setAPIURL] = useState("");
const [jsonString, setJSONString] = useState("");
const [allRides, setAllRides] = useState(Array());
const [rides, setRides] = useState(Array());
const [drives, setDrives] = useState(Array());
const isMounted = useRef(false);


const User: React.FC<{ computingID: string }> = (props) => {

  useEffect(() => {
    const fetchJSON = async () => {
      await fetch(apiURL, { headers: { Accept: 'application/json', }, })
        .then(response => response.json())
        .then(data => setJSONString(data));
    }
    fetchJSON();
  }, [apiURL]);

  useEffect(() => {
    const getData = async () => {
      await get("ridesList").then(list => setAllRides(JSON.parse(list.value || "")))
      await get("userRides").then(list => setAllRides(JSON.parse(list.value || "")))
      await get("userDrives").then(list => setAllRides(JSON.parse(list.value || "")))
    }
    getData();
  }, []);

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
  }, [allRides, rides, drives]);

  let childProps = setUpProps();

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/user/home">
            <Home computingID={props.computingID} />
          </Route>
          <Route exact path="/user/findRide">
            <FindRide computingID={props.computingID} fetchData={childProps.fetch} saveRides={childProps.save} />
          </Route>
          <Route path="/user/giveRide">
            <GiveRide computingID={props.computingID} fetchData={childProps.fetch} saveRides={childProps.save} />
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

const setUpProps = () => {
  let fetch: fetchAPI = {
    url: apiURL,
    setURL: setAPIURL,
    json: jsonString,
  }

  let save: saveData = {
    ridesList: allRides,
    setRidesList: setAllRides,
    userRides: rides,
    setUserRides: setRides,
    userDrives: drives,
    setUserDrives: setDrives
  }

  return { fetch, save };
};