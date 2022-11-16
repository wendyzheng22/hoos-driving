import { IonContent, IonHeader, IonPage, IonToolbar, useIonAlert } from '@ionic/react';
import './FindRide.css';
import { saveData, clearAll } from "../../components/storage";
import { getData } from "../../components/fetchAPI";
import { showAlert } from "./GiveRide"
import { useEffect, useRef } from 'react';

const Tab2: React.FC<{ computingID: string, saveRides: saveData }> = (props) => {
  const [presentAlert] = useIonAlert();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      let div = document.getElementById("ridesList")!;
      div.innerHTML = "";
      for (let i = 0; i < props.saveRides.ridesList.length; i++) {
        let currRide = JSON.parse(props.saveRides.ridesList[i]);
        let today = new Date();
        let travelDate = new Date(currRide.departDate)
        if (travelDate >= today) {
          getData('https://www.fueleconomy.gov/ws/rest/vehicle/' + currRide.carID)
            .then(carData => {
              let card = createCard(i, currRide, carData, addUserToRide);
              div.appendChild(card)
            })
        }
      }
    }
    else
      isMounted.current = true;
  }, [props.saveRides.ridesList])

  function addUserToRide(id: number, rideObject: any): void {
    let ride = JSON.parse(JSON.stringify(rideObject)); //makes a clone of ride object
    
    if (ride.carRiders.indexOf(props.computingID) < 0){
      if (!(ride.carRiders))
        ride.carRiders = props.computingID;
      else
      ride.carRiders += ", " + props.computingID;

      let rideList = [...props.saveRides.ridesList];
      rideList[id] = JSON.stringify(ride);
      props.saveRides.setRidesList(rideList);

      props.saveRides.setUserRides((prevArr:any) =>[...prevArr, JSON.stringify(ride)])

      showAlert(presentAlert, 'Success', 'Successfully joined the carpool!');
    }
    else
      showAlert(presentAlert, 'Error', 'You have already joined the carpool');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="header">
          <p id="title">Hoo's Driving</p>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="ridesList"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;

function calculateSeats(rideObject: any): number {
  let seats = rideObject.carSeats.toString();
  let riders = rideObject.carRiders.toString();
  let riderCount = 0;
  if (riders.length !== 0) {
    riderCount++;
    for (let i = 0; i < riders.length; i++) {
      if (riders.charAt(i) === ",")
        riderCount++;
    }
  }
  return seats - riderCount;
}

const formatDate = (date: string) => {
  let numbers = date.split('-');
  return ([numbers[1], numbers[2], numbers[0]].join('/'));
}

const formatTime = (time: string) => {
  let nums = time.split(':');
  let hours = parseInt(nums[0])
  if (hours / 12.0 > 1)
    return (hours % 12).toString() + ':' + nums[1];
  else
    return time;
}

const createCard = (index: number, ride: any, carData: any, onClick: Function) => {
  let divCard = document.createElement('div');
  divCard.id = "rides";

  let divTravel = document.createElement('div');
  let travelInfo = `<h2 id = "subtitle">Travel Info</h2><b>Date: </b>${formatDate(ride.departDate)}<br><b>Departure Time: </b>${formatTime(ride.departTime)}<br><b>ETA: </b>${formatTime(ride.eta)}<br><b>Available Seats: </b>${calculateSeats(ride)}<br>`;
  divTravel.innerHTML = travelInfo;

  let divCar = document.createElement('div');
  let carInfo = `<h2 id = "subtitle">Car Info</h2><b>Year:&nbsp&nbsp</b>${ride.carYear}<br><b>Make:&nbsp&nbsp</b>${ride.carMake}<br><b>Model:&nbsp&nbsp</b>${ride.carModel}<br><b>Miles Per Gallon:&nbsp&nbsp</b>${carData['comb08'] ?? "N/A"}` +
    `<br><b>CO2 Emissions (grams/mile):&nbsp&nbsp</b>${carData['co2'] ?? "N/A"}<br><br>`
  divCar.innerHTML = carInfo;

  divCard.appendChild(divTravel);
  divCard.appendChild(divCar);

  let button = document.createElement('ion-button');
  button.addEventListener('click', () => onClick(index, ride));
  button.innerHTML = "Carpool";

  let divButton = document.createElement('div');
  divButton.classList.add("center");
  divButton.appendChild(button);

  let ionCardContent = document.createElement('ion-card-content');
  ionCardContent.appendChild(divCard);
  ionCardContent.appendChild(divButton);

  let ionCardHeader = document.createElement('ion-card-header');
  ionCardHeader.innerHTML = `<ion-card-title>${ride.departCity} to ${ride.arriveCity}</ion-card-title>`

  let ionCard = document.createElement('ion-card');
  ionCard.appendChild(ionCardHeader);
  ionCard.appendChild(ionCardContent);
  return ionCard;
}

