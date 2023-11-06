import { useEffect, useState } from "react"
import { CALL_STATUS } from "../Status";
import axios from "axios";


const useAxiosFetch = (dataUrl) => {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(CALL_STATUS.IDLE);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        
        const fetchData = async (url) => {
            setStatus(CALL_STATUS.LOADING);
            try{
                const response = await axios.get(url, {withCredentials: true});
                
                console.log(response.data)
                setData(response.data);
                setStatus(CALL_STATUS.SUCCESS)
            }catch(error){  
                setFetchError(error.response.data.message);
                setStatus(CALL_STATUS.ERROR);
            }
        }

        fetchData(dataUrl);
    }, [dataUrl]);

    const statusObj = {
        isLoading: status === CALL_STATUS.LOADING,
        isSuccess: status === CALL_STATUS.SUCCESS,
        isError: status === CALL_STATUS.ERROR,
    }
    
    return { data, fetchError, statusObj };
}

export default useAxiosFetch;
