'use client';

import { FC } from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react';

interface SignInProps {
    text: string;
}

const SignIn: FC<SignInProps> = ({
    text
}) => {
    const signInWithGoogle = () => {
        signIn('google')

    }
    return (
        <Button onClick={signInWithGoogle}>
            {text}
        </Button>
    )
}

export default SignIn