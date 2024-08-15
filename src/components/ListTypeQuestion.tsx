interface ListTypeQuestionProps {
  questionText: string
  answerList: string[]
  state: Set<number>
  setState: (state: Set<number>) => void
}

export const ListTypeQuestion = ({questionText, answerList, state, setState}: ListTypeQuestionProps) => {

  const toggleState = (index: number) => {
    const newState = new Set(state);

    if (newState.has(index)) newState.delete(index)
    else newState.add(index)

    setState(newState)
  }

    return <div className='mb-2'>
    <h2 className="mx-5 mb-3 font-bold text-xl">{questionText}</h2>
    <div className="mx-5 mb-5">
    {answerList.map((answerText, index) => {
      return <button onClick={() => toggleState(index)} className={`m-2 p-2 border-2 rounded-md ${state.has(index) ? 'bg-green-700': ''}`}>
        {answerText}
      </button>
    })}
    </div>      
  </div>
  
}