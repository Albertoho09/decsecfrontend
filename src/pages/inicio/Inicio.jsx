import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './App.css';
import '../../service/usuarioService';
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
import imagenInicio from "../../logo/captura.png";
import imagenInicioSesion from "../../logo/logocompleto.png";
import sinfoto from "../../logo/sinfoto.png";
import { usuarioService } from '../../service/usuarioService';
//import { StyleClass } from 'primereact/styleclass';

export const Inicio = () => {

  const toast = useRef(null);
  const toastRe = useRef(null);
  const [state, setState] = useState({
    displayBasic: false,
    displayBasic2: false,
    displayModal: false,
    displayMaximizable: false,
    displayPosition: false,
    displayResponsive: false,
    position: 'center',
  })

  const [personaRe, setpersonaRe] = useState({
    codigosesion: '',

    //Variables Inicio sesión
    correoInicio: '',
    contraseniaInicio: '',

    fotoper: sinfoto
  })

  const [personaregistro, setPersonaregistro] = useState({
    codigo: null,
    nick: '',
    correo: '',
    contrasenia: '',
    nombre: '',
    apellido: '',
    fechanac: null,
    namigos: 0,
    fotoperfil: null,
    npublicaciones: 0
  });

  const [fotoperfil, setfotoperfil] = useState({
    fotoperfil: null
  });


  const navigate = useNavigate();

  const handleClick = () => {
    const usuarioserviceInicio = new usuarioService();
    if (personaRe.correoInicio !== '' && personaRe.contraseniaInicio !== '') {

      usuarioserviceInicio.login(personaRe.correoInicio, personaRe.contraseniaInicio).then(data => {
        console.log(data)
        if (data === -1) {
          showError();
        } else {

          var id = data
          console.log(id)
          usuarioserviceInicio.obtener(id).then(data => {
            console.log("datos usuario", data);
            navigate('/principal', { state: data })
          })
        }
      });
    } else {
      showError();
    }
  }

  const onClick = (name, position) => {
    let state = {
      [`${name}`]: true
    };

    if (position) {
      state = {
        ...state,
        position
      }
    }

    setState(state);
  }

  const onHide = (name) => {
    setState({
      [`${name}`]: false
    });
  }


  const guardarfoto = (e) => {

    console.log("entro en guardar foto");
    setfotoperfil(prevState => ({
      ...prevState,
      fotoperfil: e.target.files[0]
    }));
    const url = URL.createObjectURL(e.target.files[0]);
    setpersonaRe(prevState => ({
      ...prevState,
      fotoper: url
    }));

    console.log("salgo de guardar foto");
  }

  const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Campos Incorrectos o NO VALIDOS', life: 3000 });
  }

  const showErrorRe = () => {
    toastRe.current.show({ severity: 'error', summary: 'Error', detail: 'Campos de Registro no validos o VACIOS', life: 3000 });
  }


  const comprobaciones = () => {

    console.log("consola:", "he pasado por aqui");
    if (personaregistro.apellido !== '' && personaregistro.nombre !== '' &&
      personaregistro.correo !== '' && personaregistro.contrasenia !== '' &&
      personaregistro.fechanac !== null && personaregistro.nick !== '' && personaRe.fotoper !== '') {
      return true;
    }
    else {
      return false;
    }
  }


  const registro = () => {
    console.log("fotoper", personaRe.fotoper);
    const usuarioserviceRe = new usuarioService();
    if (comprobaciones()) {

      var formData = new FormData();
      formData.append('file', fotoperfil.fotoperfil);
      formData.append('data', JSON.stringify(personaregistro));
      usuarioserviceRe.save(formData).then(data => {
        usuarioserviceRe.login(personaregistro.correo, personaregistro.contrasenia).then(data => {
          var id = data
          usuarioserviceRe.obtener(id).then(data => {
            console.log("datos usuario", data);
            navigate('/principal', { state: data })
          })
        })
      });
      console.log("Creado", "creado")
    } else {
      showErrorRe();
    }
  }

  const renderFooter = () => {
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
            <InputText id="input3" type="text" placeholder="Nick" className="w-full mb-3" value={personaregistro.nick}
              onChange={(e) => setPersonaregistro(prevState => ({
                ...prevState,
                nick: e.target.value
              }))} />

            <label htmlFor="nombreRe" className="block text-900 font-medium mb-2">Nombre</label>
            <InputText id="input4" type="text" placeholder="Nombre" className="w-full mb-3" value={personaregistro.nombre}
              onChange={(e) => setPersonaregistro(prevState => ({
                ...prevState,
                nombre: e.target.value
              }))} />

            <label htmlFor="apellidoRe" className="block text-900 font-medium mb-2">Apellido/s</label>
            <InputText id="input5" type="text" placeholder="Apellido/s" className="w-full mb-3" value={personaregistro.apellido}
              onChange={(e) => setPersonaregistro(prevState => ({
                ...prevState,
                apellido: e.target.value
              }))} />

            <label htmlFor="email" className="block text-900 font-medium mb-2">Correo Electrónico</label>
            <InputText id="input6" type="text" placeholder="Correo Electrónico" className="w-full mb-3" value={setPersonaregistro.correo}
              onChange={(e) => setPersonaregistro(prevState => ({
                ...prevState,
                correo: e.target.value
              }))} />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
            <Password id="input7" placeholder="Contraseña" className="w-full mb-5" value={personaregistro.contrasenia} onChange={(e) => setPersonaregistro(prevState => ({
              ...prevState,
              contrasenia: e.target.value
            }))} toggleMask />
          </div>
          <div className="flex-1 m-5">
            <label htmlFor="password" className="block text-900 font-medium mb-2">Fecha de Nacimiento</label>

            <Calendar value={personaregistro.fechanac} placeholder="yy-mm-dd" dateFormat="yy-mm-dd" className="w-full mb-5" onChange={(e) => setPersonaregistro(prevState => ({
              ...prevState,
              fechanac: e.target.value
            }))} showIcon />
            <div className="flex card-container indigo-container">
              <div className="flex-1 m-5">
                <label htmlFor="foto" className="block text-900 font-medium mb-2">Foto Perfil</label>
                <Avatar image={personaRe.fotoper} size="xlarge" shape="circle" />
              </div>
              <div className="flex-1 m-5">
                <input type='file' name='file' onChange={(e) => guardarfoto(e)} />
              </div>
            </div>
            <Toast ref={toastRe} position="bottom-left" />
            <Button label="Registro" icon="pi pi-user" onClick={registro} />
          </div>
        </div>
      </div>
    );
  }

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
                  <InputText id="input1" type="text" className="w-8 mb-3" placeholder="Correo Electrónico" value={personaRe.correoInicio}
                    onChange={(e) => setpersonaRe(prevState => ({
                      ...prevState,
                      correoInicio: e.target.value
                    }))} />

                </div>
                <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                  <label htmlFor="password" className="w-6rem">
                    Contraseña
                  </label>
                  <InputText id="input2" type="password" className="w-8 mb-3" placeholder="Contraseña" value={personaRe.contraseniaInicio}
                    onChange={(e) => setpersonaRe(prevState => ({
                      ...prevState,
                      contraseniaInicio: e.target.value
                    }))} />
                </div>
                <Toast ref={toast} position="bottom-left" />
                <Button label="Iniciar Sesión" icon="pi pi-user-plus" onClick={handleClick} className="w-10rem mx-auto"></Button>
              </div>
              <div className="w-full md:w-2">
                <Divider layout="vertical" className="hidden md:flex">
                </Divider>
                <Divider layout="horizontal" className="flex md:hidden" align="center">
                </Divider>
              </div>
              <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                <Button label="Registrarse" icon="pi pi-user" onClick={() => onClick('displayBasic')} className="p-button-success"></Button>
                <Dialog header="" visible={state.displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
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