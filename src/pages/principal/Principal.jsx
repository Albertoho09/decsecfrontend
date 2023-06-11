import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';

import { peticionService } from '../../service/peticionServicio';
import { publicacionService } from '../../service/publicacionService';
import { usuarioService } from "../../service/usuarioService";

import Publicacion from "./publicacion";
import Peticion from "./Peticion";

import "./principal.css";
import "primereact/resources/themes/mdc-light-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";

import logo from '../../logo/logosimple.png';

export const Principal = () => {
    //objetos de mensaje de error
    const toast = useRef(null);
    const toastError = useRef(null);

    //obejeto para recibir los datos del login
    const location = useLocation();

    const [usuarios, setusuarios] = useState([]);
    const [usuario] = useState({ usuario: location.state });

    //variables para el autocomplete
    const [usuariosfiltrados, setusuariosfiltrados] = useState(null);
    const [usuarioseleccionado, setusuarioseleccionado] = useState(null);

    const [visiblepeti, setVisiblepeti] = useState(false);

    //variables para la subida de una publicacion
    const [visible, setVisible] = useState(false);
    const [fotoejemplo, setFotoejemplo] = useState(null);
    const [publicacion, setPublicacion] = useState({
        comentario: '',
        idusuario: usuario.usuario.codigo
    });

    const [publicaciones, setpublicaciones] = useState([]);
    const [peticiones, setpeticiones] = useState([]);

    const [foto, setfoto] = useState({
        foto: null
    });

    //slidebar
    const [visibleRight, setVisibleRight] = useState(false);


    //obejto para navegar entre paginas
    const navigate = useNavigate();

    //logo del menu
    const start = <img alt="logo" src={logo} height="40"></img>;

    const showToastError = () => {
        toastError.current.show({ severity: 'error', summary: 'Error', detail: 'Campos de Vacios', life: 3000 });
    }
    const showToast = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Publicado Correctamente', life: 3000 });
    }

    //metodo del autocomplet
    const search = (event) => {

        setTimeout(() => {
            let _usuariosfiltrados;

            if (!event.query.trim().length) {
                _usuariosfiltrados = [...usuarios];
            }
            else {
                _usuariosfiltrados = usuarios.filter((usuario) => {
                    return usuario.nick.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setusuariosfiltrados(_usuariosfiltrados);
        }, 250);
    }

    //metodo del autocomplet
    const itemTemplate = (item) => {
        return (
            <div className="grid align-items-center">
                <Avatar image={"data:image/png;base64," + item.fotoperfil} size="large" shape="circle" />
                <div className='ml-2'>{item.nick}</div>
            </div>
        );

    };

    const handelChange = (e) => {
        setPublicacion((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const recargarpublicaciones = () => {
        const servicepubli = new publicacionService();
        servicepubli.publicacionesamigos(usuario.usuario.codigo).then(data => setpublicaciones(data));
    }

    //codigo que se ejecuta solo una vez
    useEffect(() => {
        const service = new usuarioService();
        const servicepubli = new publicacionService();
        const servicepeti = new peticionService();
        service.getAll().then(data => setusuarios(data));
        servicepubli.publicacionesamigos(usuario.usuario.codigo).then(data => setpublicaciones(data));
        servicepeti.obtenerpeticiones(usuario.usuario.codigo).then(data => setpeticiones(data))
    }, []);


    const guardarfoto = (e) => {

        console.log("entro en guardar foto");
        setfoto({ foto: e.target.files[0] });
        const url = URL.createObjectURL(e.target.files[0]);
        setFotoejemplo(url);
    }

    //comprobaciones antes de subir una foto
    const comprobaciones = () => {
        if (publicacion.comentario !== '' && foto.foto !== null) {
            return true;
        }
        showToastError();
        return false;
    }


    const subirPublicacion = () => {
        const service = new publicacionService();
        if (comprobaciones()) {
            var formData = new FormData();
            formData.append('file', foto.foto); //separo la foto de los datos del usuario
            formData.append('data', JSON.stringify(publicacion));

            service.save(formData).then(
                showToast()
            )
        }
    }



    //elementos del menu
    const items = [
        {
            label: 'Publicacion',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Nueva',
                    icon: 'pi pi-fw pi-plus',
                    command: () => { setVisible(true) }
                }
            ]
        },
        {
            label: 'Amigos',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Peticiones',
                    icon: 'pi pi-inbox',
                    command: () => {
                        const servicepeti = new peticionService();
                        servicepeti.obtenerpeticiones(usuario.usuario.codigo).then(
                            data => setpeticiones(data),
                            setVisiblepeti(true)
                        )
                    }
                }
            ]
        },
        {
            label: 'Chat',
            icon: 'pi pi-comments',
            command: () => {
                setVisibleRight(true)
            }
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-fw pi-power-off',
            command: () => { navigate('/') }
        }
    ];

    //viajo a mi perfil de usuario
    const viajaraperfil = () => {
        let Data = { usuario: usuario.usuario, ususesion: usuario.usuario }
        navigate('/perfil', { state: Data })
    }

    //compruebo si ha seleccionado un usuario en el autocomplete y le mando a su perfil
    const buscarUsuario = () => {
        if (typeof usuarioseleccionado === "object" && usuarioseleccionado !== null) {
            let Data = { usuario: usuarioseleccionado, ususesion: usuario.usuario }
            navigate('/perfil', { state: Data })
        }
    }

    //manejar el iframe
    const [mensaje, setmensaje] = useState("");
    const enviarMensajeIframe = () => {
        var iframe = document.getElementById("iframechat");
        iframe.contentWindow.postMessage("<b>" + usuario.usuario.nick + "</b>" + ": " + mensaje, "http://localhost:8080/");
    }

    return (


        <>
            <Dialog header="Peticiones Pendientes" visible={visiblepeti} position="top" style={{ width: '40vw' }} onHide={() => setVisiblepeti(false)} draggable={false} resizable={false}>
                <div className='p-5'>
                    <div className="card">
                        {
                            peticiones.length === 0 ? (
                                <h3>No hay Peticiones Pendientes</h3>
                            ) : (

                                peticiones.map((peticion) => {
                                    return (
                                        <Peticion
                                            codigo={peticion.codigo}
                                            idemisor={peticion.idemisor}
                                            idreceptor={peticion.idreceptor}
                                            estado={peticion.estado}
                                        />
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            </Dialog>

            <div className="grid">
                <div className="fixed col-12" style={{ zIndex: 1 }}>
                    <Menubar className='justify-content-center' style={{ backgroundColor: "white" }} model={items} start={start} />
                </div>
            </div>

            <Sidebar style={{ width: '450px' }} title="Bienvenido al Chat" visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <h2>Bienvenido al chat</h2>
                <div className='flex'>
                    <InputText id="inputmensaje" type="text" placeholder="Escribe tu Mensaje..." className="w-full mb-3" value={mensaje}
                        onChange={(e) => setmensaje(e.target.value)} />
                    <Button className='m-1' icon="pi pi-send" rounded outlined aria-label="Filter" onClick={enviarMensajeIframe} />
                </div>

                <iframe id="iframechat" src="http://localhost:8080/" height="800" style={{ border: 'none', width: '100%' }} />
            </Sidebar>

            <div className="grid justify-content-center" style={{ marginTop: "6%" }}>
                <div className="col-6">
                    <Card title="Publicaciones">
                        <div className="flex justify-content-end m-3">
                            <Button icon="pi pi-refresh" rounded outlined aria-label="Filter" onClick={recargarpublicaciones} />
                            <Dialog header="Subir Publicación" visible={visible} onHide={() => setVisible(false)}
                                style={{ width: 'auto' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                <div className="grid justify-content-center m-3">
                                    <div className="grid m-3">
                                        <input type='file' name='file' accept="image/png" onChange={(e) => guardarfoto(e)} />
                                        <Image src={fotoejemplo} alt="Image" width="350" preview />
                                        <span className="p-float-label m-3">
                                            <InputTextarea autoResize value={publicacion.comentario} name='comentario' onChange={handelChange} rows={5} cols={30} />
                                            <label htmlFor="Comentario">Comentario</label>
                                        </span>

                                    </div>

                                </div>

                                <Button label="Subir Publicación" icon="pi pi-check" onClick={subirPublicacion} />
                                <Toast ref={toast} position="bottom-left" />
                                <Toast ref={toastError} position="bottom-left" />
                            </Dialog>
                        </div>
                        {
                            publicaciones.length === 0 ? (
                                <div className='flex justify-content-center opacity-50'><h2>No hay publicaciones</h2></div>
                            ) : (
                                publicaciones.map((publicacion) => {
                                    return (
                                        < Publicacion
                                            key={publicacion.codigo}
                                            codigo={publicacion.codigo}
                                            comentario={publicacion.comentario}
                                            foto={publicacion.foto}
                                            idusuario={publicacion.idusuario}
                                            likes={publicacion.likes}
                                            ncomentarios={publicacion.ncomentarios}
                                            usuariosesion={usuario.usuario.codigo}
                                            usuarionick={usuario.usuario.nick}
                                            width={"650"}
                                            height={"auto"}
                                            ancho={"40"}
                                        />
                                    )
                                }
                                )
                            )
                        }
                    </Card>
                </div>

                <div className="grid col-4">
                    <div className='fixed ml-7'>
                        <Card title={"Bienvenido " + usuario.usuario.nick} className="mb-4">

                            <div className="grid m-1">
                                <div className="col-fixed" style={{ width: 100 + 'px' }}><Avatar image={"data:image/png;base64," + usuario.usuario.fotoperfil} size="xlarge" shape="circle" /></div>
                                <div className="grid justify-content-start">
                                    <div className="grid m-2"><h4>{usuario.usuario.nombre + " " + usuario.usuario.apellido}</h4></div>
                                    <div className="grid m-4"><Button label="Ver perfil" onClick={viajaraperfil} rounded /></div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Buscar Usuario" className="mb-4">
                            <div className="grid justify-content-center">
                                <div className="grid m-2">
                                    <AutoComplete field="nick" value={usuarioseleccionado} suggestions={usuariosfiltrados}
                                        completeMethod={search} onChange={(e) => setusuarioseleccionado(e.value)} itemTemplate={itemTemplate} />
                                </div>
                                <div className="grid m-2">
                                    <Button label="Buscar" onClick={buscarUsuario} rounded />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

        </>
    )
}
