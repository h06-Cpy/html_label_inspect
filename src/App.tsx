import React, {  useState, useRef, useEffect } from 'react'
import Editor, {  OnChange } from '@monaco-editor/react';
import { getLabelInfo, saveLabel } from './api';
import html2canvas from 'html2canvas';

function App() {
  const [labelId, setLabelId] = useState(0)
  const [imageName, setImageName] = useState('')
  const [previewb64, setPreviewb64] = useState('')
  const previewImageRef = useRef<HTMLImageElement>(null);
  const originImgRef = useRef<HTMLImageElement>(null);
  
  const [html, setHtml] = useState('') // 사용자가 입력하는 html

  const handleEditorChange: OnChange = (value) => {
    if (value) setHtml(value)

    else setHtml('') 
  }
  
  useEffect(() => { 

    // 브라우저 성능을 위한 debouncing
    const handler = setTimeout(showPreviewImage, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [html])

  const [divHeight, setDivHeight] = useState('fit')
  const [divWidth, setDivWidth] = useState('fit')
  const [divPadding, setDivPadding] = useState(2)
  const [divFont, setDivFont] = useState('')
  const [divFontSize, setDivFontSize] = useState('')
  const [divFontWeight, setDivFontWeight] = useState('')

  useEffect(() => {
    showPreviewImage();
  }, [divHeight, divWidth, divFont, divFontSize, divFontWeight, divPadding])


  const showPreviewImage = async () => {
    const renderedTableDOM = document.querySelector("#rendered-table") as HTMLElement | null

    if (renderedTableDOM) {
      const canvas = await html2canvas(renderedTableDOM)
      const imageFile = canvas.toDataURL("image/png", 2)

      if (previewImageRef.current) {
        previewImageRef.current.src = imageFile
        setPreviewb64(imageFile);
      }
    } 
  }

  const [tdPadding, setTdPadding] = useState(0)
  const [tableHeight, setTableHeight] = useState('')
  const [tableWidth, setTableWidth] = useState('')
  const [tableBorder, setTableBorder] = useState(1)

  const applyStyleToHtml = (html: string) => {
    return html.replace(/<table(.*?)>/g, `<table style="height: ${tableHeight}vh; width: ${tableWidth}vw; border: ${tableBorder}px solid black;">`)
                           .replace(/<th(.*?)>/g, `<th style="border: ${tableBorder}px solid black; padding: ${tdPadding}em;">`)
                           .replace(/<td(.*?)>/g, `<td style="border: ${tableBorder}px solid black; padding: ${tdPadding}em;">`)
  }

  useEffect(() => {
    setHtml(applyStyleToHtml(html))
  }, [tdPadding, tableHeight, tableWidth, tableBorder])

  const [isInspected, setIsInspected] = useState(false)
  

  const fillLabelInfo = async (labelId: number) => {
    const response = await getLabelInfo(labelId)

    if (response.inspected) { // 검수한 경우 해당 레이블 정보 제공
        setIsInspected(true)

        setHtml(response.html)
        setImageName(response.imageName)

        if (originImgRef.current) {
          originImgRef.current.src = `data:image/png;base64,${response.originImage}`;
        }

    } else { // 검수 안 한 경우 레이블 html 제공
        setIsInspected(false)

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
      onChange={(event) => setLabelId(parseInt(event.target.value))}
      onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {if (event.key==='Enter') fillLabelInfo(labelId)}}
        />
      
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
        <input type="text" placeholder='파일 이름' className={`p-2 mx-2 border-2 rounded-md ${isInspected ? 'text-green-400' : 'text-red-400'}`} value={imageName}  disabled />
        <button onClick={ async () => {
          if (labelId+1 < 1200){
            await fillLabelInfo(labelId+1)
            setLabelId(labelId+1)
          }
        }} className='p-2 border-2 rounded-md hover:bg-green-700'>다음</button>
 
      </div>

      <hr className='border-gray-500'/>

      {/* 2 column */}
      <div className='my-5 flex flex-row w-full h-full'>

        {/* 왼쪽 */}
        <div className='w-1/2 mx-1 border-r-2'>
          {/* 에디터 */}
          <Editor
          // width={'85vh'}
          height={'85vh'}
          theme='vs-dark'
          language='html'
          value={html}
          onChange={handleEditorChange} />
    
        <div className='grid grid-cols-2'>
          {/* div 조절 */}
          <div className="mx-5 grid grid-rows-6 gap-3">
            
            <div>
            <label htmlFor="div-height" className='mr-5'>div 높이</label>
            <input name='div-height' type="text" className='p-2' value={divHeight} onChange={(event) => setDivHeight(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="div-width" className='mr-5'>div 너비</label>
            <input name='div-width' type="text" value={divWidth} className='p-2' onChange={(event) => setDivWidth(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="div-padding" className='mr-5'>div 패딩</label>
            <input name='div-padding' type="number" value={divPadding} className='p-2' onChange={(event) => setDivPadding(parseInt(event.target.value))}/>
            </div>

            <div>
            <label htmlFor="font-weight" className='mr-5'>폰트 굵기</label>
            <select name="font-weight" id="font-weight" className='rounded-md p-2' onChange={(event) => setDivFontWeight(event.target.value)}>
              <option value="thin">thin</option>
              <option value="extralight">extralight</option>
              <option value="light">light</option>
              <option value="normal" selected>normal</option>
              <option value="medium">medium</option>
              <option value="semibold">semibold</option>
              <option value="bold">bold</option>
              <option value="extrabold">extrabold</option>
              <option value="black">black</option>
            </select>
            </div>

            <div>
            <label htmlFor="fonts" className='mr-5'>폰트 종류</label>
            <select name="fonts" id="fonts" className='rounded-md p-2' onChange={(event) => setDivFont(event.target.value)}>
              <option value="sans">sans</option>
              <option value="serif">serif</option>
              <option value="mono" selected>mono</option>
    
            </select>
            </div>

            <div>
            <label htmlFor="font-size" className='mr-5'>폰트 크기</label>
            <select name="font-size" id="font-size" className='rounded-md p-2' onChange={(event) => setDivFontSize(event.target.value)}>
              <option value="xs">xs</option>
              <option value="sm">sm</option>
              <option value="base" selected>base</option>
              <option value="lg">lg</option>
              <option value="xl">xl</option>
              <option value="2xl">2xl</option>
              <option value="3xl">3xl</option>
              <option value="4xl">4xl</option>
              <option value="5xl">5xl</option>
              <option value="6xl">6xl</option>
            </select>
            </div>
          </div>

          {/* table 조절 */}
          <div className="mx-5 grid grid-rows-4 gap-3">
            
            <div>
            <label htmlFor="table-height" className='mr-5'>table 높이</label>
            <input name='table-height' type="number" className='p-2' value={tableHeight} onChange={(event) => setTableHeight(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="table-width" className='mr-5'>table 너비</label>
            <input name='table-width' type="number" value={tableWidth} className='p-2' onChange={(event) => setTableWidth(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="td-padding" className='mr-5'>table border</label>
            <input name='td-padding' type="number" value={tableBorder} className='p-2' step={0.5} min={0} onChange={(event) => setTableBorder(parseFloat(event.target.value))}/>
            </div>

            <div>
            <label htmlFor="td-padding" className='mr-5'>td 패딩</label>
            <input name='td-padding' type="number" value={tdPadding} className='p-2' step={0.5} min={0} onChange={(event) => setTdPadding(parseFloat(event.target.value))}/>
            </div>
          </div>
        
        </div>

      </div>
   
        {/* 오른쪽 */}
        <div className="w-1/2 mx-1 py-5 grid grid-rows-2 gap-2">
          {/* 렌더링된 html 테이블 */}
          <div id='rendered-table' className={`w-${divHeight} h-${divWidth} bg-white text-black flex justify-center items-center 
          p-${divPadding} font-${divFont} font-${divFontWeight} text-${divFontSize}`}
          dangerouslySetInnerHTML={{__html: html}} />

          {/* 렌더링된 이미지 프리뷰 */}
          <div className="rendered-table-preview">
            <img ref={previewImageRef} src="" alt="preview" />
          </div>

          {/* 원본 이미지 */}
          {/* <div>
            <img ref={originImgRef} src="" alt="원본 이미지" />
          </div> */}
        </div>
        
        </div>

      

      {/* 저장 버튼 */}
      <div className="m-5 flex justify-center">
          <button className="my-3 p-2 border-2 w-1/3 rounded-md text-2xl hover:bg-green-700"
            onClick={async () => {
              const renderedTableDOM = document.querySelector<HTMLElement>("#rendered-table")
              if (renderedTableDOM) {
                const canvas = await html2canvas(renderedTableDOM)
                const imageFile = canvas.toDataURL("image/png", 1.5);
                console.log(canvas)
                console.log(imageFile)
              }
            }}
            >저장</button>
      </div>
    
    </>
  )
}


export default App
