import { useEffect, useState } from "react"
import { CALL_STATUS } from "../Status";
import axios from "axios";


const useAxiosFetch = (dataUrl) => {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(CALL_STATUS.IDLE);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController()

        const fetchData = async (url) => {
            setStatus(CALL_STATUS.LOADING);
            try{
                const response = await axios.get(url, {
                    withCredentials: true,
                    signal: abortController.signal
                });
                if(isMounted) {
                    setData(response.data);
                    setStatus(CALL_STATUS.SUCCESS)
                }
            }catch(error){
                if(isMounted){
                     if (axios.isCancel(error)) {
                       setFetchError("Operation cancelled");
                       setStatus(CALL_STATUS.ERROR);
                     }
                     else {
                       setFetchError(error.response.data.message);
                       setStatus(CALL_STATUS.ERROR);
                     }
                }
            }finally{
                isMounted = false;
            }
        }

        fetchData(dataUrl);

        const cleanUp = () => {
            isMounted = false;
            abortController.abort();
        }

        return cleanUp
    }, [dataUrl]);

    const statusObj = {
        isLoading: status === CALL_STATUS.LOADING,
        isSuccess: status === CALL_STATUS.SUCCESS,
        isError: status === CALL_STATUS.ERROR,
    }

    return { data, fetchError, statusObj };
}

export default useAxiosFetch;