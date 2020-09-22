import moment from "moment-timezone/moment-timezone";
import momentTimezoneWithData10YearRange from "./moment-timezone-with-data-10-year-range";

console.log("huh...");
console.log(momentTimezoneWithData10YearRange);

var d = new Date();
var n = d.getTime();

console.log(n);

var timezone = "America/Toronto";
var newLocationTime = moment(n).tz(timezone).format("ha z");
console.log("newLocationTime:");
console.log(newLocationTime);

// console.dir(moment.tz);

// var a = moment.tz("2013-11-18 11:55", "America/Los_Angeles");
// console.log(a);

// var june = moment("2014-06-01T12:00:00Z");
// june.tz("America/Los_Angeles").format("ha z"); // 5am PDT
// june.tz("America/New_York").format("ha z"); // 8am EDT
// june.tz("Asia/Tokyo").format("ha z"); // 9pm JST
// june.tz("Australia/Sydney").format("ha z"); // 10pm EST

// var dec = moment("2014-12-01T12:00:00Z");
// dec.tz("America/Los_Angeles").format("ha z"); // 4am PST
// dec.tz("America/New_York").format("ha z"); // 7am EST
// dec.tz("Asia/Tokyo").format("ha z"); // 9pm JST
// dec.tz("Australia/Sydney").format("ha z"); // 11pm EST

// console.log(june);
// console.log(dec);
