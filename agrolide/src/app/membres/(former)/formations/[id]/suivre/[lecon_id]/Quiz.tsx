"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export function Quiz({ 
  questions,
  formationId,
  leconId,
  isCompleted 
}: { 
  questions: Question[];
  formationId: string;
  leconId: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setHasSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setIsFinished(true);
      // Validate lesson if not already validated
      if (!isCompleted && formationId && leconId) {
        setIsSubmittingCompletion(true);
        try {
          const res = await fetch(`/api/formations/${formationId}/lecons/${leconId}/complete`, {
            method: 'POST',
          });
          if (res.ok) {
            router.refresh();
          }
        } catch (error) {
          console.error("Failed to complete lesson", error);
        } finally {
          setIsSubmittingCompletion(false);
        }
      }
    }
  };

  if (isFinished) {
    return (
      <div className="bg-surface-container-low p-10 rounded-xl text-center space-y-4 border border-outline-variant">
        <h3 className="text-2xl font-bold">Quiz terminé !</h3>
        <p className="text-muted-foreground">
          Vous avez obtenu {score} sur {questions.length} bonnes réponses.
        </p>
        <div className="pt-4 space-y-4">
          {isSubmittingCompletion && (
            <p className="text-on-tertiary-container font-urbanist font-medium flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validation de la leçon en cours...
            </p>
          )}
          {isCompleted && !isSubmittingCompletion && (
            <p className="text-primary font-urbanist font-bold flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
              Leçon validée avec succès ! Vous pouvez passer à la suite.
            </p>
          )}
          <button onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setHasSubmitted(false);
            setScore(0);
            setIsFinished(false);
          }} className="inline-flex items-center justify-center bg-transparent border-[1.5px] border-outline-variant hover:border-primary hover:bg-primary-container text-on-surface font-urbanist font-semibold text-body-md px-[28px] min-h-[48px] rounded-lg transition-all">
            Recommencer le quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-none">
      <div className="bg-surface-container-low p-5 border-b border-outline-variant flex justify-between items-center text-sm font-urbanist font-semibold text-on-surface-variant uppercase tracking-wide">
        <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
        <span className="text-primary">Score: {score}</span>
      </div>
      
      <div className="p-8 md:p-10 space-y-8">
        <h3 className="text-xl font-urbanist font-semibold text-on-surface">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            
            let buttonClass = "w-full justify-start text-left h-auto whitespace-normal py-4 px-6 text-base border-2 font-urbanist rounded-xl transition-all";
            
            if (!hasSubmitted) {
              buttonClass = cn(buttonClass, isSelected ? "border-accent-leaf bg-primary-container" : "border-outline-variant hover:border-primary hover:bg-surface-container-low bg-surface-container-lowest");
            } else {
              if (isCorrect) {
                buttonClass = cn(buttonClass, "border-accent-leaf bg-success-container text-primary");
              } else if (isSelected && !isCorrect) {
                buttonClass = cn(buttonClass, "border-error bg-error-container text-error");
              } else {
                buttonClass = cn(buttonClass, "border-outline-variant opacity-60 bg-surface-container-lowest");
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
                    hasSubmitted && isCorrect ? "border-accent-leaf bg-accent-leaf text-on-accent" : 
                    hasSubmitted && isSelected && !isCorrect ? "border-error bg-error text-on-error" :
                    isSelected ? "border-accent-leaf bg-accent-leaf text-on-accent" : "border-outline text-on-surface-muted"
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

        <div className="pt-6 flex justify-end border-t border-outline-variant mt-10">
          {!hasSubmitted ? (
            <button 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
              className="inline-flex items-center justify-center bg-tertiary hover:bg-accent-sun disabled:bg-surface-container disabled:text-on-surface/38 disabled:cursor-not-allowed text-on-tertiary font-urbanist font-bold text-body-md px-[28px] min-h-[48px] rounded-lg transition-colors"
            >
              Valider la réponse
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-on-primary font-urbanist font-bold text-body-md px-[28px] min-h-[48px] rounded-lg transition-colors"
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
