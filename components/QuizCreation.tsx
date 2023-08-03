'use client';

import { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useForm } from 'react-hook-form'
import { QuizCreationRequest, quizValidator } from '@/lib/validators/form/quiz'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { BookOpen, CopyCheck } from 'lucide-react';
import { Separator } from './ui/separator';
interface QuizCreationProps {

}

const QuizCreation: FC<QuizCreationProps> = ({ }) => {

    const form = useForm<QuizCreationRequest>({
        resolver: zodResolver(quizValidator),
        defaultValues: {
            amount: 3,
            topic: '',
            type: 'mcq'
        }
    });

    function onSubmit(data: QuizCreationRequest) {

    }

    form.watch();

    return (
        <div className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>
                        Quiz Creation
                    </CardTitle>
                    <CardDescription>
                        Choose a topic
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='topic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter a topic...' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please provide a topic
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name='amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={1}
                                                max={10}
                                                placeholder='Enter an amount' {...field}
                                                onChange={(e) => {
                                                    form.setValue('amount', parseInt(e.target.value));
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <div className='flex justify-between'>
                                <Button
                                    type='button'
                                    onClick={() => form.setValue('type', 'mcq')}
                                    className='w-1/2 rounded-none rounded-l-lg'
                                    variant={form.getValues('type') === 'mcq' ? 'default' : 'secondary'}>
                                    <CopyCheck className='w-4 h-4 mr-2' />
                                    Multiple Choice
                                </Button>
                                <Separator orientation='vertical' />
                                <Button
                                    type='button'
                                    className='w-1/2 rounded-none rounded-r-lg'
                                    variant={form.getValues('type') === 'open_ended' ? 'default' : 'secondary'}
                                    onClick={() => form.setValue('type', 'open_ended')}>
                                    <BookOpen className='w-4 h-4 mr-2' />
                                    Open Ended
                                </Button>
                            </div>
                            <Button
                                type='submit'>
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuizCreation