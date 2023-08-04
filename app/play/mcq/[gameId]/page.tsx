import { getAuthSession } from '@/lib/nextauth';
import { FC } from 'react'
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import MCQ from '@/components/MCQ';

interface pageProps {
    params: {
        gameId: string;
    }
}

const page: FC<pageProps> = async ({
    params: {
        gameId
    }
}) => {

    const session = await getAuthSession();
    if (!session?.user) {
        redirect('/')
    }

    const game = await db.game.findUnique({
        where: {
            id: gameId
        },
        include: {
            questions: {
                select: {
                    id: true,
                    question: true,
                    option: true,
                }
            }
        }
    });

    if (!game || game.gameType !== 'mcq') {
        return notFound();
    }

    return (
        <MCQ game={game} />
    )
}

export default page