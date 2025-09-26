import React, { useState } from 'react';
import './News.css';

const initialPosts = [
  {
    id: 1,
    author: 'Admin Team',
    content: 'Welcome to the new Alumni Connect platform! Share your achievements and stay connected.',
    timestamp: new Date().toISOString(),
    likes: 5,
    likedBy: [],
    comments: [
      { id: 1, author: 'Sarah Johnson', text: 'Great to see this platform!', timestamp: new Date().toISOString() }
    ]
  }
];

export default function News({ user, userRole }) {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  const canPost = userRole === 'alumni' || userRole === 'admin';
  const canComment = userRole === 'alumni' || userRole === 'admin';

  const addPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: user.name,
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      const likedBy = post.likedBy.includes(user.name) 
        ? post.likedBy.filter(name => name !== user.name)
        : [...post.likedBy, user.name];
      return { ...post, likedBy, likes: likedBy.length };
    }));
  };

  const addComment = (postId) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: [...post.comments, {
          id: Date.now(),
          author: user.name,
          text,
          timestamp: new Date().toISOString()
        }]
      };
    }));
    setCommentTexts({ ...commentTexts, [postId]: '' });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="news-container slide-up">
      <h2>News & Updates</h2>
      
      {canPost && (
        <div className="post-composer">
          <textarea
            placeholder="Share something with the community..."
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            rows={3}
          />
          <button onClick={addPost} className="btn btn-primary">Share Post</button>
        </div>
      )}

      <div className="posts-feed">
        {posts.map((post, index) => (
          <div key={post.id} className="post-card" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="post-header">
              <div className="author-avatar">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="post-meta">
                <h4>{post.author}</h4>
                <span className="post-time">{formatTime(post.timestamp)}</span>
              </div>
            </div>
            
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            
            <div className="post-actions">
              <button 
                className={`action-btn ${post.likedBy.includes(user.name) ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                ❤️ {post.likes}
              </button>
              <button className="action-btn">
                💬 {post.comments.length}
              </button>
            </div>
            
            <div className="comments-section">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-avatar">
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="comment-content">
                    <span className="comment-author">{comment.author}</span>
                    <p>{comment.text}</p>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                  </div>
                </div>
              ))}
              
              {canComment && (
                <div className="add-comment">
                  <div className="comment-avatar">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="comment-input-container">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentTexts[post.id] || ''}
                      onChange={e => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                      onKeyPress={e => e.key === 'Enter' && addComment(post.id)}
                    />
                    <button onClick={() => addComment(post.id)} className="btn btn-primary comment-btn">
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
