'use client';

import { Game, Question } from '@prisma/client'
import { ChevronRight, Timer } from 'lucide-react'
import { FC, useCallback, useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import { CheckAnswerRequest } from '@/lib/validators/form/quiz';
import axios from 'axios';

interface MCQProps {
    game: Game & {
        questions: Pick<Question, 'id' | 'option' | 'question'>[]
    }
}

const MCQ: FC<MCQProps> = ({
    game
}) => {
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [selectedChoice, setSelectedChoice] = useState<number>(0);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [wrongAnswers, setWrongAnswers] = useState<number>(0);

    const currentQuestion = useMemo(() => {
        return game.questions[questionIndex];
    }, [questionIndex, game.questions])

    const options = useMemo(() => {
        if (!currentQuestion) {
            return [];
        }
        if (!currentQuestion.option) {
            return [];
        }
        return JSON.parse(currentQuestion.option as string) as string[];
    }, [currentQuestion]);

    const {
        mutate: checkAnswer,
        isLoading: isChecking
    } = useMutation({
        mutationFn: async () => {
            const payload: CheckAnswerRequest = {
                questionId: currentQuestion.id,
                userAnswer: options[selectedChoice]
            };
            const { data } = await axios.post('/api/checkAnswer', payload)
            return data;
        },
        onSuccess: ({ isCorrect }) => {
            if (isCorrect) {
                return setCorrectAnswers((prev) => prev + 1);
            }
            return setWrongAnswers((prev) => prev + 1);
        }
        // TODO: toast notification
    });

    const handleNext = useCallback(() => {
        checkAnswer();
    }, []);

    return (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]'>
            <div className='flex flex-row justify-between'>
                <div className="flex flex-col">
                    {/* Topic name */}
                    <p>
                        <span className='mr-2 text-slate-400'>
                            Topic
                        </span>
                        <span className='px-2 py-1 text-white rounded-lg bg-slate-800'>
                            {game.topic}
                        </span>
                    </p>
                    <div className='flex self-start mt-3 text-slate-400'>
                        <Timer className='mr-2' />
                        <span>00:00</span>
                    </div>
                </div>
                <MCQCounter correctAnswersCount={3} wrongAnswersCount={4} />
            </div>
            {/* questions and answers */}
            <Card className='w-full mt-4'>
                <CardHeader className='flex flex-row items-center'>
                    <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
                        <div>
                            {questionIndex + 1}
                        </div>
                        <div className='text-base text-slate-400'>
                            {game.questions.length}
                        </div>
                    </CardTitle>
                    <CardDescription className='flex-grow text-lg'>
                        {currentQuestion.question}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className='flex flex-col items-center justify-center w-full mt-4'>
                {/* Question options */}
                {options.map((opt, index) => (
                    <Button
                        key={index}
                        variant={selectedChoice === index ? 'default' : 'secondary'}
                        onClick={() => {
                            setSelectedChoice(index);
                        }}
                        className='justify-start w-full py-8 mb-4'>
                        <div className='flex items-center justify-start'>
                            <div className='p-2 px-3 mr-5 border rounded-md'>
                                {index + 1}
                            </div>
                            <div className='text-start'>
                                {opt}
                            </div>
                        </div>
                    </Button>
                ))}
                <Button
                    className='mt-2'>
                    Next
                    <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
            </div>
        </div>
    )
}

export default MCQ