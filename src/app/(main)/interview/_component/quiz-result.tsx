import { questionResultsType } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Assessment } from "@prisma/client";

import { CheckCircle2, Trophy, XCircle } from "lucide-react";

interface propsType {
  result: Assessment;
  onStartNew: () => void;
  hideStartNew?:boolean
}
export default function QuizResult({ result, onStartNew ,hideStartNew}: propsType) {
  if (!result) return null;
  

const questions: questionResultsType[] = result.questions as unknown as questionResultsType[]; //Doube type assertion as result.questions is a JsonValue[]

const getColorAccToScore = (score: number) => {
  if (score <= 30) return "[&>div]:bg-red-500";
  if (score <= 50) return "[&>div]:bg-orange-400";
  if (score <= 70) return "[&>div]:bg-yellow-400";
  return "[&>div]:bg-green-500";
};


  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className={`w-full ${getColorAccToScore(result.quizScore)} [&>div]:rounded-r-[5px] `}/>
         
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-[8px]">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>
          {questions.map((q, index) => (
            <div key={index} className="border rounded-[8px] p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your answer: {q.userAnswer}</p>
                {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
              </div>
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation:</p>
                <p>{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="mt-4 ">
          <Button onClick={onStartNew} className="w-full cursor-pointer rounded-[8px]">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
