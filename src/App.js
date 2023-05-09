import React, { Component } from 'react';
import './App.css';
import { usuarioService } from './service/usuarioService.js';
import { Button } from 'primereact/button';

import "primereact/resources/themes/lara-light-purple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";
import "./logo/logocompleto.png";
import imagenInicio from "./prueba.png";


//import { StyleClass } from 'primereact/styleclass';

export default class App extends Component {

  constructor() {
    super();
    this.state = {};
    this.usuarioService = new usuarioService();

  }

  componentDidMount() {
    this.usuarioService.getAll().then(data => this.setState({ personas: data }));
  }


  render() {
    return (
      <div className="center-screen grid grid-nogutter surface-0 text-800">
        <div className="imagenfondo col-12 md:col-7 p-6 text-center md:text-left flex align-items-center">
          <section>
            <span className="block text-8xl font-bold mb-1">Create the screens</span>
            <div className="text-7xl text-primary font-bold mb-3">your visitors deserve to see</div>
            <p className="mt-1 mb-4 text-700 line-height-3 text-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <Button label="Learn More" type="button" className="mr-3 p-button-raised" />
            <Button label="Live Demo" type="button" className="p-button-outlined" />
          </section>
        </div>
        <div className="col-12 md:col-5 overflow-hidden">
          <img src={imagenInicio} alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)', backgroundColor: "black"}} />
        </div>
      </div>
    );
  }
}
