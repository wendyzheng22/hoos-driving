import { IonButton, IonContent, IonHeader, IonPage, IonToolbar, useIonAlert } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import "./GiveRide.css";
import { getData } from "../../components/fetchAPI";
import { saveData } from "../../components/storage";

let rideInfo: any = { //holds user input about the ride and car
  carYear: null,
  carMake: null,
  carModel: null,
  carID: null,
  departCity: null,
  arriveCity: null,
  departDate: null,
  departTime: null,
  eta: null,
  carSeats: null,
  carDriver: null,
  carRiders: ""
}

const Tab3: React.FC<{ computingID: string, saveRides: saveData }> = (props) => {
  const [year, setYear] = useState(""); // used to trigger fetching data from api
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [carID, setCarID] = useState("");
  const [presentAlert] = useIonAlert(); // used to present a pop up alert / notification
  useEffect(() => { //updates the years selector with all of the years
    let yearSelector = (document.getElementById('year') as HTMLSelectElement)!;
    yearSelector.innerHTML = `<option value="" disabled hidden>Year</option>`;
    getData('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year')
      .then(data => {
        fillSelector(yearSelector, data);
        yearSelector.value = year;
        rideInfo['carModel'] = null;
        rideInfo['carMake'] = null;
        rideInfo['carID'] = null;
        setMake("");
        setModel("");
      })
  }, [year]); // triggered on the first render and whenver year is changed

  useEffect(() => { //updates the make selector with all of the years
    let makeSelector = (document.getElementById('make') as HTMLSelectElement)!;
    makeSelector.innerHTML = `<option value="" disabled hidden>Make</option>`;
    if (year !== "") {
      getData('https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=' + encodeURI(year))
        .then(data => {
          fillSelector(makeSelector, data);
          makeSelector.value = "";
          rideInfo['carModel'] = null;
          rideInfo['carID'] = null;
          setModel("");
        })
    }
    else { // when year is resetted 
      makeSelector.setAttribute('disabled', '');
      makeSelector.value = "";
    }
  }, [year]);

  useEffect(() => { //updates the model selector with all of the models
    let modelSelector = (document.getElementById('model') as HTMLSelectElement)!;
    modelSelector.innerHTML = `<option value="" disabled hidden>Model</option>`;
    if (make !== "") {
      getData('https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=' + encodeURI(year) + '&make=' + encodeURI(make))
        .then(data => {
          fillSelector(modelSelector, data);
          modelSelector.value = "";
          rideInfo['carID'] = null;
          setCarID("");
        })
    }
    else { // when make or year is resetted
      modelSelector.setAttribute('disabled', '');
      modelSelector.value = "";
    }
  }, [make]);

  useEffect(() => {
    if (model !== "") {
      getData('https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=' + encodeURI(year) + '&make=' + encodeURI(make) + "&model=" + encodeURI(model))
        .then(data => {
          if (data && data.menuItem) {
            if (data.menuItem.length)
              setCarID(data.menuItem[0].value);
            else
              setCarID(data.menuItem.value);
          }
          else {
            setCarID("");
            showAlert(presentAlert, 'Error', 'Database does not contain information for this car');
          }
          rideInfo['carID'] = carID;
        })
    }
    else { // when year, make, or model is resetted
      setCarID("");
      rideInfo['carID'] = carID;
    }
  }, [model])

  const saveRide = () => {
    rideInfo['carYear'] = year;
    rideInfo['carModel'] = model;
    rideInfo['carMake'] = make;
    rideInfo['carDriver'] = props.computingID;
    if (!validateRide(presentAlert)) {
      return;
    }

    if (checkValid()) {
      props.saveRides.setRidesList((prevArray: any) => [...prevArray, JSON.stringify(rideInfo)]);
      props.saveRides.setUserDrives((prevArray: any) => [...prevArray, JSON.stringify(rideInfo)]);

      showAlert(presentAlert, 'Success', 'Your ride was successfully posted!');

      let inputs = document.getElementsByTagName("input");
      for (let i = 0; i < inputs.length; i++) {
        (inputs[i] as HTMLInputElement).value = "";
      }
      setYear("");
      setMake("");
      setModel("");
      setCarID("");
    }
    else 
      showAlert(presentAlert, 'Failure', 'Please fill out all the fields and try again!');
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
              <input list="cities" onInput={(event) => rideInfo['departCity'] = (event.target as HTMLInputElement).value}></input>
            </div>
            <div id="label">
              <p>Arrival City</p>
              <input list="cities" onInput={(event) => rideInfo['arriveCity'] = (event.target as HTMLInputElement).value}></input>
            </div>
            <div id="label">
              <p>Departure Date</p>
              <input type="date" onInput={(event) => rideInfo['departDate'] = (event.target as HTMLInputElement).value}></input>
            </div>
            <div>
              <div id="label">
                <p>Departure Time</p>
                <input type="time" onInput={(event) => rideInfo['departTime'] = (event.target as HTMLInputElement).value}></input>
              </div>
              <div id="label">
                <p>Estimated Arrival Time</p>
                <input type="time" onInput={(event) => rideInfo['eta'] = (event.target as HTMLInputElement).value}></input>
              </div>
            </div>
          </div>
          <div id="info">
            <p>
              <b>Car Information</b>
            </p>
            <p>Year</p>
            <select id="year" disabled defaultValue="" onChange={(event) => setYear((event.target as HTMLSelectElement).value)}>
              <option value="" disabled hidden>Year</option>
            </select>
            <p>Make</p>
            <select disabled id="make" defaultValue="" onChange={(event) => setMake((event.target as HTMLSelectElement).value)}>
              <option value="" disabled hidden>Make</option>
            </select>
            <p>Model</p>
            <select disabled id="model" defaultValue="" onChange={(event) => setModel((event.target as HTMLSelectElement).value)}>
              <option value="" disabled hidden>Model</option>
            </select>
            <p>Number of Available Seats</p>
            <input type="number" onInput={(event) => rideInfo["carSeats"] = (event.target as HTMLInputElement).value}></input>
          </div>
        </div>
        <div className="center">
          <br></br>
          <IonButton onClick={() => saveRide()}>Post Ride</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Tab3;

const fillSelector = (selector: HTMLSelectElement, jsonObject: any) => {
  selector.removeAttribute('disabled');
  if (jsonObject.menuItem.length) {
    for (var i = 0; i < jsonObject.menuItem.length; i++) {
      let currOption = document.createElement('option');
      currOption.value = jsonObject.menuItem[i].value;
      currOption.text = jsonObject.menuItem[i].text;
      selector.appendChild(currOption);
    }
  }
  else { // when there is only one option (so no list exists and length would be undefined)
    let currOption = document.createElement('option');
    currOption.value = jsonObject.menuItem.value;
    currOption.text = jsonObject.menuItem.text;
    selector.appendChild(currOption);
  }

}

const checkValid = () => { // makes sure that the user filled out all of the fields
  let result = true;
  Object.keys(rideInfo).forEach((key: string) => {
    if (!rideInfo[key] && key !== 'carRiders')
      result = false;
  });
  return result;
}

export const showAlert = (ionAlert: any, title: string, alert: string) => { // calls the alert to be displayed
  ionAlert({
    header: title,
    message: alert,
    buttons: ['OK'],
  });
}

function validateRide(alert: any) {
  let today = new Date();
  let departTime = new Date(rideInfo.departDate + " " + rideInfo.departTime);
  let arriveTime = new Date(rideInfo.departDate + " " + rideInfo.eta)
  if (today > departTime) {
    showAlert(alert, "Failure", "Ride departure date/time is already past")
    return false;
  }
  else if (departTime > arriveTime) {
    showAlert(alert, "Failure", "Ride departure time is after estimated arrival time")
    return false;
  }
  else
    return true;
}
