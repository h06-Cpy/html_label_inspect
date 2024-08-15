interface BoolTypeQuestionProps {
  questionText: string,
  state: boolean
  setState: (state: boolean) => void,
}

export const BoolTypeQuestion = ({questionText, state, setState}: BoolTypeQuestionProps) => {

    return <div className='mb-2'>
    <h2 className="mx-5 mb-3 font-bold text-xl">{questionText}</h2>
    <div className="mx-5 mb-5">
    <button onClick={() => setState(true)} className={`m-2 p-2 border-2 rounded-md ${state===true ? 'bg-green-700': ''}`}>네</button>
    <button onClick={() => setState(false)} className={`m-2 p-2 border-2 rounded-md ${state===false ? 'bg-green-700': ''}`}>아니오</button>
    </div>      
  </div>
}