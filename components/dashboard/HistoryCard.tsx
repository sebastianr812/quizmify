'use client';

import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

const HistoryCard = () => {

    const router = useRouter();
    return (
        <Card
            className="hover:opacity-75 hover:cursor-pointer"
            onClick={() => router.push('/history')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-2xl font-bold">
                    History
                </CardTitle>
                <History size={28} strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    View past quiz attempts
                </p>
            </CardContent>
        </Card>
    )
}

export default HistoryCard