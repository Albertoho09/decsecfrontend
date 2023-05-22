import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import "../../service/usuarioService"
import "./principal.css"
import { usuarioService } from "../../service/usuarioService"
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';

import "primereact/resources/themes/mdc-light-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css";

export const Principal = () => {

    const location = useLocation();
    const [usuarios, setusuarios] = useState([]);
    const [usuario, setusuario] = useState({ usuario: location.state });
    const [usuariosfiltrados, setusuariosfiltrados] = useState(null);
    const [usuarioseleccionado, setusuarioseleccionado] = useState(null);

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
                <div>{item.nick}</div>
            </div>
        );

    };

    useEffect(() => {
        const service = new usuarioService();
        service.getAll().then(data => setusuarios(data));
    }, []);


    return (
        <>
            <div className="grid m-4">
                <div className="col-6 col-offset-3"></div>
            </div>

            <div className="grid m-8">
                <div className="col-8">
                    <div className="col-11  m-2">
                        <Card title="Publicaciones">
                            <div class="flex justify-content-end flex-wrap m-3"><Button label="Subir Publicación" rounded /></div>
                        </Card>
                    </div>
                </div>
                <div className="col-3 m-1">
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
                                <AutoComplete field="name" value={usuarioseleccionado.nick} suggestions={usuariosfiltrados}
                                    completeMethod={search} onChange={(e) => setusuarioseleccionado(e.value)} itemTemplate={itemTemplate} />
                            </div>
                            <div class="grid m-2">
                                <Button label="Buscar" rounded />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>

    )
}