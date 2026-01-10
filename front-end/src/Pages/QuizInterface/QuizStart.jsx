import React, { useState } from "react";
import QuizInterface from "./QuizInterface";
import Button from "../../components/Shared/Button";
import material from "../../assets/images/icon/material.png";
import { ScrollRestoration } from "react-router-dom";
export default function QuizStart() {
  const [startQuiz, setStartQuiz] = useState(false);

  const handleStartQuiz = () => {
    setStartQuiz(true);
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <ScrollRestoration />
      {startQuiz ? (
        <QuizInterface />
      ) : (
        <div className="bg-gray-50 flex flex-col gap-20 items-center justify-center p-6">
          <p className="text-[#011E46] font-bold md:text-xl text-center">
            Start your exam now and test your knowledge in real time.
          </p>
          <div onClick={handleStartQuiz}>
            <Button padding="py-2 px-4" rounded="md">
              <span className="flex items-center md:text-xl gap-2">
                <img className="md:h-8 h-6" src={material} />
                Start Exam
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
