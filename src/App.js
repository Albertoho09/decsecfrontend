import React, { Component } from 'react';

import './App.css';
import { usuarioService } from './service/usuarioService.js';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import "primereact/resources/themes/mdc-dark-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";
import "./logo/captura.png";
import imagenInicio from "./logo/captura.png";
import imagenInicioSesion from "./logo/logocompleto.png"

//import { StyleClass } from 'primereact/styleclass';

export default class App extends Component {

  constructor() {
    super();

    this.state = {
      displayBasic: false,
      displayBasic2: false,
      displayModal: false,
      displayMaximizable: false,
      displayPosition: false,
      displayResponsive: false,
      position: 'center',

      codigosesion: null,

      inputValue1: '',
      inputValue2: ''
    };


    this.usuarioService = new usuarioService();
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);

  }

  componentDidMount() {
    this.usuarioService.getAll().then(data => this.setState({ personas: data }));
  }


  handleClick = () => {
    console.log('Input 1:', this.state.inputValue1);
    console.log('Input 2:', this.state.inputValue2);
    this.usuarioService.login(this.state.inputValue1, this.state.inputValue2).then(data => this.setState({ codigosesion: data }))
  }

  handleInputChange1 = (event) => {
    this.setState({ inputValue1: event.target.value });
  }

  handleInputChange2 = (event) => {
    this.setState({ inputValue2: event.target.value });
  }

  onClick(name, position) {
    let state = {
      [`${name}`]: true
    };

    if (position) {
      state = {
        ...state,
        position
      }
    }

    this.setState(state);
  }

  onHide(name) {
    this.setState({
      [`${name}`]: false
    });
  }

  renderFooter(name) {
    return (
      <div style={{ width: '100%' }}>
        <div className="surface-card p-4 shadow-2 border-round w-full">
          <div className="text-center mb-5">
            <img src={imagenInicioSesion} alt="hyper" height={125} className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Bienvenido de nuevo, Inicia Sesión:</div>
          </div>

          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Correo Electrónico</label>
            <InputText id="input1" type="text" placeholder="Correo Electrónico" className="w-full mb-3" value={this.state.inputValue1}
              onChange={this.handleInputChange1} />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
            <InputText id="input2" type="password" placeholder="Contraseña" className="w-full mb-3" value={this.state.inputValue2}
              onChange={this.handleInputChange2} />

            <div className="flex align-items-center justify-content-between mb-6">
              <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password? po te jode</a>
            </div>

            <Button label="Iniciar Sesión" icon="pi pi-user" className="w-full" onClick={this.handleClick}/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="center-screen grid grid-nogutter surface-0 text-800">
        <div className="imagenfondo col-12 md:col-7 p-6 text-center md:text-left flex align-items-center">
          <section>
            <span className="block text-8xl font-bold mb-1">DECSEC</span>
            <div className="text-7xl text-primary font-bold mb-3">WebApp by Alberto Hidalgo</div>
            <p className="mt-1 mb-4 text-700 line-height-3 text-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <div className="dialog-demo">
              <div className="card">
                <Button label="Iniciar Sesión" type="button" onClick={() => this.onClick('displayBasic')} className="mr-3 p-button-raised transition-delay-100 transition-colors transition-duration-300 bg-blue-500 hover:bg-yellow-500" />
                <Dialog header="Inicio de Sesión" visible={this.state.displayBasic} style={{ width: '30vw' }} footer={this.renderFooter('displayBasic')} onHide={() => this.onHide('displayBasic')}>
                </Dialog>
                <Button label="Registrarse" type="button" className="p-button-outlined" />
              </div>
            </div>
          </section>
        </div>
        <div className="col-12 md:col-5 overflow-hidden">
          <img src={imagenInicio} alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)', backgroundColor: "black" }} />
        </div>
      </div>
    );
  }
}