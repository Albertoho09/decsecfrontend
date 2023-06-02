import axios from 'axios';

export class peticionService {
    baseUrl = "http://localhost:8080/api/v1/peticion/";

    async save(data) {
        const res = await axios.post(this.baseUrl + "save", data);
        return res.data;
    }

    async delete(id) {
        const res = await axios.get(this.baseUrl + "delete/" + id);
        return res.data;
    }

    async obtenerpeticiones(id) {
        const res = await axios.get(this.baseUrl + "obtener/" + id);
        return res.data;
    }

    async actualizarpeticion(codigo, estado) {
        const res = await axios.get(this.baseUrl + "obtener/" + codigo + "/" + estado);
        return res.data;
    }

    async comprobarPeticion(idemisor, idreceptor, estado) {
        const res = await axios.get(this.baseUrl + "comprobar/" + idemisor + "/" + idreceptor + "/" + estado);
        return res.data;
    }
}