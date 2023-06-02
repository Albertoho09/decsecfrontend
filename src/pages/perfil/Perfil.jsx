import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { publicacionService } from "../../service/publicacionService";
import { usuarioService } from "../../service/usuarioService";
import { peticionService } from "../../service/peticionServicio";
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import Publicacion from "../principal/publicacion";

export const Perfil = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [peticion, setpeticion] = useState({
        codigo: null,
        idemisor: location.state.ususesion.codigo,
        idreceptor: location.state.usuario.codigo,
        estado: 0
    });
    const [publicaciones, setpublicaciones] = useState([]);
    const [usuario, setusuario] = useState(location.state.usuario);
    const [usuarioeditar, setusuarioeditar] = useState({
        codigo: usuario.codigo,
        nick: usuario.nick,
        correo: usuario.correo,
        contrasenia: usuario.contrasenia,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        fechanac: usuario.fechanac,
    });

    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [valueboton, setValueboton] = useState("Añadir Amigo");
    const [inputEnabled, setInputEnabled] = useState(false);

    const toastError = useRef(null);
    const toast = useRef(null);

    const toggleInput = () => {
        setInputEnabled(!inputEnabled);
    };


    const viajaraprincipal = () => {
        const serviceusu = new usuarioService();
        serviceusu.obtener(location.state.ususesion.codigo).then(
            data => navigate('/principal', { state: data })
        )
    }

    const comprobaciones = () => {
        console.log("paso por las comprobaciones");
        if (usuarioeditar.apellido.length > 0 && usuarioeditar.nombre.length > 0
            && usuarioeditar.nick.length > 0 && usuarioeditar.fechanac !== null
            && usuarioeditar.correo.length > 0 && usuarioeditar.contrasenia.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    const actualizarUsuario = () => {
        if (comprobaciones()) {
            const serviceusu = new usuarioService();
            var formData = new FormData();
            formData.append('data', JSON.stringify(usuarioeditar));
            serviceusu.actualizar(formData);

            setTimeout(function () {
                window.location.reload()
            }, 1000)
            showSuccess()
        }
        else {
            showError()
        }
    }

    const showError = () => {
        toastError.current.show({ severity: 'error', summary: 'Error al Actualizar', detail: 'Campos Vacios', life: 3000 });
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Correcto', detail: 'Usuario Actualizado Correctamente', life: 3000 });
    }

    const enviarpeticion = () => {
        const service = new peticionService();
        service.save(peticion);
        setDisabled(true)
        setValueboton("Peticion Pendiente...")
    }

    useEffect(() => {
        const servicepubli = new publicacionService();
        const serviceusu = new usuarioService();
        serviceusu.obtener(usuario.codigo).then(data => setusuario(data))
        serviceusu.obtener(usuario.codigo).then(data => setusuarioeditar({
            codigo: data.codigo,
            nick: data.nick,
            correo: data.correo,
            contrasenia: data.contrasenia,
            nombre: data.nombre,
            apellido: data.apellido,
            fechanac: data.fechanac,
        }))
        servicepubli.obtener(usuario.codigo).then(data => setpublicaciones(data)
        );
        const servicepeti = new peticionService();
        servicepeti.comprobarPeticion(location.state.ususesion.codigo, location.state.usuario.codigo, 0).then(
            data => {
                if (data == 1) {
                    setDisabled(true)
                    setValueboton("Peticion Pendiente...")
                }
            }
        )
        servicepeti.comprobarPeticion(location.state.ususesion.codigo, location.state.usuario.codigo, 1).then(
            data => {
                if (data == 1) {
                    setDisabled(true)
                    setValueboton("Ya es tu amigo")
                }
            }
        )
    }, []);
    return (
        <>
            <div className="card grid justify-content-center">
                <Card style={{ width: '70%', marginTop: '5%' }}>
                    <div className="surface-0">
                        <div className="flex align-items-start">
                            <Image src={"data:image/png;base64," + usuario.fotoperfil} alt="Image" width="130" className="ml-1" />
                            <div className="flex flex-column ml-4">
                                <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                                    <li>
                                        <a onClick={viajaraprincipal} className="text-500 no-underline line-height-3 cursor-pointer">Principal</a>
                                    </li>
                                    <li className="px-2">
                                        <i className="pi pi-angle-right text-500 line-height-3"></i>
                                    </li>
                                    <li>
                                        <span className="text-900 line-height-3">Perfil</span>
                                    </li>
                                </ul>
                                <div className="font-medium text-3xl text-900">{usuario.nick}</div>
                                <div className="flex align-items-center text-700 flex-wrap">
                                    <div className="mr-5 flex align-items-center mt-3">
                                        <i className="pi pi-id-card mr-2"></i>
                                        <span>{usuario.nombre + " " + usuario.apellido}</span>
                                    </div>
                                    <div className="mr-5 flex align-items-center mt-3">
                                        <i className="pi pi-gift mr-2"></i>
                                        <span>{usuario.fechanac.substring(0, 10)}</span>
                                    </div>

                                    <div className="flex align-items-center mt-3">
                                        <i className="pi pi-users mr-2"></i>
                                        <span>{usuario.namigos + " amigos"}</span>
                                    </div>
                                    <div className="flex align-items-center mt-3">
                                        <i className="pi pi-images mr-2 ml-4"></i>
                                        <span>{usuario.npublicaciones + " publicaciones"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-content-end mr-2">
                            {
                                usuario.codigo == location.state.ususesion.codigo ? (
                                    <Button label="Editar" icon="pi pi-user-edit" onClick={() => setVisible(true)} />
                                ) : (
                                    <Button disabled={disabled} label={valueboton} className="p-button-outlined mr-1" icon="pi pi-user-plus" onClick={enviarpeticion} />
                                )
                            }
                            <Dialog visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                <div className="surface-0 m-2">
                                    <div className="font-medium text-3xl text-900 mb-3">Editar Usuario</div>
                                    <div className="text-500 mb-5">La pagina se actualizará cuando guardes los cambios.</div>
                                    <div className="flex justify-content-end">
                                        <Button label="Guardar" icon="pi pi-save" className="p-button-text" severity="success" onClick={actualizarUsuario} />
                                        <Button label="Habilitar Edición" icon="pi pi-pencil" className="p-button-text" onClick={toggleInput} />
                                    </div>
                                    <ul className="list-none p-0 m-0">
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Nick</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><InputText value={usuarioeditar.nick}
                                                onChange={(e) => setusuarioeditar(prevState => ({
                                                    ...prevState,
                                                    nick: e.target.value
                                                }))} disabled={!inputEnabled} /></div>

                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Nombre</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><InputText value={usuarioeditar.nombre}
                                                onChange={(e) => setusuarioeditar(prevState => ({
                                                    ...prevState,
                                                    nombre: e.target.value
                                                }))} disabled={!inputEnabled} /></div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Apellido</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><InputText value={usuarioeditar.apellido}
                                                onChange={(e) => setusuarioeditar(prevState => ({
                                                    ...prevState,
                                                    apellido: e.target.value
                                                }))} disabled={!inputEnabled} /></div>

                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Correo</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                <InputText value={usuarioeditar.correo}
                                                    onChange={(e) => setusuarioeditar(prevState => ({
                                                        ...prevState,
                                                        correo: e.target.value
                                                    }))} disabled={!inputEnabled} /></div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Contraseña</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                <Password value={usuarioeditar.contrasenia}
                                                    onChange={(e) => setusuarioeditar(prevState => ({
                                                        ...prevState,
                                                        contrasenia: e.target.value
                                                    }))} disabled={!inputEnabled} toggleMask /></div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Fecha de Nacimiento</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                <span className='mr-2'>{usuario.fechanac.substring(0, 10)}</span>
                                                <Calendar value={usuarioeditar.fechanac} dateFormat="yy-mm-dd" placeholder='yy-mm-dd'
                                                    onChange={(e) => setusuarioeditar(prevState => ({
                                                        ...prevState,
                                                        fechanac: e.value
                                                    }))} disabled={!inputEnabled} showIcon /></div>
                                        </li>
                                    </ul>
                                </div>
                                <Toast ref={toastError} />
                                <Toast ref={toast} />
                            </Dialog>
                        </div>
                    </div>
                </Card>
                <Card style={{ width: '70%', marginTop: '2%' }}>
                    {
                        publicaciones.length === 0 ? (
                            <h3>Este usuario no tiene publicaciones</h3>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                                {
                                    publicaciones.map((publicacion) => {
                                        return (
                                            <div style={{ flexBasis: '33.33%', marginBottom: '2%' }}>
                                                < Publicacion
                                                    codigo={publicacion.codigo}
                                                    comentario={publicacion.comentario}
                                                    foto={publicacion.foto}
                                                    idusuario={publicacion.idusuario}
                                                    likes={publicacion.likes}
                                                    ncomentarios={publicacion.ncomentarios}
                                                    usuariosesion={usuario.codigo}
                                                    usuarionick={usuario.nick}
                                                    width={"350"}
                                                    height={"350"}
                                                    ancho={"25"}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )}
                </Card>
            </div>
        </>
    )
}