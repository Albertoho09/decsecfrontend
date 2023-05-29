import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Publicacion from "../principal/publicacion";
import { publicacionService } from "../../service/publicacionService";
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';

export const Perfil = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [publicaciones, setpublicaciones] = useState([]);
    const [usuario, setusuario] = useState(location.state);
    const [visible, setVisible] = useState(false);

    const [inputEnabled, setInputEnabled] = useState(false);

    const toggleInput = () => {
        setInputEnabled(!inputEnabled);
    };


    const viajaraprincipal = () => {
        navigate('/principal', { state: usuario })
    }

    useEffect(() => {
        const servicepubli = new publicacionService();
        servicepubli.obtener(usuario.codigo).then(data => setpublicaciones(data));
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
                            <Button label="Añadir Amigo" className="p-button-outlined mr-1" icon="pi pi-user-plus" />
                            <Button label="Editar" icon="pi pi-user-edit" onClick={() => setVisible(true)} />
                            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                <div className="surface-0 m-2">
                                    <div className="font-medium text-3xl text-900 mb-3">Movie Information</div>
                                    <div className="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
                                    <div className="flex justify-content-end">
                                        <Button label="Guardar" icon="pi pi-save" className="p-button-text" severity="success" onClick={toggleInput} />
                                        <Button label="Habilitar Edición" icon="pi pi-pencil" className="p-button-text" onClick={toggleInput} />
                                    </div>
                                    <ul className="list-none p-0 m-0">
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Nick</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><InputText disabled={!inputEnabled} /></div>

                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Nombre</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><InputText disabled={!inputEnabled} /></div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Apellido</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><InputText disabled={!inputEnabled} /></div>

                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Correo</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                <InputText disabled={!inputEnabled} /></div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Contraseña</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                <Password disabled={!inputEnabled} toggleMask /></div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Fecha de Nacimiento</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                                <Calendar disabled={!inputEnabled} showIcon /></div>
                                        </li>
                                    </ul>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </Card>
                <Card style={{ width: '70%', marginTop: '2%' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {publicaciones.map((publicacion) => {
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

                        }
                        )}
                    </div>
                </Card>
            </div>
        </>
    )
}