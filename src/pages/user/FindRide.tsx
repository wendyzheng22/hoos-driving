import { IonButton, IonContent, IonHeader, IonPage, IonToolbar, useIonAlert } from '@ionic/react';
import './FindRide.css';
import { set, get } from "../../components/storage";
import { fetchAPI } from "../../components/dataStructures";
import { saveData } from "../../components/dataStructures";

let mpg: string;
let co2: string;


const Tab2: React.FC<{computingID:string , fetchData:fetchAPI, saveRides :saveData}> = (props) => {
  const [presentAlert] = useIonAlert();

  const fetchVehicle = async (id: any) => {
    let carID = id.toString();
    await fetch('https://www.fueleconomy.gov/ws/rest/vehicle/' 
    + carID, { headers: { Accept: 'application/json', }, })
      .then(response => response.json())
      .then(data => {
        mpg = data['comb08'] ?? "N/A";
        co2 = data['co2'] ?? "N/A"
      });
  }
  
  function addUserToRide(id: number, rideObject: any): void {
    if (!(rideObject.carRiders))
        rideObject.carRiders = props.computingID;
      else
        rideObject.carRiders += ", " + props.computingID;
      set(id.toString(), JSON.stringify(rideObject));
      presentAlert({
        header: 'Success',
        message: 'Successfully joined the carpool!',
        buttons: ['OK'],
      })
  }

  const createCards = () => {
    var divContainer = document.getElementById("ridesList");
    divContainer!.innerHTML = "";
  
    getCount().then((count => {
      for (let i = 1; i <= count; i++) {
        getRide(i).then((ride) => {
          let today = new Date();
          let travelDate = new Date(ride.departDate)
          if (travelDate >= today) {
            let dCity: string = ride.departCity;
            let aCity: string = ride.arriveCity;
            let dDate: string = formatDate(ride.departDate);
            let dTime: string = formatTime(ride.departTime);
            let eta: string = formatTime(ride.eta);
            let seats: number = calculateSeats(ride);
            let year: string = decodeURIComponent(ride.carYear);
            let make: string = decodeURIComponent(ride.carMake);
            let model: string = decodeURIComponent(ride.carModel);
            fetchVehicle(ride.carID).then(() => {
              let divRides = document.createElement('div');
              divRides.id = "rides";
  
              let divTravel = document.createElement('div');
              let travelInfo = `<h2 id = "subtitle">Travel Info</h2><b>Date:&nbsp&nbsp</b>${dDate}<br><b>Departure Time:&nbsp&nbsp</b>${dTime}<br><b>ETA:&nbsp&nbsp</b>${eta}<br><b>Available Seats:&nbsp&nbsp</b>${seats}<br>`;
              divTravel.innerHTML = travelInfo;
  
              let divCar = document.createElement('div');
              let carInfo = `<h2 id = "subtitle">Car Info</h2><b>Year:&nbsp&nbsp</b>${year}<br><b>Make:&nbsp&nbsp</b>${make}<br><b>Model:&nbsp&nbsp</b>${model}<br><b>Miles Per Gallon:&nbsp&nbsp</b>${mpg}` +
                `<br><b>CO2 Emissions (grams/mile):&nbsp&nbsp</b>${co2}<br><br>`
              divCar.innerHTML = carInfo;
  
              divRides.appendChild(divTravel);
              divRides.appendChild(divCar);
  
              let button = document.createElement('ion-button');
              button.id = "ride" + i;
              button.addEventListener('click', () => addUserToRide(i, ride));
              button.innerHTML = "Carpool";
  
              let divButton = document.createElement('div');
              divButton.classList.add("center");
              divButton.appendChild(button);
  
              let ionCardContent = document.createElement('ion-card-content');
              ionCardContent.appendChild(divRides);
              ionCardContent.appendChild(divButton);
  
              let ionCardHeader = document.createElement('ion-card-header');
              ionCardHeader.innerHTML = `<ion-card-title>${dCity} to ${aCity}</ion-card-title>`
  
              let ionCard = document.createElement('ion-card');
              ionCard.appendChild(ionCardHeader);
              ionCard.appendChild(ionCardContent);
  
              divContainer?.appendChild(ionCard);
            })
          }
        });
      }
    }));
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="header">
          <p id="title">Hoo's Driving</p>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="center">
          <IonButton onClick={() => createCards()}>Refresh Page</IonButton>
        </div>
        <div id="ridesList"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;


export const getCount = async () => {
  var value = (await get('count')).value;
  var count;
  if (!value || Number.isNaN(parseInt(value)))
    count = 0;
  else
    count = parseInt(value);
  return count;
};

export const getRide = async (index: number) => {
  var json = (await get(index.toString())).value;
  if (json)
    return JSON.parse(json);
  else
    return "";
};

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

