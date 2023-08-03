'use client';

import { useTheme } from 'next-themes';
import D3WordCloud from 'react-d3-cloud';

const data = [
    {
        text: 'hey',
        value: 3
    },
    {
        text: 'hi',
        value: 5
    },
    {
        text: 'computer',
        value: 10
    },
    {
        text: 'nextjs',
        value: 8
    },
    {
        text: 'live',
        value: 7
    },
];

const fontSizeMapper = (word: { value: number }) => {
    return Math.log2(word.value) * 5 + 16;
}
const CustomWordCloud = () => {
    const theme = useTheme();

    return (
        <>
            <D3WordCloud
                height={550}
                font='Times'
                fontSize={fontSizeMapper}
                rotate={0}
                padding={10}
                fill={theme.theme === 'dark' ? 'white' : 'black'}
                data={data} />
        </>
    )
}

export default CustomWordCloud