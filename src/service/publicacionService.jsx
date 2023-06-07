import axios from 'axios';

export class publicacionService {
    baseUrl = "http://localhost:8080/api/v1/publicacion/";

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

    async megusta(id) {
        const res = await axios.put(this.baseUrl + "megusta/" + id);
        return res.data;
    }

    async nomegusta(id) {
        const res = await axios.put(this.baseUrl + "nomegusta/" + id);
        return res.data;
    }


    async obtener(id) {
        const res = await axios.get(this.baseUrl + "obtener/" + id);
        return res.data;
    }

    async publicacionesamigos(id) {
        const res = await axios.get(this.baseUrl + "publicacionesamigos/" + id);
        return res.data;
    }
}