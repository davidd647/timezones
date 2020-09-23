import moment from "moment-timezone/moment-timezone";
import momentTimezoneWithData10YearRange from "./moment-timezone-with-data-10-year-range";

document.addEventListener("DOMContentLoaded", function () {
  var timeZones = {
    mapProp: null,
    map: null,
    x: document.getElementById("demo"),
    locations: [],

    addMarker(lat, lng) {
      this.locations[this.locations.length - 1].marker = new google.maps.Marker(
        {
          position: new google.maps.LatLng(lat, lng),
          map: this.map,
        }
      );
    },

    displayListItems() {
      var elLocations = document.getElementById("locations");
      elLocations.innerHTML = "";

      this.locations.forEach((location, i) => {
        var locationCard = document.createElement("div");
        locationCard.classList.add("card");
        locationCard.classList.add("p-2");

        locationCard.id = i;

        locationCard.innerHTML = `
          <p class="d-flex justify-content-between">
            <span>
            ${i == 0 ? "Home: " : `Location #${i + 1}`}
            </span>
            <span>
              Latitude: ${Math.round(location.lat)},
              Longitude: ${Math.round(location.lng)}
            </span>
            <span class="glyphicon glyphicon-remove"></span>
          </p>

          <p>
            Time: 
            <b class="pl-2 timer-iterator">${location.time}</b>
          </p>

          <p>
            Time zone: 
            ${location.tz}
          </p>
          
          <div class="d-flex justify-content-center">
            <img src="${location.gifUrl}" style="max-height: 100px;">
          </div>
          
        `;

        elLocations.appendChild(locationCard);
      });
    },

    deletionEventListeners() {
      var plugin = this;

      var deleteIcons = document.querySelectorAll(".glyphicon");

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", function (e) {
          console.log(e.target.parentNode.parentNode);
          plugin.locations[e.target.parentNode.parentNode.id].marker.setMap(
            null
          );
          plugin.locations.splice(e.target.parentNode.parentNode.id, 1);

          plugin.displayListItems();
          plugin.deletionEventListeners();
        });
      });
      // glyphicon

      // var elLocations = document.getElementById("locations");
    },

    getGif: async function (tz) {
      var indexOfSlash = tz.indexOf("/");
      var trailingString = tz.slice(indexOfSlash + 1);
      console.log(trailingString);

      return await fetch(
        "https://api.giphy.com/v1/gifs/search?q=" +
          trailingString +
          "&api_key=h5CX8Mt5sGAv3iMQ0OqmPRqK6Xf0Ed1n&limit=1"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var smallGif = data.data[0].images.fixed_height.url;
          return smallGif;
        });
    },

    addLocation: async function (lat, lng, tz) {
      var d = new Date();
      var n = d.getTime();

      var time = moment(n).tz(tz).format("hh:mm:ss"); //format: "ha z"
      // var time = 0;

      console.log();
      var gifUrl = await this.getGif(tz);
      // var gifUrl = await this.getGif(tz);
      // console.log("gifUrl: ", gifUrl);

      this.locations.push({ lat, lng, tz, time, gifUrl });
      this.addMarker(lat, lng);
      // this.addListItem(lat, lng, tz);

      this.displayListItems();

      this.deletionEventListeners();
    },

    getTimeZone: async function (lat, lng) {
      var tz = "";
      await fetch(
        `https://api.teleport.org/api/locations/${lat},${lng}/?embed=location:nearest-cities/location:nearest-city/city:timezone/tz:offsets-now%20|%20jq%20%27._embedded.%22location:nearest-cities%22[0]._embedded.%22location:nearest-city%22._embedded.%22city:timezone%22%27`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          tz =
            data._embedded["location:nearest-cities"][0]._embedded[
              "location:nearest-city"
            ]._embedded["city:timezone"].iana_name;
        });
      return tz;
    },

    async handleClick(event) {
      var plugin = this;

      var lat = event.latLng.lat();
      var lng = event.latLng.lng();

      let tz = await this.getTimeZone(lat, lng).then((tz) => {
        plugin.addLocation(lat, lng, tz);
      });
    },

    async showPosition(position) {
      // this.x.innerHTML =
      //   "Latitude: " +
      //   position.coords.latitude +
      //   "<br>Longitude: " +
      //   position.coords.longitude;

      this.map.setCenter(
        new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
      );

      // get timezone for the first list item...
      var tz = await this.getTimeZone(
        position.coords.latitude,
        position.coords.longitude
      );

      // update listItems
      this.addLocation(position.coords.latitude, position.coords.longitude, tz);
    },

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    },

    myMap() {
      // this.getLocation();
      this.mapProp = {
        center: new google.maps.LatLng(51.508742, -0.12085),
        zoom: 2,
      };
      this.map = new google.maps.Map(
        document.getElementById("googleMap"),
        this.mapProp
      );

      google.maps.event.addListener(
        this.map,
        "click",
        this.handleClick.bind(this)
      );
      google.maps.event.addListener(
        this.map,
        "touchstart",
        this.handleClick.bind(this)
      );
    },

    hhmmssToSeconds(timeString) {
      var hours = parseInt(timeString.substr(0, 2));
      var minutes = parseInt(timeString.substr(3, 2));
      var seconds = parseInt(timeString.substr(6, 2));
      // var minutes = timeString.substr(2, 3);
      // var seconds = timeString.substr(5, 6);

      seconds += minutes * 60 + hours * 60 * 60;

      return seconds;
    },

    // this method is from: http://jsfiddle.net/StevenIseki/apg8yx1s
    secondsToHhmmss(totalSeconds) {
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
      var seconds = totalSeconds - hours * 3600 - minutes * 60;

      // round seconds
      seconds = Math.round(seconds * 100) / 100;

      var result = hours < 10 ? "0" + hours : hours;
      result += ":" + (minutes < 10 ? "0" + minutes : minutes);
      result += ":" + (seconds < 10 ? "0" + seconds : seconds);
      return result;
    },

    iterator() {
      var plugin = this;
      setInterval(() => {
        var iterables = document.querySelectorAll(".timer-iterator");
        iterables.forEach((iterable) => {
          var timeNow = iterable.innerHTML;
          var seconds = plugin.hhmmssToSeconds(timeNow);
          seconds++;
          timeNow = plugin.secondsToHhmmss(seconds);
          iterable.innerHTML = timeNow;
        });
      }, 1000);
    },

    init() {
      var myLocation = this.getLocation();

      this.myMap(myLocation); // this calls getLocation... should it?
      this.iterator();
    },
  };

  timeZones.init();
});
