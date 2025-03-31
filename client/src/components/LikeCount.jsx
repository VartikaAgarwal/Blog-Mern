import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { useFetch } from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';

const LikeCount = ({ blogid }) => {  
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const user = useSelector(state => state.user);

    const { data: blogLikeCount, loading, error } = useFetch(
        blogid
            ? `${getEnv('VITE_API_BASE_URL')}/blog-like/get-like/${blogid}/${user?.isLoggedIn ? user.user._id : ''}`
            : null,
        {
            method: 'get',
            credentials: 'include',
        }
    );

    useEffect(() => {
        if (blogLikeCount) {
            setLikeCount(blogLikeCount.likecount);
            setHasLiked(blogLikeCount.isUserliked);
        }
    }, [blogLikeCount]);

    const handleLike = async () => {
        try {
            if (!user?.isLoggedIn) {
                return showToast('error', 'Please log in to your account.');
            }

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/do-like`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user.user._id, blogid })
            });

            if (!response.ok) {
                return showToast('error', response.statusText);
            }

            const responseData = await response.json();
            setLikeCount(responseData.likecount);
            setHasLiked(!hasLiked);
        } catch (error) {
            showToast('error', error.message);
        }
    };

    return (
        <button onClick={handleLike} type='button' className='flex justify-between items-center gap-1'>
            {!hasLiked ? <FaRegHeart /> : <FaHeart fill='red' />}
            {likeCount}
        </button>
    );
};

export default LikeCount;
