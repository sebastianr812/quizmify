import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import QuizMeCard from '@/components/dashboard/QuizMeCard';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { getAuthSession } from '@/lib/nextauth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Dashboard | Quizmify',
    description: 'Quiz yourself on anything'
}
const page = async () => {
    const session = await getAuthSession();

    if (!session?.user) {
        redirect('/');
    }
    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center">
                <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 mt-4 md:grid-cols-2">
                <QuizMeCard />
                <HistoryCard />
            </div>
            <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
                <HotTopicsCard />
                <RecentActivities />
            </div>
        </main>
    );
};


export default page