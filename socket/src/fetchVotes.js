import axios from "axios";

export default async () => {
    try {
        const res = await axios.get(`${process.env.API_URL}/vote/stats`);
        return res?.data 
    } catch (error) {
        console.log(error);
    }
}