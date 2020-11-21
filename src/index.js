function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function showWeather(response) {
  event.preventDefault();
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )}°`;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  console.log(response);
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#description-weather").innerHTML =
    response.data.weather[0].main;
}

function searchCity(city) {
  let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function changeLocation(event) {
  event.preventDefault();
  //let functionCity = document.querySelector("#city");
  //let newCity = document.querySelector("#write-city");
  //if (newCity.value !== "undefined") {
  //let newCityCapitalized = newCity.value.split(" ");
  //for (let i = 0; i < newCityCapitalized.length; i++) {
  //newCityCapitalized[i] =
  //newCityCapitalized[i][0].toUpperCase() + newCityCapitalized[i].slice(1);
  //}
  //newCityCapitalized = newCityCapitalized.join(" ");
  //} else {
  // }
  //functionCity.innerHTML = `${newCityCapitalized}`;
  let city = document.querySelector("#write-city").value;
  searchCity(city);
}

function searchPosition(position) {
  debugger;
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let apiKey = "cddfb1e3d89e2258740a8f1797f0794";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&unit=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function geolocate(event) {
  debugger;
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

function changeUnitF(event) {
  let temperature = document.querySelector("#temperature");
  let choose = document.querySelector("#choose");
  event.preventDefault();
  //let functionCity = document.querySelector("#city");
  //let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  //let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${functionCity}&appid=${apiKey}&units=imperial`;

  //axios.get(apiUrl).then(showWeather);
  temperature.innerHTML = 66 + "°";
  farenheit.innerHTML = "<strong><u>f</strong></u>";
  celsius.innerHTML = "c";
}

function changeUnitC(event) {
  event.preventDefault();
  changeUnitCAutomatic();
}

function changeUnitCAutomatic() {
  let temperature = document.querySelector("#temperature");
  let celsius = document.querySelector("#celsius");
  let farenheit = document.querySelector("#farenheit");
  //let functionCity = document.querySelector("#city");
  // let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${functionCity}&appid=${apiKey}&units=metric`;

  // axios.get(apiUrl).then(showWeather);
  temperature.innerHTML = 18 + "°";
  celsius.innerHTML = "<strong><u>c</strong></u>";
  farenheit.innerHTML = "f";
}

//change time and set unit
let locationAndTime = document.querySelector("#location-and-time");
let currentTime = new Date();
locationAndTime.innerHTML = formatDate(currentTime);
changeUnitCAutomatic();

//change location
let city = document.querySelector("#city");
let submit = document.querySelector("#change-city");
submit.addEventListener("submit", changeLocation);

//geolocation
let geolocation = document.querySelector("#geolocation");
geolocation.addEventListener("click", geolocate);

//celsius
let farenheit = document.querySelector("#farenheit");
farenheit.addEventListener("click", changeUnitF);

//farenheit
let celsuis = document.querySelector("#celsuis");
celsius.addEventListener("click", changeUnitC);

searchCity("Geneva");
