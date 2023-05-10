import axios from 'axios';

export class usuarioService {
    baseUrl = "http://localhost:8080/api/v1/usuario/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(persona) {
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id) {
        return axios.get(this.baseUrl + "delete/"+id).then(res => res.data);
    }

    
    obtener(id) {
        return axios.get(this.baseUrl + "obtener/"+id).then(res => res.data);
    }

    login(correo, contrasenia) {
        return axios.get(this.baseUrl + "login/"+correo+"/"+contrasenia).then(res => res.data);
    }
}