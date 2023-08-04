import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { quizValidator } from "@/lib/validators/form/quiz";
import { NextResponse } from "next/server";
import * as z from 'zod';

export async function POST(req: Request) {
    try {
        // const session = await getAuthSession();

        // if (!session?.user) {
        //     return new NextResponse('unathorized', { status: 401 });
        // }

        const body = await req.json();

        const {
            amount,
            topic,
            type
        } = quizValidator.parse(body);
        let questions: any;

        if (type === 'open_ended') {
            questions = await strict_output(
                'You are a helpful AI that is able to generate a pair of questions and answers, the length of the answer should not exceed 15 words, store all of the pairs of questions and answers in a JSON array',
                new Array(amount).fill(
                    `You are to generate a random hard open-ended question about the ${topic}`,
                ),
                {
                    question: 'question',
                    answer: 'answer with max length of 15 words'
                }
            );
        } else if (type === 'mcq') {
            questions = await strict_output(
                'You are a helpful AI that is able to generate multiple choice questions and answers, the length of each answer should not exceed 15 words',
                new Array(amount).fill(
                    `You are to generate a random multiple choice question about the ${topic}`
                ),
                {
                    question: 'question',
                    answer: 'answer with max length of 15 words',
                    option1: 'First option with max length of 15 words',
                    option2: 'Second option with max length of 15 words',
                    option3: 'Third option with max length of 15 words',
                }
            );
        }

        return NextResponse.json({
            questions
        }, { status: 200 });

    } catch (e) {
        if (e instanceof z.ZodError) {
            return new NextResponse('invalid data for request', { status: 400 });
        }
        return new NextResponse('internal error QUESTIONS:POST', { status: 500 });
    }
}