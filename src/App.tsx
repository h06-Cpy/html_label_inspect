import { useEffect, useState, useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader, OnChange } from '@monaco-editor/react';
import { getLabelInfo, saveLabel } from './api';

function App() {
  const [labelId, setLabelId] = useState(0)
  const [imageName, setImageName] = useState('')
  const originImgRef = useRef<HTMLImageElement>(null);
  
  const [html, setHtml] = useState('')

  const [structCorrect, setStruectCorrect] = useState(false)
  const [charCorrect, setCharCorrect] = useState(false)
  const [supsub, setSupsub] = useState(0)
  const [thUsed, setThUsed] = useState(true)
  const [valueEmptyCell, setValueEmptyCell] = useState(false)
  const [cellSubtitle, setCellSubtile] = useState(0)
  const [semanticMergedCell, setSemanticMergedCell] = useState(0)  
  const [partialLined, setPartialLined] = useState(0)

  const handleEditorChange: OnChange = (value, event) => {
    if (value) setHtml(value)
    else setHtml('')
  }


  return (
    <>
      <div className="flex justify-between">

      <h1 className='m-5 text-3xl font-bold'>HTML Label Inspection</h1>
      <h1 className="m-5 text-3xl font-bold">총 {}개 검수 완료</h1>
      </div>

      {/* label id로 html 라벨 찾기 */}
      <div className='flex justify-center my-3'>

      <input type="text" name='label-id' placeholder='label id 입력' className="mx-5 mb-5 p-2 border-2 rounded-md text-black" 
      onChange={(event) => setLabelId(parseInt(event.target.value))}/>
      
      <button onClick={async () => {
        const response = await getLabelInfo(labelId)

        if (response.inspected) { // 검수한 경우 해당 레이블 정보 제공
            setHtml(response.html)
            setImageName(response.imageName)

            if (originImgRef.current) {
              originImgRef.current.src = `data:image/png;base64,${response.originImage}`;
            }

            setStruectCorrect(response.structCorrect)
            setCharCorrect(response.charCorrect)
            setThUsed(response.thUsed)
            setValueEmptyCell(response.valueEmptyCell)
            setSupsub(response.supsub)
            setCellSubtile(response.cellSubtitle)
            setSemanticMergedCell(response.semanticMergedCell)
            setPartialLined(response.partialLined)

        } else { // 검수 안 한 경우 레이블 html 제공
            setHtml(response.html)
            setImageName(response.imageName)

            if (originImgRef.current) {
              originImgRef.current.src = `data:image/png;base64,${response.originImage}`;
            }
        }

      }} className='p-2 border-2 h-11 rounded-md hover:bg-green-700'>찾기</button>
      </div>

      {/* 다음, 이전 라벨 보기 */}
      <div className="flex justify-center mb-5">

        <button className='p-2 border-2 rounded-md hover:bg-green-700'>이전</button>
        <input type="text" placeholder='파일 이름' className="p-2 mx-2 border-2 rounded-md" disabled />
        <button className='p-2 border-2 rounded-md hover:bg-green-700'>다음</button>
 
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
        

        <div className="w-1/2 mx-1 py-5 grid grid-rows-2 gap-5">
          {/* 원본 이미지 */}
          <img ref={originImgRef} src="" alt="원본 이미지" />
          {/* 렌더링된 html 테이블 */}
          <div dangerouslySetInnerHTML={{__html: html}} className='font-medium'/>
        </div>
      </div>

      {/* 체크힐 사항들 */}
      <h1 className='m-5 font-bold text-3xl'>Check</h1>
      <div className="grid grid-cols-2">
      
      <div className='mb-2'>
        <h2 className="mx-5 mb-3 font-bold text-xl">구조 다 맞나요?</h2>
        <div className="mx-5 mb-5">
        <button onClick={() => setStruectCorrect(true)} className={`mr-5 p-2 border-2 rounded-md ${structCorrect===true ? 'bg-green-700': ''}`}>네</button>
        <button onClick={() => setStruectCorrect(false)} className={`mr-5 p-2 border-2 rounded-md ${structCorrect===false ? 'bg-green-700': ''}`}>아니오</button>
        </div>      
      </div>

        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">글자 다 맞나요?</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setCharCorrect(true)} className={`mr-5 p-2 border-2 rounded-md ${charCorrect===true ? 'bg-green-700': ''}`}>네</button>
          <button onClick={() => setCharCorrect(false)} className={`mr-5 p-2 border-2 rounded-md ${charCorrect===false ? 'bg-green-700': ''}`}>아니오</button>
          </div>   
        </div>


        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">테이블 헤더(th) 구분 여부</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setThUsed(true)} className={`mr-5 p-2 border-2 rounded-md ${thUsed===true ? 'bg-green-700': ''}`}>th 사용</button>
          <button onClick={() => setThUsed(false)} className={`mr-5 p-2 border-2 rounded-md ${thUsed===false ? 'bg-green-700': ''}`}>th 사용 안함</button>
          </div>
        </div>

        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">값이 빈 셀 있나요?(좌상단 헤더 제외)</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setValueEmptyCell(true)} className={`mr-5 p-2 border-2 rounded-md ${valueEmptyCell===true ? 'bg-green-700': ''}`}>네</button>
          <button onClick={() => setValueEmptyCell(false)} className={`mr-5 p-2 border-2 rounded-md ${valueEmptyCell===false ? 'bg-green-700': ''}`}>아니오</button>
          </div>
        </div>

        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">첨자 표현</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setSupsub(0)} className={`mr-5 p-2 border-2 rounded-md ${supsub==0 ? 'bg-green-700': ''}`}>해당 없음</button>
          <button onClick={() => setSupsub(1)} className={`mr-5 p-2 border-2 rounded-md ${supsub==1 ? 'bg-green-700': ''}`}>유니코드</button>
          <button onClick={() => setSupsub(2)} className={`mr-5 p-2 border-2 rounded-md ${supsub==2 ? 'bg-green-700': ''}`}>Latex</button>
          <button onClick={() => setSupsub(3)} className={`mr-5 p-2 border-2 rounded-md ${supsub==3 ? 'bg-green-700': ''}`}>{'<sup> <sub>태그'}</button>
          </div>
        </div>

        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">셀 안에 소제목</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setCellSubtile(0)} className={`mr-5 p-2 border-2 rounded-md ${cellSubtitle===0 ? 'bg-green-700': ''}`}>해당 없음</button>
          <button onClick={() => setCellSubtile(1)} className={`mr-5 p-2 border-2 rounded-md ${cellSubtitle===1 ? 'bg-green-700': ''}`}>소제목도 하나의 셀 안에 있음</button>
          <button onClick={() => setCellSubtile(2)} className={`mr-5 p-2 border-2 rounded-md ${cellSubtitle===2 ? 'bg-green-700': ''}`}>소제목 셀 나눠버림</button>
          </div>
        </div>

        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">의미 상 병합 셀</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setSemanticMergedCell(0)} className={`mr-5 p-2 border-2 rounded-md ${semanticMergedCell===0 ? 'bg-green-700': ''}`}>해당 없음</button>
          <button onClick={() => setSemanticMergedCell(1)} className={`mr-5 p-2 border-2 rounded-md ${semanticMergedCell===1 ? 'bg-green-700': ''}`}>보이는 그대로 빈 칸으로 표현</button>
          <button onClick={() => setSemanticMergedCell(2)} className={`mr-5 p-2 border-2 rounded-md ${semanticMergedCell===2 ? 'bg-green-700': ''}`}>값을 중복되게 채워서 표현</button>
          <button onClick={() => setSemanticMergedCell(3)} className={`mr-5 p-2 border-2 rounded-md ${semanticMergedCell===3 ? 'bg-green-700': ''}`}>병합 셀로 표현</button>
          </div>
        </div>

        <div className='mb-2'>
          <h2 className="mx-5 mb-3 font-bold text-xl">partial lined</h2>
          <div className="mx-5 mb-5">
          <button onClick={() => setPartialLined(0)} className={`mr-5 p-2 border-2 rounded-md ${partialLined===0 ? 'bg-green-700': ''}`}>해당 없음</button>
          <button onClick={() => setPartialLined(1)} className={`mr-5 p-2 border-2 rounded-md ${partialLined===1 ? 'bg-green-700': ''}`}>모두 하나의 셀 안에 있음</button>
          <button onClick={() => setPartialLined(2)} className={`mr-5 p-2 border-2 rounded-md ${partialLined===2 ? 'bg-green-700': ''}`}>셀 나눠버림</button>
          </div>
        </div>
      
      </div>     

      <hr className='border-gray-500'/>

      <div className="m-5 flex justify-center">
          <button className="my-3 p-2 border-2 w-1/3 rounded-md text-2xl hover:bg-green-700">저장</button>
          </div>
    </>
  )
}

export default App
