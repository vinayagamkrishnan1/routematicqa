import axios from 'axios';


export const get = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
}