"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export function Quiz({ questions }: { questions: Question[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setHasSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-[#f8f8f6] p-10 rounded-xl text-center space-y-4 border border-[#e8e8e4]">
        <h3 className="text-2xl font-bold">Quiz terminé !</h3>
        <p className="text-muted-foreground">
          Vous avez obtenu {score} sur {questions.length} bonnes réponses.
        </p>
        <div className="pt-4">
          <button onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setHasSubmitted(false);
            setScore(0);
            setIsFinished(false);
          }} className="inline-flex items-center justify-center bg-transparent border-[1.5px] border-[#e8e8e4] hover:border-[#1b5e38] hover:bg-[#f0f7f0] text-[#1a1a1a] font-urbanist font-[600] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-all">
            Recommencer le quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden shadow-none">
      <div className="bg-[#f8f8f6] p-5 border-b border-[#e8e8e4] flex justify-between items-center text-sm font-urbanist font-semibold text-[#4a4a4a] uppercase tracking-wide">
        <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
        <span className="text-[#1b5e38]">Score: {score}</span>
      </div>
      
      <div className="p-8 md:p-10 space-y-8">
        <h3 className="text-xl font-urbanist font-semibold text-[#1a1a1a]">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            
            let buttonClass = "w-full justify-start text-left h-auto whitespace-normal py-4 px-6 text-base border-2 font-urbanist rounded-xl transition-all";
            
            if (!hasSubmitted) {
              buttonClass = cn(buttonClass, isSelected ? "border-[#50a853] bg-[#f0f7f0]" : "border-[#e8e8e4] hover:border-[#1b5e38] hover:bg-[#f8f8f6] bg-white");
            } else {
              if (isCorrect) {
                buttonClass = cn(buttonClass, "border-[#50a853] bg-[#e8f5e9] text-[#1b5e38]");
              } else if (isSelected && !isCorrect) {
                buttonClass = cn(buttonClass, "border-[#d32f2f] bg-[#fef0f0] text-[#d32f2f]");
              } else {
                buttonClass = cn(buttonClass, "border-[#e8e8e4] opacity-60 bg-white");
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => !hasSubmitted && setSelectedOption(index)}
                disabled={hasSubmitted}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors",
                    hasSubmitted && isCorrect ? "border-[#50a853] bg-[#50a853] text-white" : 
                    hasSubmitted && isSelected && !isCorrect ? "border-[#d32f2f] bg-[#d32f2f] text-white" :
                    isSelected ? "border-[#50a853] bg-[#50a853] text-white" : "border-[#c0c0bc] text-[#9a9a96]"
                  )}>
                    {hasSubmitted && isCorrect ? <CheckCircle2 className="w-4 h-4" /> : 
                     hasSubmitted && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                     <span className="text-xs font-bold">{String.fromCharCode(65 + index)}</span>}
                  </div>
                  <span className="flex-1 font-medium">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-6 flex justify-end border-t border-[#e8e8e4] mt-10">
          {!hasSubmitted ? (
            <button 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
              className="inline-flex items-center justify-center bg-[#f99e1d] hover:bg-[#fcb726] disabled:bg-[#f0f0ee] disabled:text-[#c0c0bc] disabled:cursor-not-allowed text-white font-urbanist font-[700] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-colors"
            >
              Valider la réponse
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="inline-flex items-center justify-center bg-[#1b5e38] hover:bg-[#145030] text-white font-urbanist font-[700] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? "Question suivante" : "Terminer le quiz"}
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
