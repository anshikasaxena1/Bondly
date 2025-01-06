import User from '../models/FriendSchema.js'; // Assuming you have a User model

// Get mutual friends between two users
const getMutualFriends = async (userId, potentialFriendId) => {
  try {
    console.log(`Fetching mutual friends between ${userId} and ${potentialFriendId}`);
    const [user, potentialFriend] = await Promise.all([
      User.findById(userId).populate('friends'),
      User.findById(potentialFriendId).populate('friends'),
    ]);

    if (!user || !potentialFriend) {
      console.log(`User or potential friend not found. user: ${user}, potentialFriend: ${potentialFriend}`);
      return [];
    }

    const userFriends = user.friends.map((friend) => friend._id.toString());
    const potentialFriendFriends = potentialFriend.friends.map((friend) => friend._id.toString());

    const mutualFriends = userFriends.filter((friend) => potentialFriendFriends.includes(friend));
    console.log(`Mutual friends found: ${mutualFriends}`);
    return mutualFriends;
  } catch (error) {
    console.error('Error fetching mutual friends:', error);
    return [];
  }
};

// Generate friend recommendations based only on mutual friends
const recommendFriends = async (userId) => {
  try {
    console.log(`Generating friend recommendations for userId: ${userId}`);
    const user = await User.findById(userId).populate('friends');

    if (!user) {
      console.error('User not found');
      return [];
    }

    console.log(`User found: ${user._id}, Number of friends: ${user.friends.length}`);
    const userFriends = user.friends.map((friend) => friend._id.toString());

    console.log(`User's friends: ${userFriends}`);
    const friendsOfFriends = await User.find({
      _id: { $nin: [userId, ...userFriends] },
      friends: { $in: userFriends }, // Find friends of friends
    }).populate('friends');

    console.log(`Friends of friends fetched: ${friendsOfFriends.length}`);

    const recommendations = await Promise.all(
      friendsOfFriends.map(async (potentialFriend) => {
        console.log(`Checking potential friend: ${potentialFriend._id}`);
        const mutualFriends = await getMutualFriends(userId, potentialFriend._id);

        if (mutualFriends.length > 0) {
          console.log(
            `Adding recommendation for ${potentialFriend._id}: ${mutualFriends.length} mutual friends`
          );
          return {
            friend: potentialFriend,
            mutualFriends: mutualFriends.length,
          };
        }
        return null;
      })
    );

    // Filter out null values and sort the recommendations
    const filteredRecommendations = recommendations.filter((recommendation) => recommendation !== null);

    console.log(`Total recommendations: ${filteredRecommendations.length}`);
    filteredRecommendations.sort((a, b) => b.mutualFriends - a.mutualFriends);

    console.log('Sorted recommendations:', filteredRecommendations);
    return filteredRecommendations;
  } catch (error) {
    console.error('Error generating friend recommendations:', error);
    return [];
  }
};

export default recommendFriends;
