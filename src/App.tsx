import { useEffect, useState } from 'react'
import Editor, { DiffEditor, useMonaco, loader, OnChange } from '@monaco-editor/react';

function App() {
  const [html, setHtml] = useState('')
  const [supsub, setSupsub] = useState(0)
  const [isTh, setIsTh] = useState(0)
  const [cellSubtitle, setCellSubtile] = useState(0)
  // const [isTh, setIsTh] = useState(0)
    

  const handleEditorChange: OnChange = (value, event) => {
    if (value) setHtml(value)
  }


  return (
    <>
      <h1 className='m-5 text-3xl font-bold'>HTML Label Inspection</h1>


        <div className='flex justify-center my-3'>

        <input type="text" name='label-id' placeholder='label id 입력' className="mx-5 mb-5 p-2 border-2 rounded-md" />
       
        <button className='p-2 border-2 h-11 rounded-md hover:bg-green-700'>찾기</button>
        </div>

      <div className="flex justify-center mb-5">

        <div>
          
        <button className='p-2 border-2 rounded-md hover:bg-green-700'>이전</button>
        <input type="text" placeholder='파일 이름' className="p-2 mx-2 border-2 rounded-md" disabled />
        <button className='p-2 border-2 rounded-md hover:bg-green-700'>다음</button>
        </div>
 
      </div>

      <hr className='border-gray-500'/>

      <div className='mt-5 flex flex-row w-full h-full'>
        <div className=' w-1/2 mx-1 border-r-2'>
          <div className="flex flex-row-reverse my-1">
          <button className="mr-5 p-2 border-2 rounded-md hover:bg-green-700">저장</button>
          </div>
        
        <Editor
        // width={'85vh'}
        height={'85vh'}
        theme='vs-dark'
        language='html'
        onChange={handleEditorChange} />

        </div>
        

        <div dangerouslySetInnerHTML={{__html: html}} className='w-1/2 mx-1 py-5 font-medium'/>
      </div>
      
      <h1 className='m-5 font-bold text-3xl'>Check</h1>
      
        <h2 className="mx-5 mb-3 font-bold text-xl">첨자 표현</h2>
        <div className="mx-5 mb-5">
        <button onClick={() => setSupsub(0)} className={`mr-5 p-2 border-2 rounded-md ${supsub==0 ? 'bg-green-700': ''}`}>해당 없음</button>
        <button onClick={() => setSupsub(1)} className={`mr-5 p-2 border-2 rounded-md ${supsub==1 ? 'bg-green-700': ''}`}>유니코드</button>
        <button onClick={() => setSupsub(2)} className={`mr-5 p-2 border-2 rounded-md ${supsub==2 ? 'bg-green-700': ''}`}>Latex</button>
        <button onClick={() => setSupsub(3)} className={`mr-5 p-2 border-2 rounded-md ${supsub==3 ? 'bg-green-700': ''}`}>{'html <sup> <sub>태그'}</button>
        </div>
      

    </>
  )
}

export default App
