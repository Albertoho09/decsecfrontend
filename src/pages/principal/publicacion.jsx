import React, { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Badge } from 'primereact/badge';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { comentarioService } from "../../service/comentarioService";
import { usuarioService } from "../../service/usuarioService";
import { publicacionService } from "../../service/publicacionService";
const Publicacion = (props) => {

    //dialog de comentarios
    const [visible, setVisible] = useState(false)

    const [comentarios, setcomentarios] = useState([])

    //variable para subir un comentario
    const [comentario, setcomentario] = useState({
        idpublicacion: props.codigo,
        idusuario: props.usuariosesion,
        nickusuario: props.usuarionick,
        comentario: ''
    })

    //la foto de quien pertenece la publicacion no esta en la tabla publicacion, la busco aparte
    const [usuariofoto, setusuariofoto] = useState({})

    //variable para sumar o restar like
    const [like, setlike] = useState(false)

    //var para mostrar directamente la subida o bajada del contador de likes
    const [nlikes, setnlikes] = useState(props.likes)


    //enviar el comentario (una vez guardados se actualiza)
    const enviarComentario = () => {
        const service = new comentarioService();
        service.save(comentario).then(data =>
            service.obtenercomentarios(props.codigo).then(data => setcomentarios(data))
        )
        setcomentario((prev) => ({ ...prev, comentario: '' }));
    }

    const darlike = () => {
        const service = new publicacionService();
        try {
            if (!like) {
                service.megusta(props.codigo)
                setlike(true)
                setnlikes(nlikes + 1);
            } else {
                service.nomegusta(props.codigo)
                setlike(false)
                setnlikes(nlikes - 1);
            }

        } catch (err) {
            console.log(err);
        }
    }

    //metodo que solo se ejecuta una vez
    useEffect(() => {
        const service = new comentarioService();
        const serviceusuario = new usuarioService();
        service.obtenercomentarios(props.codigo).then(data => setcomentarios(data));
        serviceusuario.obtener(props.idusuario).then(data => setusuariofoto(data))
    }, []);

    return (
        <div className='flex justify-content-center'>
            <Card className={"md:w-" + props.ancho + "rem m-3 flex justify-content-center"}>
                <div className="m-3">
                    <Image src={"data:image/png;base64," + usuariofoto.fotoperfil} alt="Image" width="65" height="65" className="shadow-2 border-round" />
                    <b className="m-4">{usuariofoto.nick}</b>
                </div>

                <Image src={"data:image/png;base64," + props.foto} alt="Image" width={props.width} height={props.height} preview />
                <Card className="mt-2">
                    <p className="m-0">
                        {props.comentario}
                    </p>
                </Card>
                <div className='flex justify-content-center mt-3'>
                    <div className='m-1'>
                        <Button icon="pi pi-heart" rounded text severity="danger" aria-label="Favorite" onClick={darlike} />
                        <Badge value={nlikes} severity="danger"></Badge>
                    </div>
                    <div className='m-1 ml-6'>
                        <Button icon="pi pi-comment" rounded text severity="info" aria-label="Favorite" onClick={() => setVisible(true)} />
                        <Dialog header="Comentarios" ClassName='flex justify-content-center' visible={visible} style={{ width: '40vw' }} onHide={() => setVisible(false)}>
                            <div className="justify-content-center">
                                <DataTable className="mb-3" value={comentarios} tableStyle={{ minWidth: '20rem', maxWidth: '37rem' }}>
                                    <Column field="nickusuario" header="usuario"></Column>
                                    <Column field="comentario" header="comentario" ></Column>
                                </DataTable>

                                <div>
                                    <InputTextarea autoResize value={comentario.comentario} onChange={(e) => setcomentario((prev) => ({ ...prev, comentario: e.target.value }))} rows={1} cols={69} />
                                    <Button className="m-2" icon="pi pi-send" rounded outlined severity="info" aria-label="User" onClick={enviarComentario} />
                                </div>
                            </div>
                        </Dialog>
                        <Badge value={props.ncomentarios} severity="info"></Badge >
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default Publicacion;