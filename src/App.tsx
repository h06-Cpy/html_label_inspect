import {  useState, useRef } from 'react'
import Editor, {  OnChange } from '@monaco-editor/react';
import { getLabelInfo, saveLabel } from './api';
import { BoolTypeQuestion } from './components/BoolTypeQuestion';
import { ListTypeQuestion } from './components/ListTypeQuestion';

function App() {
  const [labelId, setLabelId] = useState(0)
  const [imageName, setImageName] = useState('')
  const originImgRef = useRef<HTMLImageElement>(null);
  
  const [html, setHtml] = useState('')

  const [structCorrect, setStruectCorrect] = useState(false)
  const [charCorrect, setCharCorrect] = useState(false)
  const [thUsed, setThUsed] = useState(true)
  const [valueEmptyCell, setValueEmptyCell] = useState(false)
  const [specialChar, setSpecialChar] = useState<Set<number>>(new Set([]))
  const [cellSubtitle, setCellSubtile] = useState<Set<number>>(new Set([]))
  const [semanticMergedCell, setSemanticMergedCell] = useState<Set<number>>(new Set([]))  
  const [partialLined, setPartialLined] = useState<Set<number>>(new Set([]))
  const [topleftHeader, setTopleftHeader] = useState<Set<number>>(new Set([]))

  const handleEditorChange: OnChange = (value) => {
    if (value) setHtml(value)
    else setHtml('')
  }

  const fillLabelInfo = async (labelId: number) => {
    const response = await getLabelInfo(labelId)

    if (response.inspected) { // 검수한 경우 해당 레이블 정보 제공
      console.log(response)
        setHtml(response.html)
        setImageName(response.imageName)

        if (originImgRef.current) {
          originImgRef.current.src = `data:image/png;base64,${response.originImage}`;
        }

        setStruectCorrect(response.structCorrect)
        setCharCorrect(response.charCorrect)
        setThUsed(response.thUsed)
        setValueEmptyCell(response.valueEmptyCell)
        setSpecialChar(new Set(response.specialChar))
        setCellSubtile(new Set(response.cellSubtitle))
        setSemanticMergedCell(new Set(response.semanticMergedCell))
        setPartialLined(new Set(response.partialLined))
        setTopleftHeader(new Set(response.topleftHeader))

    } else { // 검수 안 한 경우 레이블 html 제공
        setHtml(response.html)
        setImageName(response.imageName)

        if (originImgRef.current) {
          originImgRef.current.src = `data:image/png;base64,${response.originImage}`;
        }
    }
  }

  return (
    <>
      <div className="flex justify-between">

      <h1 className='m-5 text-3xl font-bold'>HTML Label Inspection</h1>
      <h1 className="m-5 text-3xl font-bold">총 {}개 검수 완료</h1>
      </div>

      {/* label id로 html 라벨 찾기 */}
      <div className='flex justify-center my-3'>

      <input type="number" name='label-id' placeholder='label id 입력' className="mx-5 mb-5 p-2 border-2 rounded-md text-white bg-black"
      value={labelId}
      onChange={(event) => {
          setLabelId(parseInt(event.target.value))
        }}/>
      
      <button onClick={() => fillLabelInfo(labelId)} className='p-2 border-2 h-11 rounded-md hover:bg-green-700'>찾기</button>
      </div>

      {/* 다음, 이전 라벨 보기 */}
      <div className="flex justify-center mb-5">

        <button onClick={async () => {
          if (labelId-1 >= 0){
            await fillLabelInfo(labelId-1)
            setLabelId(labelId-1)
          }
        }} className='p-2 border-2 rounded-md hover:bg-green-700'>이전</button>
        <input type="text" placeholder='파일 이름' className="p-2 mx-2 border-2 rounded-md" value={imageName}  disabled />
        <button onClick={ async () => {
          if (labelId+1 < 1200){
            await fillLabelInfo(labelId+1)
            setLabelId(labelId+1)
          }
        }} className='p-2 border-2 rounded-md hover:bg-green-700'>다음</button>
 
      </div>

      <hr className='border-gray-500'/>

      {/* 에디터 + 원본 + 렌더링된 테이블 부분 */}
      <div className='mt-5 flex flex-row w-full h-full'>

        {/* 에디터 */}
        <div className=' w-1/2 mx-1 border-r-2'>
        <Editor
        // width={'85vh'}
        height={'85vh'}
        theme='vs-dark'
        language='html'
        value={html}
        onChange={handleEditorChange} />
        </div>
        
        <div className="w-1/2 mx-1 py-5 grid grid-rows-2">
          {/* 원본 이미지 */}
          <img ref={originImgRef} src="" alt="원본 이미지" />
          {/* 렌더링된 html 테이블 */}
          <div dangerouslySetInnerHTML={{__html: html}} className='font-medium'/>
        </div>

      </div>

      {/* 체크할 사항들 */}
      <h1 className='m-5 font-bold text-3xl'>Check (GPT가 생성한 답변 기준!)</h1>
      <div className="grid grid-cols-3">
     
      <BoolTypeQuestion questionText='구조 다 맞나요?' state={structCorrect} setState={setStruectCorrect} />
      <BoolTypeQuestion questionText='글자 다 맞나요?' state={charCorrect} setState={setCharCorrect} />
      <BoolTypeQuestion questionText='테이블 헤더(th) 구분 여부' state={thUsed} setState={setThUsed} />
      <BoolTypeQuestion questionText='값이 빈 셀 있나요?(좌상단 헤더 제외)' state={valueEmptyCell} setState={setValueEmptyCell} />
      
      <ListTypeQuestion questionText='특수문자, 수식 표현' answerList={['해당 없음', '유니코드', 'Latex', 'html 태그, 개체로 표현']} state={specialChar} setState={setSpecialChar} />
      <ListTypeQuestion questionText='셀 안에 소제목' answerList={['해당 없음', '소제목도 하나의 셀 안에 표현', '소제목을 별도 셀로 표현']} state={cellSubtitle} setState={setCellSubtile} />
      <ListTypeQuestion questionText='의미 상 병합 셀' answerList={['해당 없음', '보이는 그대로 빈 셀로 표현', '값을 중복되게 채워서 표현', '병합 셀로 표현']} state={semanticMergedCell} setState={setSemanticMergedCell} />
      <ListTypeQuestion questionText='partial lined' answerList={['해당 없음', '모두 하나의 셀 안에 표현', '별도의 셀로 나눔']} state={partialLined} setState={setPartialLined} />
      <ListTypeQuestion questionText='좌상단 헤더' answerList={['해당 없음', '병합된 셀로 표현', '별도의 셀로 나눔']} state={topleftHeader} setState={setTopleftHeader} />

      </div>

      <hr className='border-gray-500'/>

      <div className="m-5 flex justify-center">
          <button className="my-3 p-2 border-2 w-1/3 rounded-md text-2xl hover:bg-green-700"
            onClick={() => {
              saveLabel(labelId, html, structCorrect, charCorrect,
                        thUsed, valueEmptyCell, specialChar, 
                        cellSubtitle, semanticMergedCell, partialLined, topleftHeader
                        )
            }}
          >저장</button>
      </div>
    
    </>
  )
}

export default App
