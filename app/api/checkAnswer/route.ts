import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { CheckAnswerValidator } from "@/lib/validators/form/quiz";
import { NextResponse } from "next/server";
import * as z from 'zod';


export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        const body = await req.json();
        const {
            questionId,
            userAnswer
        } = CheckAnswerValidator.parse(body);

        const question = await db.question.findUnique({
            where: {
                id: questionId
            }
        });

        if (!question) {
            return new NextResponse('no question found', { status: 404 });
        }

        await db.question.update({
            where: {
                id: questionId
            },
            data: {
                userAnswer
            }
        });

        if (question.questionType === 'mcq') {
            const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
            await db.question.update({
                where: {
                    id: questionId
                },
                data: {
                    isCorrect
                }
            });
            return NextResponse.json({
                isCorrect
            }, { status: 200 });
        }

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data passed for api', { status: 400 });
        }
        return new NextResponse('internal error POST:checkAnswer', { status: 500 });
    }
}