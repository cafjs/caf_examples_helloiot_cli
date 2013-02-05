# CAF (Cloud Assistant Framework)

Co-design permanent, active, stateful, reliable cloud proxies with your web app.

See http://www.cafjs.com 

## CAF Example helloIoT client

This repository contains a basic CAF example for an IoT device that interacts with a CA. This package complements the example `helloiot` in the `caf_examples` package. 

The idea is that a device (e.g., a Raspberry Pi using GPIO pins to interact with the the external world) will (git) pull this package at start time and  start an event loop by executing `start.js`. This loop will periodically read local sensors, execute commands sent from the CA, and sync views with the CA. 

## API

    start.js http://helloiot.cafjs.com/iot/3H5SHHW56 
    
where `3H5SHHW56` is a unique identifier for this device and `http://helloiot.cafjs.com` is the base address of the service we are connecting to.

 
## Configuration Example

### framework.json

None

### ca.json

None
  
    
        
            
 
