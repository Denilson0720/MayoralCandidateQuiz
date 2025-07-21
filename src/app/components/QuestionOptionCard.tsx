interface QuestionOptoinCardProps{
    handleSelection:()=>{};
    index:number;
    selectedAnswer?:number;
    
}
export default function QuestionOptionCard(
    handleSelection,
){
    return(
        <button
        key={index}
        onClick={() => onAnswerSelect(index)}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
          selectedAnswer === index
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span>{letters[index]}</span>
        <span className="font-medium">{option}</span>
      </button>
    )
}