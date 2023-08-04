'use client';

import { Game, Question } from '@prisma/client'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { differenceInSeconds } from 'date-fns';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button, buttonVariants } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import { CheckAnswerRequest } from '@/lib/validators/form/quiz';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn, formatTimeDelta } from '@/lib/utils';

interface MCQProps {
    game: Game & {
        questions: Pick<Question, 'id' | 'option' | 'question'>[]
    }
}

const MCQ: FC<MCQProps> = ({
    game
}) => {

    const router = useRouter();
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [selectedChoice, setSelectedChoice] = useState<number>(0);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [wrongAnswers, setWrongAnswers] = useState<number>(0);
    const [hasEnded, setHasEnded] = useState<boolean>(false);
    const [now, setNow] = useState(new Date());
    const { toast } = useToast();


    useEffect(() => {
        const interval = setInterval(() => {
            if (!hasEnded) {
                setNow(new Date());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [hasEnded]);

    // errors are getting thrown, need to investigate!

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

    });

    const handleNext = useCallback(() => {
        checkAnswer(undefined, {
            onSuccess: ({ isCorrect }) => {
                if (isCorrect) {
                    toast({
                        title: 'Correct!',
                        description: 'Good job!',
                        variant: 'success'
                    })
                    setCorrectAnswers((prev) => prev + 1);

                } else {
                    toast({
                        title: 'Incorrect!',
                        description: 'Wrong answer :(',
                        variant: 'destructive'
                    })
                    setWrongAnswers((prev) => prev + 1);
                }
                if (questionIndex === game.questions.length - 1) {
                    setHasEnded(true);
                    return;
                }
                setQuestionIndex(((prev) => prev + 1));
            }
        });
    }, [checkAnswer, questionIndex, game.questions.length, toast]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == '1') {
                setSelectedChoice(0);
            } else if (e.key == '2') {
                setSelectedChoice(1);
            } else if (e.key == '3') {
                setSelectedChoice(2);
            } else if (e.key == '4') {
                setSelectedChoice(3);
            } else if (e.key == 'Enter') {
                handleNext();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleNext]);

    if (hasEnded) {
        return (
            <div className='absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
                <div className='px-4 mt-2 font-semibold text-white bg-green-500 rounded-lg whitespace-nowrap'>
                    You completed in {' '}
                    {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                </div>
                <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), 'mt-2')}>
                    View Statistics
                    <BarChart className='w-4 h-4 ml-2' />
                </Link>
            </div>
        )
    }

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
                        {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                    </div>
                </div>
                <MCQCounter correctAnswersCount={correctAnswers} wrongAnswersCount={wrongAnswers} />
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
                    disabled={isChecking}
                    onClick={() => handleNext()}
                    className='mt-2'>
                    {isChecking && (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    )}
                    Next
                    <ChevronRight className='w-4 h-4 ml-2' />
                </Button>
            </div>
        </div>
    )
}

export default MCQ