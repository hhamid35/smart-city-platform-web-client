import React, { Component } from 'react';

import { MapContainer , TileLayer, Marker, Popup } from 'react-leaflet';

import './App.css';

class App extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="map">
        <MapContainer  className="map" center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        </MapContainer>
        <p>Smart City Platform Capstone Project</p>
        <a 
          class="App-link" 
          href="https://www.ee.ryerson.ca/capstone/topics/2020/MJ06.html" 
          target="_blank" 
          rel="noopener noreferrer">
            Project Description Page
        </a>
      </div>
      
    );
  }
}

export default App;
