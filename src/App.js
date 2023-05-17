import React, { Component, createRef } from 'react';

import './App.css';
import { usuarioService } from './service/usuarioService.js';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Avatar } from 'primereact/avatar';

import "primereact/resources/themes/mdc-dark-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";
import imagenInicio from "./logo/captura.png";
import imagenInicioSesion from "./logo/logocompleto.png"

//import { StyleClass } from 'primereact/styleclass';

export default class App extends Component {

  constructor() {
    super();
    this.toast = createRef();
    
    this.personaregistro = {
      codigo: null,
      nick: '',
      correo: '',
      contrasenia: '',
      nombre: '',
      apellido: '',
      fechanac: '',
      namigos: 0,
      fotoperfil: null,
      npublicaciones: 0
    }

    this.state = {
      displayBasic: false,
      displayBasic2: false,
      displayModal: false,
      displayMaximizable: false,
      displayPosition: false,
      displayResponsive: false,
      position: 'center',

      codigosesion: null,

      //Variables Inicio sesión
      correoInicio: '',
      contraseniaInicio: '',

      //Variables Registro
      nick: '',
      correoRe: '',
      contraseniaRe: '',
      nombreRe: '',
      apellidoRe: '',
      fechanacRe: '',

      fotoper: null
    };


    this.file = null;
    this.usuarioService = new usuarioService();
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  componentDidMount() {
    this.usuarioService.getAll().then(data => this.setState({ personas: data }));
  }


  handleClick = () => {
    if (this.state.correoInicio.length > 0 || this.state.contraseniaInicio > 0) {
      this.usuarioService.login(this.state.correoInicio, this.state.contraseniaInicio).then(data => {
        this.setState({ codigosesion: data });
        if (data === -1) {
          this.showError();
        }
      });
    } else {
      this.showError();
    }
  }

  showError = () => {
    this.toast.current.show({ severity: 'error', summary: 'Error', detail: 'Correo o Constraseña NO VALIDO', life: 3000 });
  }
  showErrorRegistro = () => {
    this.toast.current.show({ severity: 'error', summary: 'Error', detail: 'Campos NO VALIDOS o INCOMPLETOS', life: 3000 });
  }

  correoInput = (event) => {
    this.setState({ correoInicio: event.target.value });
  }
  contraseniaInput = (event) => {
    this.setState({ contraseniaInicio: event.target.value });
  }

  correoInputRe = (event) => {
    this.setState({ correoRe: event.target.value });
  }
  contraseniaInputRe = (event) => {
    this.setState({ contraseniaRe: event.target.value });
  }

  nickInputRe = (event) => {
    this.setState({ nick: event.target.value });
  }
  nombreInputRe = (event) => {
    this.setState({ nombreRe: event.target.value });
  }

  apellidoInputRe = (event) => {
    this.setState({ apellidoRe: event.target.value });
  }

  fechanacInputRe = (event) => {
    this.setState({ fechanacRe: event.target.value });
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

  guardarfoto(e){
    this.file = e.target.files[0];
    console.log("file: ", this.file);
    const url = URL.createObjectURL(this.file);
    this.setState({
      fotoper: url
    });
  }

  comprobaciones = () =>{

    if(this.state.nick.length > 0 && this.state.nombreRe.length > 0  
      && this.state.apellidoRe.length > 0 && this.state.correoRe.length 
      > 0 && this.state.contraseniaRe.length > 0 && this.state.fechanacRe.length > 0 && this.file != null){
        
        console.log("consola:", "he pasado por aqui");

        this.personaregistro.apellido = this.state.apellidoRe;
        this.personaregistro.nombre = this.state.nombreRe;
        this.personaregistro.nick = this.state.nick;
        this.personaregistro.fechanac = this.state.fechanacRe;
        this.personaregistro.correo = this.state.correoRe;
        this.personaregistro.contrasenia = this.state.contraseniaRe;

        return true;
      }
      else{
        return false;
      }
  }

  registro = () =>{
    if(this.comprobaciones()){
      console.log("consola", "entro");
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(this.personaregistro));
      this.usuarioService.save(formData);
    }else{
      this.showErrorRegistro();
    }
  }

  renderFooter() {
    return (
      <div className="card">
        <div className="card-container yellow-container">
          <div className="block text-center mb-5">
            <img src={imagenInicioSesion} alt="hyper" height={125} className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Bienvenido, Regístrate:</div>
          </div>
        </div>

        <div className="flex card-container indigo-container">
          <div className="flex-1 m-5">

            <label htmlFor="nickRe" className="block text-900 font-medium mb-2">Nick</label>
            <InputText id="input3" type="text" placeholder="Nick" className="w-full mb-3" value={this.state.nick}
              onChange={this.nickInputRe} />

            <label htmlFor="nombreRe" className="block text-900 font-medium mb-2">Nombre</label>
            <InputText id="input4" type="text" placeholder="Nombre" className="w-full mb-3" value={this.state.nombreRe}
              onChange={this.nombreInputRe} />

            <label htmlFor="apellidoRe" className="block text-900 font-medium mb-2">Apellido/s</label>
            <InputText id="input5" type="text" placeholder="Apellido/s" className="w-full mb-3" value={this.state.apellidoRe}
              onChange={this.apellidoInputRe} />

            <label htmlFor="email" className="block text-900 font-medium mb-2">Correo Electrónico</label>
            <InputText id="input6" type="text" placeholder="Correo Electrónico" className="w-full mb-3" value={this.state.correoRe}
              onChange={this.correoInputRe} />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
            <Password id="input7" placeholder="Contraseña" className="w-full mb-5" value={this.state.contraseniaRe} onChange={this.contraseniaInputRe} toggleMask />
          </div>
          <div className="flex-1 m-5">
            <label htmlFor="password" className="block text-900 font-medium mb-2">Fecha de Nacimiento</label>

            <Calendar value={this.state.fechanacRe}  placeholder="yy-mm-dd"  className="w-full mb-5" onChange={this.fechanacInputRe} dateFormat="yy-mm-dd" />
            <div className="flex card-container indigo-container">
              <div className="flex-1 m-5">
              <label htmlFor="foto" className="block text-900 font-medium mb-2">Foto Perfil</label>
                <Avatar image={this.state.fotoper} size="xlarge" shape="circle" />
              </div>
              <div className="flex-1 m-5">
                <input type='file'name='file' onChange={(e) => this.guardarfoto(e)}/>
              </div>
            </div>
            <Button label="Registro" icon="pi pi-user" onClick={this.registro}/>
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
              <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-s justify-content-center gap-3 py-5">
                  <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label htmlFor="username" className="w-6rem">
                      Correo
                    </label>
                    <InputText id="input1" type="text" className="w-8 mb-3" placeholder="Correo Electrónico" value={this.state.correoInicio}
                      onChange={this.correoInput} />
                  </div>
                  <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label htmlFor="password" className="w-6rem">
                      Contraseña
                    </label>
                    <InputText id="input2" type="password" className="w-8 mb-3" placeholder="Contraseña" value={this.state.contraseniaInicio}
                      onChange={this.contraseniaInput} />
                  </div>
                  <Toast ref={this.toast} position="bottom-left" />
                  <Button label="Iniciar Sesión" icon="pi pi-user-plus" onClick={this.handleClick} className="w-10rem mx-auto"></Button>
                </div>
                <div className="w-full md:w-2">
                  <Divider layout="vertical" className="hidden md:flex">
                  </Divider>
                  <Divider layout="horizontal" className="flex md:hidden" align="center">
                  </Divider>
                </div>
                <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                  <Button label="Registrarse" icon="pi pi-user" onClick={() => this.onClick('displayBasic')} className="p-button-success"></Button>
                  <Dialog header="" visible={this.state.displayBasic} style={{ width: '50vw' }} footer={this.renderFooter('displayBasic')} onHide={() => this.onHide('displayBasic')}>
                  </Dialog>
                </div>
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