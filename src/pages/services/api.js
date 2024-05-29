import axios from "axios";

const api = axios.create({
    baseURL: 'https://back-tcc-1.onrender.com' 
});



export default  api;
