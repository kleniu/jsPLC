// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var SunCalc = require('suncalc');


function getSunTimes() {
  var retVal = {sunrise: [],
                sunset:  [],
                dawn:    [],
                dusk:    []};
  var times = SunCalc.getTimes(new Date(), 52.229676, 21.012229);
  retVal.sunrise[0] = times.sunrise.getHours(); retVal.sunrise[1] = times.sunrise.getMinutes();
  retVal.sunset[0]  = times.sunset.getHours();  retVal.sunset[1] = times.sunset.getMinutes();
  //console.log( "Sunrise -> ", retVal.sunrise );
  //console.log( "Sunset  -> ", retVal.sunset );

  retVal.dawn[0] = times.dawn.getHours(); retVal.dawn[1] = times.dawn.getMinutes();
  retVal.dusk[0] = times.dusk.getHours(); retVal.dusk[1] = times.dusk.getMinutes();
  //console.log( "Dawn -> ", retVal.dawn);
  //console.log( "Dusk -> ", retVal.dusk);

  return retVal;
}


client.connectTCP("192.168.2.50", { port: 502, timeout: 1000 } )
  .then( () => {
    console.log("INFO: PLC connected.")
    client.readHoldingRegisters(0,4)
      .then( (d) => {
        console.log("INFO: data = ", d.data);
        var sunTimes = getSunTimes();
        console.log("INFO: sunTimes = ", sunTimes);
        if ( d.data[0] != sunTimes.sunset[0] ||
             d.data[1] != sunTimes.sunset[1] ||
             d.data[2] != sunTimes.dawn[0] ||
             d.data[3] != sunTimes.dawn[1] ) {
               console.log("INFO Time is different on the PLC.");
               client.writeRegisters(0, [
                sunTimes.sunset[0],
                sunTimes.sunset[1],
                sunTimes.dawn[0],
                sunTimes.dawn[1]
               ])
               .then( (result) => {
                console.log("INFO: PLC disconnected.")
                client.close();
               })
               .catch( (err) => {
                console.log("ERROR: cannot write values to holging registers. Exiting.")
                process.exit();
              });
             }
        else {
          console.log("INFO: time is alread set. Disconnecting.");
          client.close();
        }
      })
      .catch( (err) => {
        console.log("ERROR: cannot read holding registers' values.");
        process.exit();
      });  
  })
  .catch( (err) => {
    console.log("ERROR: cannot connect to the PLC.");
    process.exit();
  })
