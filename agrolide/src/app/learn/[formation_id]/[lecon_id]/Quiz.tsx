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
      <div className="bg-muted p-8 rounded-lg text-center space-y-4">
        <h3 className="text-2xl font-bold">Quiz terminé !</h3>
        <p className="text-muted-foreground">
          Vous avez obtenu {score} sur {questions.length} bonnes réponses.
        </p>
        <div className="pt-4">
          <Button onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setHasSubmitted(false);
            setScore(0);
            setIsFinished(false);
          }} variant="outline">
            Recommencer le quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-muted/50 p-4 border-b flex justify-between items-center text-sm font-medium text-muted-foreground">
        <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <div className="p-6 md:p-8 space-y-8">
        <h3 className="text-xl font-medium">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            
            let buttonClass = "w-full justify-start text-left h-auto whitespace-normal py-4 px-6 text-base border-2";
            
            if (!hasSubmitted) {
              buttonClass = cn(buttonClass, isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50");
            } else {
              if (isCorrect) {
                buttonClass = cn(buttonClass, "border-green-500 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-200");
              } else if (isSelected && !isCorrect) {
                buttonClass = cn(buttonClass, "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200");
              } else {
                buttonClass = cn(buttonClass, "border-border opacity-50");
              }
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => !hasSubmitted && setSelectedOption(index)}
                disabled={hasSubmitted}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    hasSubmitted && isCorrect ? "border-green-500 bg-green-500 text-white" : 
                    hasSubmitted && isSelected && !isCorrect ? "border-red-500 bg-red-500 text-white" :
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  )}>
                    {hasSubmitted && isCorrect ? <CheckCircle2 className="w-4 h-4" /> : 
                     hasSubmitted && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                     <span className="text-xs font-bold">{String.fromCharCode(65 + index)}</span>}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="pt-4 flex justify-end border-t mt-8">
          {!hasSubmitted ? (
            <Button onClick={handleSubmit} disabled={selectedOption === null}>
              Valider la réponse
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? "Question suivante" : "Terminer le quiz"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
