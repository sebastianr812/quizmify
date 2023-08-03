'use client';

import { User } from 'next-auth'
import { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Home, HomeIcon, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'image' | 'email'>;
}

const UserAccountNav: FC<UserAccountNavProps> = ({
    user
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {/* user avatar */}
                <UserAvatar user={{
                    name: user.name,
                    image: user.image
                }} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white' align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                        {user.name && <p className='font-medium'>{user.name}</p>}
                        {user.email && <p className='w-[200px] text-sm truncate text-zinc-700'>{user.email}</p>}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/'>
                        <Home className='w-4 h-4 mr-2' />
                        Home
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='text-red-600 cursor-pointer'
                    onClick={(e) => {
                        e.preventDefault();
                        signOut().catch(console.error)
                    }}>
                    <LogOut className='w-4 h-4 mr-2' />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav