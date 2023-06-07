import React, { useState, useEffect } from "react";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { usuarioService } from "../../service/usuarioService"
import { peticionService } from "../../service/peticionServicio"

const Peticion = (props) => {

    //el objeto peticion
    const [peticion, setpeticion] = useState({
        codigo: props.codigo,
        idemisor: props.idemisor,
        idreceptor: props.idreceptor,
        estado: props.estado,
    });

    //variables de los datos que muestro del ususario que ha realizado la peticion
    const [foto, setfoto] = useState()
    const [nick, setnick] = useState()

    //variables para el cambio visual
    const [visible, setvisible] = useState("hidden")
    const [letrero, setletrero] = useState("")
    const [disabled, setDisabled] = useState(false);


    //si la peticion es aceptada cambio los valores y muestro el texto junto con la llamada a la api
    const aceptarPeticion = () => {
        const servicepeti = new peticionService();

        servicepeti.actualizarpeticion(peticion.codigo, 1)

        setletrero(">> Petición Aceptada <<")
        setvisible("visible")
        setDisabled(true)
    }

    //si la peticion es denegada cambio los valores y muestro el texto junto con la llamada a la api
    const denegarPeticion = () => {
        const servicepeti = new peticionService();

        servicepeti.delete(peticion.codigo)

        setletrero(">> Petición Denegada <<")
        setvisible("visible")
        setDisabled(true)
    }

    const startContent = () => {
        return (
            <React.Fragment>
                <Image src={"data:image/png;base64," + foto} alt="Image" width="60" height="60" className="shadow-2 border-round" />
                <b className='ml-3'>{nick}</b>
            </React.Fragment>
        )
    };

    const endContent = () => {
        return (
            <React.Fragment>
                <b className='mr-4' style={{ visibility: { visible } }} >{letrero}</b>
                <Button disabled={disabled} label="Denegar" severity="danger" onClick={denegarPeticion} />
                <Button disabled={disabled} label="Aceptar" severity="success" className='ml-2' onClick={aceptarPeticion} />
            </React.Fragment>)
    };

    //codigo que se ejecuta solo una vez
    useEffect(() => {
        const serviceusuario = new usuarioService();

        serviceusuario.obtener(peticion.idemisor).then(data => {
            setfoto(data.fotoperfil)
        })
        serviceusuario.obtener(peticion.idemisor).then(data => {
            setnick(data.nick)
        })
    }, []);



    return (
        <Toolbar start={startContent} end={endContent} />
    )
}

export default Peticion;