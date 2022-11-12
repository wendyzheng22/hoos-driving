import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonToolbar,} from "@ionic/react";
import "./Home.css";
import { get } from "../../components/storage";
import { getCount, getRide } from "./FindRide";

let rides: Array<any> = Array();
let drives: Array<any> = Array();
let destinations: Array<any> = Array();
const Tab1: React.FC<{computingID:string}> = (props) => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="header">
          <p id="title">Hoo's Driving</p>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="center">
          <IonButton onClick={() => fillCards()}>Refresh</IonButton>
        </div>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="center"><b>Upcoming Rides</b></IonCardTitle>
          </IonCardHeader>
          <IonCardContent id="rider">
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="center"><b>Upcoming Drives</b></IonCardTitle>
          </IonCardHeader>
          <IonCardContent id="driver">
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="center"><b>Recent Trips</b></IonCardTitle>
          </IonCardHeader>
          <IonCardContent id="destination">
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

const getRides = async () => {
  get('user').then(user => {
    let userID: string = user.value!;
    getCount().then((count => {
      drives = new Array();
      rides = new Array();
      destinations = new Array();
      for (let i = 1; i <= count; i++) {
        getRide(i).then((ride) => {
          let driver: string = ride.carDriver;
          let riders: string = ride.carRiders;
          let today = new Date();
          let travelDate = new Date(ride.departDate)
          if (travelDate < today) {
            destinations.push(ride);
          }
          else {
            if (userID === driver) {
              drives.push(ride);
            }
            if (riders.includes(userID)) {
              rides.push(ride);
            }
          }
        })
      }
    }))
  })
}

const fillCards = () => {
  getRides().then(() => {
    let rideCard = document.getElementById("rider");
    rideCard!.innerHTML = "";
    let driveCard = document.getElementById("driver");
    driveCard!.innerHTML = "";
    let destinationCard = document.getElementById("destination");
    destinationCard!.innerHTML = "";
    let ionList = document.createElement('ion-list');


    for (let i = 0; i < rides.length; i++) {
      let date = new Date(rides[i].departDate + " " + rides[i].departTime);
      let currDate = date.toDateString();
      let time = date.toLocaleTimeString();
      let ionDivider = document.createElement('ion-item-divider');
      ionDivider.innerHTML = `<ion-label>${currDate}</ion-label>`;
      let ionItem = document.createElement('ion-item');
      ionItem.innerHTML = `<ion-label>${time}&nbsp&nbsp&nbsp&nbsp${rides[i].departCity} to ${rides[i].arriveCity}</ion-label>`;
      ionList.appendChild(ionDivider);
      ionList.appendChild(ionItem);
    }
    rideCard?.appendChild(ionList);

    ionList = document.createElement('ion-list');

    for (let i = 0; i < drives.length; i++) {
      let date = new Date(drives[i].departDate + " " + drives[i].departTime);
      let currDate = date.toDateString();
      let time = date.toLocaleTimeString();
      let ionDivider = document.createElement('ion-item-divider');
      ionDivider.innerHTML = `<ion-label>${currDate}</ion-label>`;
      let ionItem = document.createElement('ion-item');
      ionItem.innerHTML = `<ion-label>${time}&nbsp&nbsp&nbsp&nbsp${drives[i].departCity} to ${drives[i].arriveCity}</ion-label>`;
      ionList.appendChild(ionDivider);
      ionList.appendChild(ionItem);
    }
    driveCard?.appendChild(ionList);

    ionList = document.createElement('ion-list');

    for (let i = 0; i < destinations.length; i++) {
      let date = new Date(destinations[i].departDate + " " + destinations[i].departTime);
      let ionItem = document.createElement('ion-item');
      let currDate = date.toLocaleDateString();
      ionItem.innerHTML = `<ion-label>${currDate}&nbsp&nbsp&nbsp&nbsp${destinations[i].departCity} to ${destinations[i].arriveCity}</ion-label>`;
      ionList.appendChild(ionItem);
    }
    destinationCard?.appendChild(ionList);
  })
}