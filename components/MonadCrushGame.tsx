
'use client';

import React, { useState } from 'react';
import { useFrame } from '@/components/farcaster-provider';
import { SafeAreaContainer } from './safe-area-container';

const questions = [
  {
    id: 1,
    question: "What's one thing you LOVE about Monad?",
    placeholder: "Your response",
    buttonText: "Find My Crush",
  },
  {
  id: 2,
    question: "What's your favorite vibe for a coding session?",
    placeholder: "Chill beats, intense focus, collaborative chaos...",
    buttonText: "Check My Vibe",
  },
  {
    id: 3,
    question: "How do you handle unexpected bugs?",
    placeholder: "Panic, debug calmly, ask for help...",
    buttonText: "Embrace the Chaos",
  },
];

export default function MonadCrushGame() {
  const { context, isLoading, isSDKLoaded } = useFrame();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const handleAnswerSubmit = (answer: string) => {
    setAnswers([...answers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, proceed to matching
      setShowMatchScreen(true);
      // Simulate matching logic
      setTimeout(() => {
        setMatchResult("You both love Monad's parallel execution model. Soulmates.");
      }, 3000);
    }
  };

  const handleMintNft = () => {
    // Logic for minting NFT
    alert("Minting NFT...");
  };

  const handleSendMon = () => {
    // Logic for sending Mon
    alert("Sending Mon to crush...");
  };

  if (isLoading) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
          <h1 className="text-3xl font-bold text-center">Loading...</h1>
        </div>
      </SafeAreaContainer>
    );
  }

  if (!isSDKLoaded) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
          <h1 className="text-3xl font-bold text-center">
            No Farcaster SDK found, please use this miniapp in the Farcaster app
          </h1>
        </div>
      </SafeAreaContainer>
    );
  }

  if (showMatchScreen) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
          {matchResult ? (
            <>
              <h1 className="text-3xl font-bold text-center">Match Found!</h1>
              <p className="text-xl text-center">{matchResult}</p>
              <div className="flex space-x-4">
                <button onClick={handleMintNft} className="bg-purple-500 text-white px-4 py-2 rounded">
                  Mint NFT
                </button>
                <button onClick={handleSendMon} className="bg-purple-500 text-white px-4 py-2 rounded">
                  Send Mon to Crush
                </button>
              </div>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-center">Finding your match...</h1>
          )}
        </div>
      </SafeAreaContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
        <h1 className="text-3xl font-bold text-center">{currentQuestion.question}</h1>
        <input
          type="text"
          placeholder={currentQuestion.placeholder}
          className="w-full max-w-md p-2 border border-gray-300 rounded text-black"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAnswerSubmit(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <button
          onClick={() => {
            const inputElement = document.querySelector('input');
            if (inputElement) {
              handleAnswerSubmit(inputElement.value);
              inputElement.value = '';
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {currentQuestion.buttonText}
        </button>
      </div>
    </SafeAreaContainer>
  );
}


