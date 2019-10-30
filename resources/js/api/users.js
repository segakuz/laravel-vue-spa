import Axios from 'axios';

export default{
    all(params = null){
        return Axios.get('/api/users', params);
    },
    find(id){
        return Axios.get(`/api/users/${id}`);
    },
    update(id, data){
        return Axios.put(`/api/users/${id}`, data);
    },
};
