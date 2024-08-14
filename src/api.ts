import axios from 'axios'

export const saveLabel = (
    labelId: number, 
    html: string, 
    structCorrect: boolean, 
    charCorrect: boolean, 
    thUsed: boolean, 
    valueEmptyCell: boolean, 
    supsub: number, 
    cellSubtitle: number, 
    semanticMergedCell: number, 
    partialLined: number,
    topleftHeader: number
  ) => {
    
    const reqBody = {
        label_id: labelId,
        html: html,
        struct_correct: structCorrect,
        char_correct: charCorrect,
        th_used: thUsed,
        value_empty_cell: valueEmptyCell,
        supsub: supsub,
        cell_subtitle: cellSubtitle,
        semantic_merged_cell: semanticMergedCell,
        partial_lined: partialLined,
        topleft_header: topleftHeader
      }
    console.log(reqBody)

    // 개발용 url
    // axios.post('http://127.0.0.1:8000/save_label', reqBody);

    // 배포용 url
    axios.post('/save_label', reqBody);
  };

export const getLabelInfo = async (labelId: number) => {
    try {

        // 개발용 url
        // const res = await axios.get(`http://127.0.0.1:8000/label_info/${labelId}`);

        // 배포용 url
        const res = await axios.get(`/label_info/${labelId}`);
        return res.data

    } catch (error) {
        console.error(error);
        throw error;
    }
   
}

export const getAggInfo = () => {

}