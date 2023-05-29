import axios from 'axios';

export class comentarioService {
    baseUrl = "http://localhost:8080/api/v1/comentario/";

    async getAll() {
        const res = await axios.get(this.baseUrl + "all");
        return res.data;
    }

    async save(data) {
        const res = await axios.post(this.baseUrl + "save", data);
        return res.data;
    }

    async delete(id) {
        const res = await axios.get(this.baseUrl + "delete/" + id);
        return res.data;
    }

    async obtenercomentarios(id) {
        const res = await axios.get(this.baseUrl + "obtener/" + id);
        return res.data;
    }
}