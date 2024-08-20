import React, {  useState, useRef, useEffect } from 'react'
import Editor, {  OnChange } from '@monaco-editor/react';
import { getLabelInfo, saveLabel } from './api';
import html2canvas from 'html2canvas';

function App() {
  const [originId, setOriginId] = useState(0)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [totalGeneratedNum, setTotalGeneratedNum] = useState(0)

  const [previewb64, setPreviewb64] = useState('')
  const previewImageRef = useRef<HTMLImageElement>(null);
  
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

  const [divHeight, setDivHeight] = useState('100')
  const [divWidth, setDivWidth] = useState('50')
  const [divPadding, setDivPadding] = useState(1)


  useEffect(() => {
    // 브라우저 성능을 위한 debouncing
    const handler = setTimeout(showPreviewImage, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [divHeight, divWidth, divPadding])


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

  const [tableFont, setTableFont] = useState('')
  const [tableFontSize, setTableFontSize] = useState(1)
  const [tableFontWeight, setTableFontWeight] = useState('normal')

  const applyStyleToHtml = (html: string) => {
    return html
        .replace(
            /<table\s*(border="1" cellspacing="0")?[^>]*>/g,
            `<table $1 style="height: ${tableHeight}vh; width: ${tableWidth}vw; border: ${tableBorder}px solid black; font-family: ${tableFont}; font-size: ${tableFontSize}em; font-weight: ${tableFontWeight}">`
        )
        .replace(
            /<th\s*(rowspan="\d+")?\s*(colspan="\d+")?[^>]*>/g,
            `<th $1 $2 style="border: ${tableBorder}px solid black; padding: ${tdPadding}em;">`
        )
        .replace(
            /<td\s*(rowspan="\d+")?\s*(colspan="\d+")?[^>]*>/g,
            `<td $1 $2 style="border: ${tableBorder}px solid black; padding: ${tdPadding}em;">`
        );
};


  useEffect(() => {
    setHtml(applyStyleToHtml(html))
  }, [tdPadding, tableHeight, tableWidth, tableBorder, tableFont, tableFontSize, tableFontWeight])

  const [isInspected, setIsInspected] = useState(false)
  

  const fillLabelInfo = async (originId: number) => {
    const response = await getLabelInfo(originId)

  
      setIsInspected(response.isInspected)

      setHtml(applyStyleToHtml(response.originHtml))
      // setImageName(response.imageName)

      // if (originImgRef.current) {
      //   originImgRef.current.src = `data:image/png;base64,${response.originImage}`;
      // }

      setTotalGeneratedNum(response.totalGeneratedNum)

  }

  const initializeStates = () => {
    setSaveSuccess(false)
    setDivHeight('100')
    setDivWidth('50')
    setDivPadding(1)
    
    setTableFontWeight('normal')
    setTableFont('')
    setTableFontSize(1)
    setTableHeight('')
    setTableWidth('')
    setTableBorder(1)
    setTdPadding(0.5)
  }

  return (
    <>
      <div className="flex justify-between">

      <h1 className='m-5 text-3xl font-bold'>HTML Label Inspection</h1>
      <h1 className="m-5 text-3xl font-bold">{totalGeneratedNum}개 이미지 생성</h1>
      </div>


      {/* html label 찾기 */}
      <div className="flex justify-center items-center mb-5">

        <button onClick={async () => {
          if (originId-1 >= 0){
            await fillLabelInfo(originId-1)
            setOriginId(originId-1)
            initializeStates()
          }
        }} className='p-2 border-2 rounded-md hover:bg-green-700'>이전</button>

        <input type="number" name='label-id' placeholder='label id 입력' className={`mx-5 p-2 border-2 rounded-md text-white bg-black ${isInspected ? 'border-green-400' : 'border-red-400'}`}
              value={originId}
              onChange={(event) => setOriginId(parseInt(event.target.value))}
              onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {if (event.key==='Enter') {
                initializeStates()
                fillLabelInfo(originId)
              }}}
                />

        <button onClick={ async () => {
          if (originId+1 < 1200)
            await fillLabelInfo(originId+1)
            setOriginId(originId+1)
          }
        } className='p-2 border-2 rounded-md hover:bg-green-700'>다음</button>
 
      </div>

      <hr className='border-gray-500'/>

      {/* 2 column */}
      <div className='my-5 flex flex-row w-full h-1/3'>

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
    
        <div className='my-3 grid grid-cols-2'>
          {/* div 조절 */}
          <div className="mx-5 grid grid-rows-6 gap-3">
            
            <div>
            <label htmlFor="div-height" className='mr-5'>div 높이</label>
            <input name='div-height' type="number" className='p-2 bg-black text-white' value={divHeight} onChange={(event) => setDivHeight(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="div-width" className='mr-5'>div 너비</label>
            <input name='div-width' type="number" value={divWidth} className='p-2 bg-black text-white' onChange={(event) => setDivWidth(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="div-padding" className='mr-5'>div 패딩</label>
            <input name='div-padding' type="number" value={divPadding} step={0.5} className='p-2 bg-black text-white' onChange={(event) => setDivPadding(parseFloat(event.target.value))}/>
            </div>

            <div>
            <label htmlFor="font-weight" className='mr-5'>폰트 굵기</label>
            <select name="font-weight" id="font-weight" className='rounded-md p-2 bg-black text-white' onChange={(event) => setTableFontWeight(event.target.value)}>
              <option value="normal" selected>normal</option>
              <option value="bold">bold</option>
            </select>
            </div>

            <div>
            <label htmlFor="fonts" className='mr-5'>폰트 종류</label>
            <select name="fonts" id="fonts" className='rounded-md p-2 bg-black text-white' onChange={(event) => setTableFont(event.target.value)}>
              <option value="" selected>기본</option>
              <option value="serif">serif</option>
              <option value="monospace">mono</option>
              <option value="cursive">cursive</option>
              <option value="fantasy">fantasy</option>
            </select>
            </div>

            <div>
            <label htmlFor="font-size" className='mr-5'>폰트 크기</label>
            <input name='font-size' type="number" className='p-2 bg-black text-white' step={0.5} value={tableFontSize} onChange={(event) => setTableFontSize(parseFloat(event.target.value))}/>
            </div>
          </div>

          {/* table 조절 */}
          <div className="mx-5 grid grid-rows-4 gap-3">
            
            <div>
            <label htmlFor="table-height" className='mr-5'>table 높이</label>
            <input name='table-height' type="number" className='p-2 bg-black text-white' value={tableHeight} onChange={(event) => setTableHeight(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="table-width" className='mr-5'>table 너비</label>
            <input name='table-width' type="number" value={tableWidth} className='p-2 bg-black text-white' onChange={(event) => setTableWidth(event.target.value)}/>
            </div>

            <div>
            <label htmlFor="td-padding" className='mr-5'>table border</label>
            <input name='td-padding' type="number" value={tableBorder} className='p-2 bg-black text-white' step={0.5} min={0} onChange={(event) => setTableBorder(parseFloat(event.target.value))}/>
            </div>

            <div>
            <label htmlFor="td-padding" className='mr-5'>td 패딩</label>
            <input name='td-padding' type="number" value={tdPadding} className='p-2 bg-black text-white' step={0.5} min={0} onChange={(event) => setTdPadding(parseFloat(event.target.value))}/>
            </div>
          </div>
        
        </div>

      </div>
   
        {/* 오른쪽 */}
        <div className="w-1/2 mx-1 py-5 grid grid-rows-2 gap-2">
          {/* 렌더링된 html 테이블 */}
          <div id='rendered-table' 
          style={{height: `${divHeight}vh`, width: `${divWidth}vw`, padding: `${divPadding}em`}}
          className={`w-${divWidth} h-${divHeight} bg-white text-black flex justify-center items-center p-${divPadding}`}
          dangerouslySetInnerHTML={{__html: html}} />

          {/* 저장될 이미지 프리뷰 */}
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
      <div className="m-5 flex justify-center items-center gap-3">
      <button onClick={async () => {
          if (originId-1 >= 0){
            initializeStates()
            await fillLabelInfo(originId-1)
            setOriginId(originId-1)
          }
        }} className='p-2 border-2 rounded-md hover:bg-green-700'>이전</button>

         <button className={`my-3 p-2 border-2 w-1/3 rounded-md text-2xl hover:bg-green-700 ${saveSuccess ? 'border-green-600': ''}"`}
            onClick={async () => {
              const response = await saveLabel(originId, html.replace(/ *(style|class)="(.*?)"/g, ''), previewb64)
              if(!response.success) {
                 setSaveSuccess(true)             
              }

            }}
            >저장</button>

        <button onClick={ async () => {
          if (originId+1 < 1200)
            initializeStates()
            await fillLabelInfo(originId+1)
            setOriginId(originId+1)
          }
        } className='p-2 border-2 rounded-md hover:bg-green-700'>다음</button>

         
      </div>
    
    </>
  )
}


export default App
