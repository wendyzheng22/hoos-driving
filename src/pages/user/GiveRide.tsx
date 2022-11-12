import { IonButton, IonContent, IonHeader, IonPage, IonToolbar, useIonAlert } from "@ionic/react";
import React from "react";
import "./GiveRide.css";
import { set, get } from "../../components/storage";
import $ from 'jquery';

let year: string;
let model: string;
let make: string;
let id: string;

const Tab3: React.FC<{computingID:string}> = (props) => {
  var userInput: Array<string> = Array(6).fill("");
  const [presentAlert] = useIonAlert();

  const getYears = async () => {
    await fetch('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year', { headers: { Accept: 'application/json', }, })
      .then(response => response.json())
      .then(data => {
        var mylen = data.menuItem.length;
        for (var i = 0; i < mylen; i++) {
          $('#year').append($('<option>', {
            value: data.menuItem[i].value,
            text: data.menuItem[i].text
          }));
        }
      });
    document.getElementById('year')?.removeAttribute('disabled');
  }

  // https://www.fueleconomy.gov/feg/findacar.shtml
  const saveData = async (userInput: string[]) => {
    if (checkValid(userInput)) {
      incrementCount().then(count => {
        const ride = {
          departCity: userInput[0],
          arriveCity: userInput[1],
          departDate: userInput[2],
          departTime: userInput[3],
          eta: userInput[4],
          carSeats: userInput[5],
          carDriver: props.computingID,
          carRiders: "",
          carYear: year,
          carModel: model,
          carMake: make,
          carID: id,
        }
        const jsonObj = JSON.stringify(ride);
        saveJson(jsonObj, count);

        presentAlert({
          header: 'Success',
          message: 'Your ride was successfully posted!',
          buttons: ['OK'],
        });

        clearInput();
        userInput = Array(7).fill("");

      })
    }
    else {
      presentAlert({
        header: 'Failure',
        message: 'Please fill out all the fields and try again.',
        buttons: ['OK'],
      });
    }
  }

  function setVehicle(value: string): void {
    model = encodeURIComponent(value);
    getCar().then();
  }

  const getCar = async () => {
    await fetch('https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=' + year + '&make=' + make + "&model=" + model, { headers: { Accept: 'application/json', }, })
      .then(response => response.json())
      .then(data => {
        if (data && data.menuItem) {
          if (data.menuItem.length)
            id = data.menuItem[0].value;
          else
            id = data.menuItem.value;
        }
        else {
          id = "";

          presentAlert({
            header: 'Error',
            message: 'Database does not contain information for this car.',
            buttons: ['OK'],
          });
        }

      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="header">
          <p id="title">Hoo's Driving</p>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="inputRideContainer">
          <div id="info">
            <p id="label">
              <b>Ride Information</b>
            </p>
            <div id="label">
              <p>Departure City</p>
              <input list="cities" onInput={(event) => { userInput[0] = (event.target as HTMLInputElement).value; getYears(); }}></input>
            </div>
            <div id="label">
              <p>Arrival City</p>
              <input list="cities" onInput={(event) => userInput[1] = (event.target as HTMLInputElement).value}></input>
              <datalist id="cities"></datalist>
            </div>
            <div id="label">
              <p>Departure Date</p>
              <input type="date" onInput={(event) => userInput[2] = (event.target as HTMLInputElement).value}></input>
            </div>
            <div>
              <div id="label">
                <p>Departure Time</p>
                <input type="time" onInput={(event) => userInput[3] = (event.target as HTMLInputElement).value}></input>
              </div>
              <div id="label">
                <p>Estimated Arrival Time</p>
                <input type="time" onInput={(event) => userInput[4] = (event.target as HTMLInputElement).value}></input>
              </div>
            </div>
          </div>
          <div id="info">
            <p>
              <b>Car Information</b>
            </p>
            <p>Year</p>
            <select id="year" disabled defaultValue="" onChange={(event) => setMakes((event.target as HTMLSelectElement).value)} onClick={() => getYears()}>
              <option value="" disabled hidden>Year</option>
            </select>
            <p>Make</p>
            <select disabled id="make" defaultValue="" onChange={(event) => setModels((event.target as HTMLSelectElement).value)}>
              <option value="" disabled hidden>Make</option>
            </select>
            <p>Model</p>
            <select disabled id="model" defaultValue="" onChange={(event) => setVehicle((event.target as HTMLSelectElement).value)}>
              <option value="" disabled hidden>Model</option>
            </select>
            <p>Number of Available Seats</p>
            <input type="number" onInput={(event) => userInput[5] = (event.target as HTMLInputElement).value}></input>
          </div>
        </div>
        <div className="center">
          <br></br>
          <IonButton onClick={() => saveData(userInput)}>Post Ride</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Tab3;

const incrementCount = async () => {
  let value = await get('count');
  let count;
  if (!(value.value) || Number.isNaN(parseInt(value.value)))
    count = 1;
  else
    count = parseInt(value.value) + 1;
  set('count', count.toString());
  return count;
};

const saveJson = async (object: string, num: Number) => {
  set(num.toString(), object);
};

const checkValid = (stringArray: Array<string>) => {
  var result: boolean = true;
  stringArray.forEach(string => {
    if (string.length === 0) {
      result = false;
    }
  });
  if (year && make && model && id && result)
    result = true;
  return result;
}

const clearInput = () => {
  var inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    (inputs[i] as HTMLInputElement).value = "";
  }
  var yearSelect = document.getElementById("year") as HTMLSelectElement;
  yearSelect!.innerHTML = `<option value="" disabled hidden>Year</option>`;
  yearSelect?.setAttribute('disabled', '');
  yearSelect!.value = '';

  var makeSelect = document.getElementById("make") as HTMLSelectElement;
  makeSelect!.innerHTML = `<option value="" disabled hidden>Make</option>`;
  makeSelect?.setAttribute('disabled', '');
  makeSelect!.value = '';

  var modelSelect = document.getElementById("model") as HTMLSelectElement;
  modelSelect!.innerHTML = `<option value="" disabled hidden>Model</option>`;
  modelSelect?.setAttribute('disabled', '');
  modelSelect!.value = '';

  year = "";
  model = "";
  make = "";
  id = "";
}

function setMakes(value: string) {
  year = encodeURIComponent(value);
  document.getElementById('make')?.removeAttribute('disabled');
  $('#make').empty();
  $('#make').append($('<option>', { value: '', text: 'Make' }))
  $('#model').empty();
  $('#model').append($('<option>', { value: '', text: 'Model' }))
  getMakes().then();
}

const getMakes = async () => {
  await fetch('https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=' + year, 
  { headers: { Accept: 'application/json', }, })
    .then(response => response.json())
    .then(data => {
      var mylen = data.menuItem.length;
      for (var i = 0; i < mylen; i++) {
        $('#make').append($('<option>', {
          value: data.menuItem[i].value,
          text: data.menuItem[i].text
        }));
      }
    });
}

function setModels(value: string): void {
  make = encodeURIComponent(value);
  document.getElementById('model')?.removeAttribute('disabled');
  $('#model').empty();
  $('#model').append($('<option>', { value: '', text: 'Model' }))
  getModels().then();
}

const getModels = async () => {
  await fetch('https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=' + year + '&make=' + make, { headers: { Accept: 'application/json', }, })
    .then(response => response.json())
    .then(data => {
      var mylen = data.menuItem.length;
      for (var i = 0; i < mylen; i++) {
        $('#model').append($('<option>', {
          value: data.menuItem[i].value,
          text: data.menuItem[i].text
        }));
      }
    });
}
