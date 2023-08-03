import { User } from 'next-auth'
import { FC } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';

interface UserAvatarProps {
    user: Pick<User, 'image' | 'name'>;
}

const UserAvatar: FC<UserAvatarProps> = ({
    user
}) => {
    return (
        <Avatar>
            {user.image ? (
                <div className='relative w-full h-hull aspect-square'>
                    <Image
                        alt='User avatar'
                        fill
                        src={user.image}
                        referrerPolicy='no-referrer' />
                </div>
            ) : (
                <AvatarFallback>
                    <span className='sr-only'>
                        {user.name}
                    </span>
                </AvatarFallback>
            )
            }
        </Avatar >
    )
}

export default UserAvatar