import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom"
import "./principal.css"
import { Dialog } from 'primereact/dialog';
import { usuarioService } from "../../service/usuarioService"
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import Publicacion from "./publicacion";


import "primereact/resources/themes/mdc-light-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";
import { publicacionService } from '../../service/publicacionService';
import logo from '../../logo/logosimple.png';

export const Principal = () => {
    const toast = useRef(null);
    const toastError = useRef(null);
    const location = useLocation();
    const [usuarios, setusuarios] = useState([]);
    const [usuario, setusuario] = useState({ usuario: location.state });
    const [usuariosfiltrados, setusuariosfiltrados] = useState(null);
    const [usuarioseleccionado, setusuarioseleccionado] = useState(null);
    const [visible, setVisible] = useState(false);
    const [fotoejemplo, setFotoejemplo] = useState(null);
    const [publicacion, setPublicacion] = useState({
        comentario: '',
        idusuario: usuario.usuario.codigo
    });

    const [publicaciones, setpublicaciones] = useState([]);
    const [foto, setfoto] = useState({
        foto: null
    });
    const navigate = useNavigate();
    const showToastError = () => {
        toastError.current.show({ severity: 'error', summary: 'Error', detail: 'Campos de Vacios', life: 3000 });
    }
    const showToast = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Publicado Correctamente', life: 3000 });
    }
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
        servicepubli.getAll().then(data => setpublicaciones(data));
    }

    useEffect(() => {
        const service = new usuarioService();
        const servicepubli = new publicacionService();
        service.getAll().then(data => setusuarios(data));
        servicepubli.getAll().then(data => setpublicaciones(data));
    }, []);

    const guardarfoto = (e) => {

        console.log("entro en guardar foto");
        setfoto({ foto: e.target.files[0] });
        const url = URL.createObjectURL(e.target.files[0]);
        setFotoejemplo(url);
        console.log("salgo de guardar foto");
    }
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
            formData.append('file', foto.foto);
            formData.append('data', JSON.stringify(publicacion));

            service.save(formData).then(
                showToast()
            )
        }
    }

    const items = [
        {
            label: 'Publicacion',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Nueva',
                    icon: 'pi pi-fw pi-plus',
                    command: () => { setVisible(true) }
                },
                {
                    label: 'Borrar',
                    icon: 'pi pi-fw pi-trash'
                }
            ]
        },
        {
            label: 'Amigos',
            icon: 'pi pi-fw pi-user',

        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-power-off',
            command: () => { navigate('/') }
        }
    ];

    const viajaraperfil = () => {
        navigate('/perfil', { state: usuario.usuario })
    }

    const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;
    return (


        <>
            <div className="grid m-4">
                <div className="col-12">
                    <Menubar model={items} start={start} />
                </div>
            </div>

            <div class="grid justify-content-center">
                <div class="col-6 col-offset-1">
                    <Card title="Publicaciones">
                        <div class="flex justify-content-end m-3">
                            <Button icon="pi pi-refresh" rounded outlined aria-label="Filter" onClick={recargarpublicaciones} />
                            <Dialog header="Subir Publicación" visible={visible} onHide={() => setVisible(false)}
                                style={{ width: 'auto' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                <div class="grid justify-content-center m-3">
                                    <div class="grid m-3">
                                        <input type='file' name='file' onChange={(e) => guardarfoto(e)} />
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

                        {publicaciones.map((publicacion) => {
                            return (
                                < Publicacion
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
                        )}

                    </Card>
                </div>




                <div class="grid col-4">
                    <div className='fixed ml-7'>
                        <Card title={"Bienvenido " + usuario.usuario.nick} className="mb-4">

                            <div class="grid m-1">
                                <div class="col-fixed" style={{ width: 100 + 'px' }}><Avatar image={"data:image/png;base64," + usuario.usuario.fotoperfil} size="xlarge" shape="circle" /></div>
                                <div class="grid justify-content-start">
                                    <div class="grid m-2"><h4>{usuario.usuario.nombre + " " + usuario.usuario.apellido}</h4></div>
                                    <div class="grid m-4"><Button label="Ver perfil" onClick={viajaraperfil} rounded /></div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Buscar Usuario" className="mb-4">
                            <div class="grid justify-content-center">
                                <div class="grid m-2">
                                    <AutoComplete field="nick" value={usuarioseleccionado} suggestions={usuariosfiltrados}
                                        completeMethod={search} onChange={(e) => setusuarioseleccionado(e.value)} itemTemplate={itemTemplate} />
                                </div>
                                <div class="grid m-2">
                                    <Button label="Buscar" rounded />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

        </>
    )
}