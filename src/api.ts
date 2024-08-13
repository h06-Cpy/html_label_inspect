import axios from 'axios'

export const saveLabel = () => {
    
}

export const getLabelInfo = async (labelId: number) => {
    try {

        const res = await axios.get(`http://127.0.0.1:8000/label_info/${labelId}`);
        return res.data
        
    } catch (error) {
        console.error(error);
        throw error;
    }
   
}

export const getAggInfo = () => {

}