import * as z from 'zod';

export const quizValidator = z.object({
    topic: z.string().min(4, {
        message: 'Topic must be atleast 4 characters long'
    }).max(50, {
        message: 'Topic must be less than 50 characters long'
    }),
    type: z.enum(['mcq', 'open_ended']),
    amount: z.number().min(1).max(10)
});

export type QuizCreationRequest = z.infer<typeof quizValidator>;

export const CheckAnswerValidator = z.object({
    questionId: z.string(),
    userAnswer: z.string()
});

export type CheckAnswerRequest = z.infer<typeof CheckAnswerValidator>;