// Feed.js
import React, { useState, useEffect } from 'react';
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [comment, setComment] = useState('');
  const [activePostId, setActivePostId] = useState(null);
  const [userName, setUserName] = useState('');

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    // Extract YouTube video ID from the URL
    const videoId = extractYouTubeVideoId(videoUrl);

    if ((videoId || imageFile) && userName.trim() !== '') {
      // Create a new post object with comments and likes
      const newPost = {
        id: posts.length + 1,
        user: userName,
        videoId,
        image: imageFile ? URL.createObjectURL(imageFile) : null,
        description,
        comments: [],
        likes: 0,
        likedByUser: false,
      };

      // Update the posts state with the new post
      setPosts([...posts, newPost]);

      // Clear the form fields after submission
      setDescription('');
      setVideoUrl('');
      setImageFile(null);
      setComment('');
      setUserName('');
    } else {
      alert('Please enter a valid YouTube video URL or select an image. Also, provide a valid user name.');
    }
  };

  const handleCommentSubmit = (postId) => {
    // Find the active post by its ID
    const activePost = posts.find((post) => post.id === postId);

    if (activePost) {
      // Add the comment to the active post's comments array
      const newComment = {
        user: userName || 'Anonymous', // Use provided name or default to 'Anonymous'
        text: comment,
      };

      // Update the active post with the new comment
      activePost.comments = [newComment, ...activePost.comments];

      // Clear the comment field and reset the active post
      setComment('');
      setActivePostId(null);

      // Update the posts state
      setPosts([...posts]);
    }
  };

  const handleLikeClick = (postId) => {
    // Find the post by its ID
    const likedPost = posts.find((post) => post.id === postId);

    if (likedPost) {
      // If the post is already liked by the user, decrease likes count
      if (likedPost.likedByUser) {
        likedPost.likes -= 1;
        likedPost.likedByUser = false;
      } else {
        // Increment the likes count for the liked post
        likedPost.likes += 1;
        likedPost.likedByUser = true;
      }

      // Update the posts state
      setPosts([...posts]);
    }
  };

  const handleEditClick = (postId) => {
    // Find the post by its ID
    const editedPost = posts.find((post) => post.id === postId);

    if (editedPost) {
      // Prompt user for new description and video URL
      const newDescription = prompt('Enter new description:', editedPost.description);
      const newVideoUrl = prompt('Enter new video URL:', editedPost.videoId);

      // Update the post with new description and video URL
      editedPost.description = newDescription || editedPost.description;
      editedPost.videoId = extractYouTubeVideoId(newVideoUrl) || editedPost.videoId;

      // Update the posts state
      setPosts([...posts]);
    }
  };

  const handleDeleteClick = (postId) => {
    // Filter out the post to be deleted
    const updatedPosts = posts.filter((post) => post.id !== postId);

    // Update the posts state
    setPosts(updatedPosts);
  };

  // Function to extract YouTube video ID from URL
  const extractYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="feedContainer">
      <h1>Feed: Post Your Amazing Workout videos here!</h1>
      <form onSubmit={handlePostSubmit}>
        <label>
          Description:
          <textarea
            value={description}
            onChange={handleDescriptionChange}
          />
        </label>
        <br />
        <label>
          Video URL (YouTube):
          <input
            type="text"
            value={videoUrl}
            onChange={handleVideoUrlChange}
          />
        </label>
        <br />
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        <br />
        <label>
          Your Name:
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
          />
        </label>
        <br />
        <button type="submit">Post</button>
      </form>

      {/* Display the posts */}
      {posts.map((post) => (
        <div key={post.id} className="post">
          <p><strong>Posted by:</strong> {post.user}</p>
          {post.videoId && (
            <iframe
              title={`YouTube Video ${post.id}`}
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${post.videoId}`}
              frameBorder="0"
              allowFullScreen
            />
          )}
          {post.image && <img src={post.image} alt={`Post ${post.id}`} />}
          <p><strong>Description:</strong> {post.description}</p>
          <p>Likes: {post.likes}</p>

          {/* Buttons for Like, Edit, and Delete */}
          <div className="postButtons">
            <button
              className={post.likedByUser ? 'liked' : ''}
              onClick={() => handleLikeClick(post.id)}
            >
              ❤️ Like
            </button>
            <button onClick={() => handleEditClick(post.id)}>Edit</button>
            <button onClick={() => handleDeleteClick(post.id)}>Delete</button>
          </div>

          {/* Comment section */}
          <div className="commentsSection">
            <h3>Comments</h3>
            <ul>
              {post.comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.user}:</strong> {comment.text}
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
            />
            <button onClick={() => handleCommentSubmit(post.id)}>Add Comment</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
