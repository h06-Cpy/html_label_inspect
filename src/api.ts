import axios from 'axios'

export const saveLabel = (originId: number, html: string, savedImage: string) => {
    
    const reqBody = {originId: originId,html: html, savedImage: savedImage}
    console.log(savedImage)
    console.log(reqBody)
    // 개발용 url
    axios.post('http://127.0.0.1:8000/save_label', reqBody);

    // 배포용 url
    // axios.post('/save_label', reqBody);
  };

export const getLabelInfo = async (labelId: number) => {
    try {

        // 개발용 url
        const res = await axios.get(`http://127.0.0.1:8000/label_info/${labelId}`);

        // 배포용 url
        // const res = await axios.get(`/label_info/${labelId}`);
        return res.data

    } catch (error) {
        console.error(error);
        throw error;
    }
   
}