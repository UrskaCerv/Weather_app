//get date and time (time displayed in two digits even when number less than 10 (01, 02 ..))
function formatDate(date) {
  let hours = date.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getUTCDay();
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

//response from API current temperature to display in green part of the app
function showWeather(response) {
  event.preventDefault();
  let locationAndTime = document.querySelector("#location-and-time");
  let currentTime = new Date();
  currentTime.setTime(response.data.dt * 1000 + response.data.timezone * 1000); // javascript timestamps are in milliseconds
  locationAndTime.innerHTML = formatDate(currentTime);

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = `${Math.round(
    celsiusTemperature
  )}°`;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#description-weather").innerHTML =
    response.data.weather[0].main;

  document
    .querySelector("#icon-big")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon-big")
    .setAttribute("alt", response.data.weather[0].description);
}

//get names of the days in forecast
function getDayOfTheWeek(timestamp) {
  var forecastDay = new Date();
  forecastDay.setTime(timestamp * 1000); // javascript timestamps are in milliseconds
  forecastDay.toUTCString();
  let dayIndex = forecastDay.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastDayName = days[dayIndex];
  return forecastDayName;
}

//reponse from API forecast to display in the white part of the app
function showForecast(response) {
  event.preventDefault();
  console.log(response);
  let forecastElements = document.querySelector("#forecast");
  forecastElements.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 4; index++) {
    //find array with inforomation for midnight the next day - to set as a starting point for the forecast
    let midnightIndex = 0;
    while (response.data.list[midnightIndex].dt_txt[12] !== "0") {
      midnightIndex++;
    }
    //display the correct inromation (the response gives object with 40 arrays - 8 for each day;
    //img and day temperature taken from noon array (midnight + 4), night temperature taken from 6h a.am (midnight +2))
    forecastElements.innerHTML += `
      <div class="col-3" id="next-days">
        <p>
          ${getDayOfTheWeek(response.data.list[midnightIndex + 8 * index].dt)}
          <br />
          <img id="forecast-image" 
          src="http://openweathermap.org/img/wn/${
            response.data.list[midnightIndex + 4 + 8 * index].weather[0].icon
          }@2x.png"
          />
          <strong><span class="day" id="forecastTemperature">${Math.round(
            response.data.list[midnightIndex + 4 + 8 * index].main.temp
          )}</span>°</strong><br /><span class="night" id="forecastTemperature">${Math.round(
      response.data.list[midnightIndex + 2 + 8 * index].main.temp
    )}</span>°
        </p>
      </div>`;
  }
}

//connect to API for current temperature and API for forecast
function searchCity(city) {
  let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
}

//change location by writing in the form and submitting the answer
function changeLocation(event) {
  event.preventDefault();
  let city = document.querySelector("#write-city").value;
  searchCity(city);
}

//get current position from API
function searchPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
}

//user click on the geolocation button
function geolocate(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

//change units from C to F. If units already in F, don't do anything, if not, change to C.
function changeUnitF(event) {
  event.preventDefault();

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperature = document.querySelector("#temperature");

  temperature.innerHTML = `${Math.round(fahrenheitTemperature)}°`;
  fahrenheit.innerHTML = "<strong><u>f</strong></u>";
  celsius.innerHTML = "c";

  if (currentUnitState === "metric") {
    let forecastTemperature = document.querySelectorAll("#forecastTemperature");
    console.log(forecastTemperature);
    forecastTemperature.forEach(function (item) {
      let currentTemp = item.innerHTML;
      item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
    currentUnitState = "imperial";
  }
}

//change units from F to C. If units already in C, don't do anything, if not, change to F.
function changeUnitC(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = `${Math.round(celsiusTemperature)}°`;
  fahrenheit.innerHTML = "f";
  celsius.innerHTML = "<strong><u>c</strong></u>";

  if (currentUnitState === "imperial") {
    let forecastTemperature = document.querySelectorAll("#forecastTemperature");
    console.log(forecastTemperature);
    forecastTemperature.forEach(function (item) {
      let currentTemp = item.innerHTML;
      item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
    currentUnitState = "metric";
  }
}

//GLOBAL VARIABLES AND EVENTS

//change location
let city = document.querySelector("#city");
let submit = document.querySelector("#change-city");
submit.addEventListener("submit", changeLocation);

//geolocation
let geolocation = document.querySelector("#geolocation");
geolocation.addEventListener("click", geolocate);

//celsius vs fahrenheit
let celsiusTemperature = null;
let farenheit = document.querySelector("#farenheit");
fahrenheit.addEventListener("click", changeUnitF);
let celsuis = document.querySelector("#celsuis");
celsius.addEventListener("click", changeUnitC);

//celsius vs fahrenheit forecast
let currentUnitState = "metric";

//default city to search
searchCity("Geneve");
