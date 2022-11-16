import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonToolbar,} from "@ionic/react";
import "./Home.css";
import { saveData} from "../../components/storage";
import { useEffect, useState } from "react";

const Tab1: React.FC<{computingID:string, rideData : saveData}> = (props) => {
  const[pastTrips, setPastTrips] = useState(Array<string>);
  useEffect(() =>{
    let destinationCard = document.getElementById("destination")!;
    setCardsList(destinationCard, pastTrips);
  }, [pastTrips])
  useEffect(() =>{
    console.log(props.rideData.userDrives);
    let driveCard = document.getElementById("driver")!;
    let drives = JSON.parse(JSON.stringify(props.rideData.userDrives));
    for(let i = 0; i<drives.length; i++){
      let currDrive = JSON.parse(drives[i]);
      let date = new Date(currDrive.departDate + " " + currDrive.departTime);
      let today = new Date();
      if(date < today){
        setPastTrips((prevArr:any) => [...prevArr, JSON.stringify(currDrive)])
        drives.splice(i,1);
        i--;
      }
    }
    setCardsList(driveCard, drives);
  }, [props.rideData.userDrives])
  useEffect(() =>{
    console.log(props.rideData.userRides);
    let rideCard = document.getElementById("rider")!;
    let rides = JSON.parse(JSON.stringify(props.rideData.userRides));
    for(let i = 0; i<rides.length; i++){
      let currRide = JSON.parse(rides[i]);
      let date = new Date(currRide.departDate + " " + currRide.departTime);
      let today = new Date();
      if(date < today){
        setPastTrips((prevArr:any) => [...prevArr, JSON.stringify(currRide)])
        rides.splice(i,1);
        i--;
      }
    }
    setCardsList(rideCard, rides);
  }, [props.rideData.userRides])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="header">
          <p id="title">Hoo's Driving</p>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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

const setCardsList = (cardElement: HTMLElement, rideList: Array<string>) =>{
  cardElement.innerHTML = "";
  let ionList = document.createElement('ion-list');

    for (let i = 0; i < rideList.length; i++) {
      let currRide = JSON.parse(rideList[i]);
      let date = new Date(currRide.departDate + " " + currRide.departTime);
      let currDate = date.toDateString();
      let time = date.toLocaleTimeString();
      let ionDivider = document.createElement('ion-item-divider');
      ionDivider.innerHTML = `<ion-label>${currDate}</ion-label>`;
      let ionItem = document.createElement('ion-item');
      ionItem.innerHTML = `<ion-label>${time}&nbsp&nbsp&nbsp&nbsp${currRide.departCity} to ${currRide.arriveCity}</ion-label>`;
      ionList.appendChild(ionDivider);
      ionList.appendChild(ionItem);
    }
    cardElement.appendChild(ionList);
}