import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextauth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation';

interface pageProps {

}

export const metadata: Metadata = {
    title: 'Quiz | Quizmify'
}

const page = async () => {

    const session = await getAuthSession();

    if (!session?.user) {
        redirect('/');
    }
    return (
        <QuizCreation />
    )
}

export default page