'use client';

import { FC } from 'react'
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

interface SignOutProps {

}

const SignOut: FC<SignOutProps> = ({ }) => {
    return (

        <Button onClick={() => {
            signOut();
        }}>
            Sign out
        </Button>

    )
}

export default SignOut
