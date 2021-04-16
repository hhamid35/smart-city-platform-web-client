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
import Devices from './components/Devices'
import axios from 'axios';
import { promisify } from 'util';

import './App.css';
import { setTimeout } from 'timers';

const httpClient = axios.create();

httpClient.defaults.timeout = 36000;

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
    }

    this.toggleTrainModelPopover = this.toggleTrainModelPopover.bind(this);
    this.toggleGenerateRoutePopover = this.toggleGenerateRoutePopover.bind(this);;
    this.initiateModelTraining = this.initiateModelTraining.bind(this);
    this.initiateRouteGeneration = this.initiateRouteGeneration.bind(this);
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
  }

  async initiateModelTraining() {
    axios.get('http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/modelTrainingTriggerHandler')
      .then(res => {
        console.log(res.endpoint_name);
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
          <Devices />
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
