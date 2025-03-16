import React, { useEffect, useState } from "react";
import { getContract } from "./Contract";

const TweetComponent = () => {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [totalLikes, setTotalLikes] = useState(0);

  // Fetch all tweets
  const fetchTweets = async () => {
    try {
      const contract = getContract();
      const signer = await contract.signer.getAddress();
      console.log("Signer address:", signer); // Debug log
      const fetchedTweets = await contract.getAllTweets(signer);
      console.log("Fetched tweets:", fetchedTweets); // Debug log
      setTweets(fetchedTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  // Create a new tweet
  const createTweet = async () => {
    if (newTweet.trim() === "") return;
    try {
      const contract = getContract();
      console.log("Creating tweet:", newTweet); // Debug log
      const tx = await contract.createTweet(newTweet);
      console.log("Transaction sent:", tx); // Debug log
      await tx.wait();
      console.log("Transaction confirmed"); // Debug log
      setNewTweet("");
      fetchTweets(); // Refresh tweets after creating one
    } catch (error) {
      console.error("Error creating tweet:", error);
    }
  };

  // Like a tweet
  const likeTweet = async (author, id) => {
    try {
      const contract = getContract();
      const tx = await contract.likeTweet(author, id);
      await tx.wait();
      fetchTweets(); // Refresh tweets after liking
    } catch (error) {
      console.error("Error liking tweet:", error);
    }
  };

  // Unlike a tweet
  const unlikeTweet = async (author, id) => {
    try {
      const contract = getContract();
      const tx = await contract.unlikeTweet(author, id);
      await tx.wait();
      fetchTweets(); // Refresh tweets after unliking
    } catch (error) {
      console.error("Error unliking tweet:", error);
    }
  };

  // Get total likes
  const getTotalLikes = async () => {
    try {
      const contract = getContract();
      const signer = await contract.signer.getAddress();
      const totalLikes = await contract.getTotalLikes(signer);
      setTotalLikes(totalLikes.toString());
    } catch (error) {
      console.error("Error getting total likes:", error);
    }
  };

  useEffect(() => {
    fetchTweets();
    getTotalLikes();
  }, []);

  return (
    <div>
      <h2>Twitter Contract</h2>
      {/* Create Tweet */}
      <div>
        <input
          type="text"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          placeholder="Write a tweet..."
        />
        <button onClick={createTweet}>Tweet</button>
      </div>

      {/* Total Likes */}
      <p>Total Likes: {totalLikes}</p>

      {/* Display Tweets */}
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <p><strong>Author:</strong> {tweet.author}</p>
            <p><strong>Content:</strong> {tweet.content}</p>
            <p><strong>Likes:</strong> {tweet.likes.toString()}</p>
            <p><strong>Timestamp:</strong> {new Date(tweet.timestamp * 1000).toLocaleString()}</p>
            <button onClick={() => likeTweet(tweet.author, tweet.id)}>Like</button>
            <button onClick={() => unlikeTweet(tweet.author, tweet.id)}>Unlike</button>
          </div>
        ))
      ) : (
        <p>No tweets found!</p>
      )}
    </div>
  );
};

export default TweetComponent;
