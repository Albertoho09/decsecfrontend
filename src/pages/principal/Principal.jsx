import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom"
import "../../service/usuarioService"
import "../../service/publicacionService"
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

import "primereact/resources/themes/mdc-light-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";
import { publicacionService } from '../../service/publicacionService';

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
        codigousuario: usuario.usuario.codigo
    });

    const [publicaciones, setpublicaciones] = useState([]);



    const [foto, setfoto] = useState({
        foto: null
    });
    const showToastError = () => {
        toastError.current.show({ severity: 'error', summary: 'Error', detail: 'Campos de Vacios', life: 3000 });
    }
    const showToast = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Publicado Correctamente', life: 3000 });
    }
    const search = (event) => {
        // Timeout to emulate a network connection
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

    return (


        <>
            <div className="grid m-4">
                <div className="col-6 col-offset-3"></div>
            </div>

            <div class="grid justify-content-center">
                <div class="col-6 col-offset-1">
                    <Card title="Publicaciones">
                        <div class="flex justify-content-end m-3">
                            <Button label="Subir Publicación" onClick={() => setVisible(true)} rounded />
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

                        {publicaciones.map(publicacion =>
                            <div className='flex justify-content-center'>
                                <Card title="Title" subTitle="melva" className="md:w-35rem m-3">
                                    <Image src={"data:image/png;base64," + publicacion.foto} alt="Image" width="550" preview />
                                    <p className="m-3">
                                        {publicacion.comentario}
                                    </p>
                                </Card>

                            </div>
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
                                    <div class="grid m-4"><Button label="Ver perfil" rounded /></div>
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