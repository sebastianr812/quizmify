import SignIn from "@/components/SignIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from 'next/navigation';

export default async function Home() {

  const session = await getAuthSession();
  if (session?.user) {
    // user is logged in
    redirect('/dashboard');
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>
            Welcome to Quizmify
          </CardTitle>
          <CardDescription>
            Quizmify is a quiz app that allows you to create and share quizzes with your friends!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn text="Sign In with Google" />
        </CardContent>
      </Card>
    </div>
  )
}
