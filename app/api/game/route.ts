import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { QuizCreationRequest, quizValidator } from "@/lib/validators/form/quiz";
import { NextResponse } from "next/server";
import * as z from 'zod';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        const body = await req.json();

        const {
            amount,
            topic,
            type
        } = quizValidator.parse(body)

        const game = await db.game.create({
            data: {
                gameType: type,
                timeStarted: new Date(),
                userId: session.user.id,
                topic,

            }
        });

        const payload: QuizCreationRequest = {
            amount,
            topic,
            type
        }

        const { data } = await axios.post(`${process.env.API_URL as string}/api/questions`, payload);
        if (type === 'mcq') {
            type mcqQuestion = {
                question: string;
                answer: string;
                option1: string;
                option2: string;
                option3: string;
            }
            let manyData = data.questions.map((question: mcqQuestion) => {
                let options = [question.answer, question.option1, question.option2, question.option3];
                options = options.sort(() => Math.random() - 0.5);

                return {
                    question: question.question,
                    answer: question.answer,
                    option: JSON.stringify(options),
                    gameId: game.id,
                    questionType: 'mcq'
                }
            });
            await db.question.createMany({
                data: manyData
            })
        } else if (type === 'open_ended') {
            type openEndedQuestion = {
                question: string;
                answer: string;
            }
            let manyData = data.questions.map((question: openEndedQuestion) => {
                return {
                    question: question.question,
                    answer: question.answer,
                    gameId: game.id,
                    questionType: 'open_ended'
                };
            });

            await db.question.createMany({
                data: manyData
            });
        }
        return NextResponse.json({
            gameId: game.id
        }, { status: 200 });

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed in for request', { status: 400 });
        }
        return new NextResponse('internal error POST:game', { status: 500 });
    }
}