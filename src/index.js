import moment from "moment-timezone/moment-timezone";

var d = new Date();
var n = d.getTime();

console.log(n);

// var timezone = "America/Toronto";
// var newLocationTime = moment(n).tz(timezone).format("ha z");
// console.log(newLocationTime);

var a = moment.tz("2013-11-18 11:55", "Asia/Taipei");
console.log(a);
