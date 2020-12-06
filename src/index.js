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

function showWeather(response) {
  event.preventDefault();
  console.log(response);
  let locationAndTime = document.querySelector("#location-and-time");
  let currentTime = new Date();
  currentTime.setTime(response.data.dt * 1000 + response.data.timezone * 1000); // javascript timestamps are in milliseconds
  //currentTime.toUTCString();
  locationAndTime.innerHTML = formatDate(currentTime);

  document.querySelector("#city").innerHTML = response.data.name;
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
function getDayOfTheWeek(timestamp) {
  var forecastDay = new Date();
  forecastDay.setTime(timestamp * 1000); // javascript timestamps are in milliseconds
  forecastDay.toUTCString();
  let dayIndex = forecastDay.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastDayName = days[dayIndex];
  return forecastDayName;
}

function showForecast(response) {
  event.preventDefault();
  console.log(response);
  let forecastElements = document.querySelector("#forecast");
  forecastElements.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 4; index++) {
    forecast = response.data.list[index];

    let midnightIndex = 0;
    while (response.data.list[midnightIndex].dt_txt[12] !== "0") {
      midnightIndex++;
    }
    console.log(midnightIndex);

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
      )}</span>°</strong> <br /> <span class="night" id="forecastTemperature">${Math.round(
      response.data.list[midnightIndex + 2 + 8 * index].main.temp
    )}</span>°
    </p>
  </div>
  `;
  }
}

function searchCity(city) {
  let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showForecast);
}

function changeLocation(event) {
  event.preventDefault();
  let city = document.querySelector("#write-city").value;
  searchCity(city);
}

function searchPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let apiKey = "cddfb1e3d89e2258740a8f1797f07940";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function geolocate(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

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

// axios.get(apiUrl).then(showWeather);
temperature.innerHTML = 18 + "°";
celsius.innerHTML = "<strong><u>c</strong></u>";
fahrenheit.innerHTML = "f";
//}

//change time and set unit
//let locationAndTime = document.querySelector("#location-and-time");
//let currentTime = new Date();
//locationAndTime.innerHTML = formatDate(currentTime);

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

searchCity("Geneve");
