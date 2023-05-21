import axios from 'axios';

export class usuarioService {
    baseUrl = "http://localhost:8080/api/v1/usuario/";

    async getAll() {
        const res = await axios.get(this.baseUrl + "all");
        return res.data;
    }

    async save(data) {
        const res = await axios.post(this.baseUrl + "save", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    }

    async delete(id) {
        const res = await axios.get(this.baseUrl + "delete/" + id);
        return res.data;
    }


    async obtener(id) {
        const res = await axios.get(this.baseUrl + "obtener/" + id);
        return res.data;
    }

    async login(correo, contrasenia) {
        const res = await axios.get(this.baseUrl + "login/" + correo + "/" + contrasenia);
        return res.data;
    }
}