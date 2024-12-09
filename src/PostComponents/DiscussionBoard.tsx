import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import LoginPopup from "../LoginComponents/LoginPopup";
import './discussion-board.css';

interface Post {
    id: number;
    username: string;
    title: string;
    content: string;
    updatedAt: string;
}

const DiscussionBoard: React.FC<{ currentUser: string }> = ({ currentUser }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/posts/all');
                console.log("Posts request:", response.data);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const toggleCreatePost = () => {
        if (!currentUser) {
            setShowLoginPopup(true);
            return;
        }
        setIsCreatingPost(!isCreatingPost);
        setEditingPost(null);
    }

    //Delete post
    const deletePost = async (postId: number) => {
        try {
            await axios.delete(`https://localhost:8080/api/posts/get-post/${postId}`, {
                params: { username: currentUser },
            });
            setPosts(posts.filter((post) => post.id !== postId));
            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        setEditingPost(null);
    };

    return (
        <div className="discussion-board">
            <div className="discussion-board-actions">
                <button className="green-button" onClick={toggleCreatePost}>
                    {isCreatingPost ? 'Submit' : 'Create Post'}
                </button>
                {isCreatingPost && editingPost && editingPost.username === currentUser && (
                    <button
                        className="red-button"
                        onClick={() => deletePost(editingPost.id)}
                    >
                        Delete Post
                    </button>
                )}
            </div>
            {showLoginPopup && <LoginPopup setShowPopup={setShowLoginPopup} />}
            {isCreatingPost && <CreatePost currentUser={currentUser} onCancel={() => setIsCreatingPost(false)} />}
            <div className="discussion-board-points">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="discussion-board-post"
                        onClick={() => setEditingPost(post)}
                    >
                        <h3><strong>{post.username}:</strong> {post.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        <small>Last updated: {new Date(post.updatedAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscussionBoard;