$(function () {
  getWeather();

  setInterval(function () {
    getWeather();
  }, 900000); // every 15 minutes

  function getWeather() {

    var latitude = 47.476404, longitude = 19.055738;
    var skycons = new Skycons({
      monochrome: false,
      colors: {
        main: "#333333",
        moon: "#ffffb3",
        fog: "#78586F",
        fogbank: "#B4ADA3",
        cloud: "gainsboro",
        snow: "#7B9EA8",
        leaf: "#7B9EA8",
        rain: "lightblue",
        sun: "yellow"
      }
    });

    var getPosition = function () {
      return new Promise(function (resolve) {
        navigator.geolocation.getCurrentPosition(resolve);
      });
    }

    getPosition()
      .then((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        view();
      })
      .catch((err) => {
        console.error(err.message);
      });

    function view() {
      $("#coords").html("latitude: " + latitude.toFixed(2) + ", longitude: " + longitude.toFixed(2));
      location();
      weather();
    }

    function location() {
      var apiKey = "&key=929ff7ade8cc41e99b688b0ba3740134";
      $.getJSON(
        "https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + apiKey,
        function (data) {
          var components = data.results[0].components
          var locationString = components.postcode + " " + 
          (components.city || components.town || components.village) + "<br>" + 
          components.road
          if(!locationString.includes("undefined")) {
            $("#location").html(locationString);
          }
        }
      );
    }

    function weather() {
      var darksky_api = "https://api.darksky.net/forecast/4e6cca0fe2052f9f2b8c230f148635a8/";
      $.getJSON(
        darksky_api + latitude + "," + longitude + "/?callback=?",
        function (weath) {
          var currently = weath.currently;
          $("#weath").html(currently.summary);
          $("#C").on("click", function () {
            $("#temperature").html(Math.round((currently.temperature - 32) * 5 / 9) + " °C");
          });
          $("#F").on("click", function () {
            $("#temperature").html(Math.round(currently.temperature) + " F");
          });
          $("#C").click();
          $("#pressure").html(
            "Pressure: " + Math.round(currently.pressure) + " hPa"
          );
          $("#humidity").html(
            "Humidity: " + Math.round(currently.humidity * 100) + "%"
          );
          skycons.add("icon", currently.icon);
          skycons.play();
        }
      );
    }
  }
});
