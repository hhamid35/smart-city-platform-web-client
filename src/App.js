import React, { Component } from 'react';
import L from 'leaflet';
import { MapContainer , TileLayer, Marker, Popup, Pop, Pane } from 'react-leaflet';
import { 
  Card, 
  CardTitle,
  CardText, 
  Button, 
  CardImg,
  Popover, 
  PopoverHeader, 
  PopoverBody } from 'reactstrap';
import Navbar from './components/navbar/Navbar'
import Readings from './components/Readings'
import axios from 'axios';
import { promisify } from 'util';

import './App.css';
import garbageBinMarker from './garbagebin.png'
import { setTimeout } from 'timers';

var myIcon = L.icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
});

const customMarker = new L.Icon({
  iconUrl: garbageBinMarker,
  iconSize: [30, 41],
  iconAnchor: [25, 35],
  popupAnchor: [2, -40]
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      location : {
        lat: 43.693,
        lng: -79.8365,
      },
      haveUserLocation: false,
      zoom: 13,
      trainModelPopoverOpen: false,
      trainModelPopoverContent: 'Please wait... This can take up to 1 hour.',
      generateRoutePopoverOpen: false,
      generateRoutePopoverContent: 'Please wait...',
      deviceList: [],
      haveDevices: false
    }

    this.toggleTrainModelPopover = this.toggleTrainModelPopover.bind(this);
    this.toggleGenerateRoutePopover = this.toggleGenerateRoutePopover.bind(this);;
    this.initiateModelTraining = this.initiateModelTraining.bind(this);
    this.initiateRouteGeneration = this.initiateRouteGeneration.bind(this);
    this.setDeviceList = this.setDeviceList.bind(this);
  }

  toggleTrainModelPopover() {
    this.setState(state => ({
      trainModelPopoverOpen: !state.trainModelPopoverOpen
    }));
  }

  toggleGenerateRoutePopover() {
    this.setState(state => ({
      generateRoutePopoverOpen: !state.generateRoutePopoverOpen
    }));
  }

  getGarbageBins() {
    var deviceList = [];
    axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/devices')
      .then(res => {
        deviceList = deviceList.concat(res.data);
      })
      .catch(err => {
        throw new Error('Error occured trying to get garbage bins. ' + err);
      })
    return deviceList;
  }

  getLastReadingByIp(ip) {
    var reading = null;
    axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/readings/' + ip + '/last')
      .then(res => {
        reading = res.data;
      })
      .catch(err => {
        throw new Error('Error getting the last reading for device with ip ' + ip + '. ' + err);
      })
    return reading;
  }

  setDeviceList() {
    var devices = this.getGarbageBins();
    console.log(devices);

    devices.forEach((device, index) => {
      try {
        device.lastReading = this.getLastReadingByIp(device.deviceIp);
      }
      catch(err) {
        devices.splice(index, 1);
      }
    });

    this.setState(state => ({
      deviceList: devices
    }))
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState(state => ({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        haveUserLocation: true,
        zoom: 13
      }));
    }, () => {
      console.log('uh oh .. didn\'t get location');
      axios.get('https://ipapi.co/json')
        .then(location => {
          this.setState(state => ({
            location: {
              lat: location.latitude,
              lng: location.longitude
            },
            haveUserLocation: true,
            zoom: 13
          }));
        });
    });

    //this.setDeviceList();

    try {
      axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/devices')
      .then(res => {
        const devices = res.data;
        this.setState({
          deviceList: devices
        });
      })
      .catch(err => {
        throw new Error('Error occured trying to get garbage bins. ' + err);
      });
    }
    catch(err) {
      console.log(err);
    }
    
    
    // for (i = 0; i < this.state.deviceList.length; i++) {
    //   try {
    //     axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/readings/' + device.deviceIp + '/last')
    //     .then(res => {
    //       const reading = res.data;

    //     })
    //   }
    //   catch(err) {
    //     console.log(err);
    //   }
      
    // }

    // this.deviceList.forEach((device, index) => {
    //   try {
    //     axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/readings/' + device.deviceIp + '/last')
    //       .then(res => {
    //         const reading = res.data;

    //       })
    //       // .catch(err => {
    //       //   throw new Error('Error getting the last reading for device with ip ' + device.deviceIp + '. ' + err);
    //       // });
    //   }
    //   catch(err) {
    //     console.log('Removing device ' + device.deviceIp + ', it didn\'t have a last known reading.');
    //     devices.splice(index, 1);
    //   }
    // });

    this.setState(state => ({
      haveDevices: state.deviceList.length == 0
    }));

    

  }

  async initiateModelTraining() {
    axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/modelTrainingTriggerHandler')
      .then(res => {
        console.log(res);
        this.setState(state => ({
          trainModelPopoverContent: 'Successfully generated a new model. It is now being used to make Predictions.'
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState(state => ({
          trainModelPopoverContent: 'Error occured trying to train a new prediction model.'
        }));
      })

    setTimeout(() => {
      this.setState(state => ({
        trainModelPopoverOpen: false
      }));
    }, 5000);
  }

  async initiateRouteGeneration() {
    axios.post('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/generateRoutes')
      .then(res => {
        console.log(res);
        this.setState(state => ({
          generateRoutePopoverContent: 'Successfully generated an optimized route.'
        }));
      })
      .catch(err => {
        console.log(err);
        this.setState(state => ({
          generateRoutePopoverContent: 'Error occured trying to generate an optimized route.'
        }));
      })

    setTimeout(() => {
      this.setState(state => ({
        generateRoutePopoverOpen: false
      }));
    }, 5000);
  }

  render() {
    if (!this.state.deviceList) {
      return ''
    }
    console.log(this.state.deviceList);
    return (
      <div className="map">
        <Navbar />
        <MapContainer  
          className="map"
          center={[this.state.location.lat, this.state.location.lng]} 
          zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            {/* {console.log(this.state.deviceList.length)} */}
            {this.state.haveDevices ? this.state.deviceList.map((device, index) => {
              if ('lastReading' in device){
                return <Marker position={[device.lastReading.latitude, device.lastReading.longitude]} icon={customMarker}>
                        <Popup maxWidth="auto" maxHeight="auto">
                          <Readings />
                        </Popup>
                      </Marker>
              }
              else {
                return ''
              }
              
            }) : ''}
            {/* {
              this.state.haveUserLocation ?
              <Marker 
                position={position}
                icon={customMarker}>
                <Popup maxWidth="auto" maxHeight="auto">
                  <Readings />
                </Popup>
              </Marker> : ''
            } */}
        </MapContainer>
        <Card className="control-card">
          <div className="card-container">
            <CardTitle className="card-title">Smart City Wastemangement System</CardTitle>
            <div className="card-content">
              <Button id="trainModelPopover" type="button" onClick={this.initiateModelTraining}>Train New Prediction Model</Button>
              <Popover className="popover" placement="bottom" isOpen={this.state.trainModelPopoverOpen} target="trainModelPopover" toggle={this.toggleTrainModelPopover}>
                <div className="popover-content">
                  <PopoverHeader className="popover-title">Train New Prediction Model</PopoverHeader>
                  <PopoverBody className="popover-body">{this.state.trainModelPopoverContent}</PopoverBody>
                </div>
              </Popover>
              <Button id="generateRoutePopover" type="button" onClick={this.initiateRouteGeneration}>Generate Optimized Routes</Button>
              <Popover className="popover" placement="bottom" isOpen={this.state.generateRoutePopoverOpen} target="generateRoutePopover" toggle={this.toggleGenerateRoutePopover}>
                <div className="popover-content">
                  <PopoverHeader className="popover-title">Generate Optimized Routes</PopoverHeader>
                  <PopoverBody className="popover-body">{this.state.generateRoutePopoverContent}</PopoverBody>
                </div>
              </Popover>
            </div>
          </div>
        </Card>
        <div className="footer">
          <p>Smart City Platform Capstone Project</p>
          <a 
            className="App-link" 
            href="https://www.ee.ryerson.ca/capstone/topics/2020/MJ06.html" 
            target="_blank" 
            rel="noopener noreferrer">
              Project Description Page
          </a>
        </div>
      </div>
      
    );
  }
}

export default App;
