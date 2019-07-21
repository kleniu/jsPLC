// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var SunCalc = require('suncalc');


function getSunTimes() {
  var times = SunCalc.getTimes(new Date(), 52.229676, 21.012229);
  var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
  var sunsetStr  = times.sunset.getHours()  + ':' + times.sunset.getMinutes();
  console.log( "Sunrise -> " + sunriseStr );
  console.log( "Sunset  -> " + sunsetStr );

  var dawnStr = times.dawn.getHours() + ':' + times.dawn.getMinutes();
  var duskStr = times.dusk.getHours() + ':' + times.dusk.getMinutes();
  console.log( "Dawn -> " + dawnStr );
  console.log( "Dusk -> " + duskStr );
}







// open connection to a tcp line
client.connectTCP("192.168.2.50", { port: 502 } );

// read the values of 4 registers starting at address 0
// on device number 0. and log the values to the console.
setInterval(function() {
    client.readHoldingRegisters(0, 4, (err, data) => {
        console.log(data.data);
    });

    getSunTimes();

}, 1000);



