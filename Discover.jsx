import { ScrollView, StyleSheet, Text, View, Image, ActivityIndicator, useColorScheme, TouchableOpacity, Animated, BackHandler } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

// INVALID USer...
const DiscoverUserCard = ({ user, currentUser, theme, maxAura }) => {
  const isMe = currentUser?.userName === user.userName;

  // Highlight if max aura is same
  const isMaxAura = user.aura === maxAura && user.aura > 0;

  // Follow State
  const isAlreadyFollowing = currentUser?.following?.includes(user.userName) || false;
  const [followStatus, setFollowStatus] = useState(isAlreadyFollowing ? 'Following' : 'Follow');

  // DM State
  const isAlreadyInDm = currentUser?.messages?.includes(user.userName) || false;
  const [inDm, setInDm] = useState(isAlreadyInDm ? 'In Dm' : 'Add to Dm');

  // Animation reference for the YELLOW/GOLD - to change later that multiple people do not glow, the ones who joined first glow
  // get the user created time from mongo and integrate...not happening tonight 
  const glowAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    // Only animate if they are the max aura user. and not the current user
    if (isMaxAura && !isMe) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isMaxAura, isMe]);

  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFD700', '#FFFFFF']
  });

  const handleFollow = async () => {
    if (followStatus === 'Following') {
      // UNFOLLOW LOGIC
      setFollowStatus('Follow'); // Instantly update UI

      try {
        await axios.post("https://lumen-backend-n5li.onrender.com/api/user/unfollow", {
          secondUser: currentUser.userName,
          mainUser: user.userName
        });
      } catch (error) {
        // console.error("Error in Unfollowing user: ", error);
        setFollowStatus('Following'); // set back if not
      }
    } else {
      // FOLLOW LOGIC
      setFollowStatus('Following'); // Instantly update UI

      try {
        await axios.post("https://lumen-backend-n5li.onrender.com/api/user/addFollower", {
          secondUser: currentUser.userName,
          mainUser: user.userName
        });
      } catch (error) {
        // console.error("Error following user: ", error);
        setFollowStatus('Follow'); // set back again
      }
    }
  };

  const handleMessage = async () => {
    if (inDm === 'In Dm') return;
    setInDm('In Dm'); // Instantly update UI

    try {
      await axios.post("https://lumen-backend-n5li.onrender.com/api/user/dm", {
        secondUser: currentUser.userName,
        mainUser: user.userName
      });
    } catch (error) {
      // console.error("Error adding to Dm ", error);
      setInDm('Add to Dm'); // set it back
    }
  };

  let cardDynamicStyle = {};
  if (isMe) {
    cardDynamicStyle = { borderWidth: 2, borderColor: '#4D96FF' };
  }

  return (
    <Animated.View style={[
      styles.discoverCard,
      theme.discoverCardBackground,
      cardDynamicStyle,
      (isMaxAura && !isMe) && { borderWidth: 2, borderColor: animatedBorderColor }
    ]}>

      {/* Top Half: pfp */}
      <Image
        source={{ uri: user.profilePictureThumbNail }}
        style={styles.discoverCardImage}
        resizeMode="cover"
      />

      {/* Bottom Half: User Info & Button */}
      <View style={styles.discoverCardInfo}>
        <Text style={[styles.discoverCardName, theme.textPrimary]} numberOfLines={1}>
          {user.name}
        </Text>

        <Text style={[styles.discoverCardUsername, theme.textSecondary]} numberOfLines={1}>
          @{user.userName || "user"}
        </Text>

        <Text style={[styles.discoverCardStats, theme.textSecondary]} numberOfLines={1}>
          {user.followerCount} followers • {user.aura} Aura
        </Text>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>

          {/* Follow Button */}
          <TouchableOpacity
            style={[
              styles.halfPillBtn,
              { borderColor: '#4D96FF', borderWidth: 1, backgroundColor: 'transparent' },
              followStatus === 'Following' && theme.followActive,
              isMe && { borderColor: theme.divider.color, opacity: 0.5 }
            ]}
            onPress={handleFollow}
            disabled={isMe}
          >
            <Text style={[
              styles.pillBtnText,
              { color: '#4D96FF' },
              followStatus === 'Following' && { color: '#FFFFFF' },
              isMe && { color: theme.divider.color }
            ]}>
              {isMe ? 'You' : followStatus}
            </Text>
          </TouchableOpacity>

          {/* Add to DM / In DM Button */}
          <TouchableOpacity
            style={[
              styles.halfPillBtn,
              theme.messageDefault, 
              inDm === 'In Dm' && theme.messageActive,
              isMe && { borderColor: theme.divider.color, backgroundColor: 'transparent', opacity: 0.5 }
            ]}
            onPress={handleMessage}
            disabled={inDm === 'In Dm' || isMe}
          >
            <Text style={[
              styles.pillBtnText,
              theme.messageDefaultText,
              inDm === 'In Dm' && { color: '#FFFFFF' },
              isMe && { color: theme.textPrimary.color, opacity: 0.5 }
            ]}>
              {isMe ? 'You' : inDm}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Animated.View>
  );
};

const Discover = () => {
  const { userEmail } = useLocalSearchParams();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auraBoard, setAuraBoard] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
      useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!auraBoard) {
          goToAuraLeaderBoard();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [auraBoard])
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const discoverResponse = await axios.get("https://lumen-backend-n5li.onrender.com/api/discoverPage/discover");
        const usersObject = discoverResponse.data.userMap;
        const userArray = Object.values(usersObject);

        const sortedUsers = userArray.sort((a, b) => b.aura - a.aura);
        setUsers(sortedUsers);

        if (userEmail) {
          const userResponse = await axios.post("https://lumen-backend-n5li.onrender.com/api/discoverPage/getUserName", {
            email: userEmail
          });

          if (userResponse.data && userResponse.data.userName) {
            setCurrentUser(userResponse.data.userName);
          }
        }
      } catch (err) {
        // console.log("Could not load initial data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userEmail]);

  if (loading || !currentUser) {
    return (
      <View style={[styles.mainContainer, theme.background, styles.centerElements]}>
        <ActivityIndicator size="large" color="#4D96FF" />
      </View>
    );
  }

  const allUsers = users;
  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  // Automatically find the absolute highest aura score in the app
  const currentMaxAura = allUsers.length > 0 ? allUsers[0].aura : 0;

  const goToAuraLeaderBoard = () => {
    setAuraBoard(true);
  }
  const goToDiscoverPeople = () => {
    setAuraBoard(false)
  }



  return (
    <View style={[styles.mainContainer, theme.background]}>

      {/* 1. TOP TAB BAR */}
      <View style={styles.displayTabs}>
        <TouchableOpacity
          style={[styles.switchTabs, auraBoard && styles.activeTabBorder]}
          onPress={goToAuraLeaderBoard}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, auraBoard ? theme.textPrimary : theme.textSecondaryHeading]}>
            Aura Leaderboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchTabs, !auraBoard && styles.activeTabBorder]}
          onPress={goToDiscoverPeople}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, !auraBoard ? theme.textPrimary : theme.textSecondaryHeading]}>
            Discover People
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {auraBoard ? (
          /* VIEW 1 AURA LEADERBOARD */
          <View>
            {/* Podium Section */}
            <View style={styles.podiumContainer}>
              {/* 2nd Place */}
              {topThree[1] && (
                <View style={[styles.podiumItem, styles.rankTwo]}>
                  <Image source={{ uri: topThree[1].profilePictureThumbNail }} style={[styles.avatar, styles.silverGlow]} />
                  <Text style={[styles.podiumRank, theme.textPrimary]}>2</Text>
                  <Text style={[styles.podiumName, theme.textPrimary]} numberOfLines={1}>{topThree[1].name}</Text>
                  <Text style={[styles.podiumAura, theme.textSecondary]}>{topThree[1].aura} Aura</Text>
                </View>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <View style={[styles.podiumItem, styles.rankOne]}>
                  <Image source={{ uri: topThree[0].profilePictureThumbNail }} style={[styles.avatarLarge, styles.goldGlow]} />
                  <Text style={styles.podiumRankGold}>1</Text>
                  <Text style={[styles.podiumName, theme.textPrimary]} numberOfLines={1}>{topThree[0].name}</Text>
                  <Text style={[styles.podiumAura, theme.textSecondary]}>{topThree[0].aura} Aura</Text>
                </View>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <View style={[styles.podiumItem, styles.rankThree]}>
                  <Image source={{ uri: topThree[2].profilePictureThumbNail }} style={[styles.avatar, styles.bronzeGlow]} />
                  <Text style={[styles.podiumRank, theme.textPrimary]}>3</Text>
                  <Text style={[styles.podiumName, theme.textPrimary]} numberOfLines={1}>{topThree[2].name}</Text>
                  <Text style={[styles.podiumAura, theme.textSecondary]}>{topThree[2].aura} Aura</Text>
                </View>
              )}
            </View>

            {/* List Section (4th onwards) */}
            <View style={styles.listContainer}>
              {remainingUsers.map((user, index) => {
                const isMe = currentUser?.userName === user.userName;

                return (
                  <View key={user.userName || index} style={[
                    styles.listItem,
                    isMe && theme.selfListHighlight
                  ]}>
                    <Image source={{ uri: user.profilePictureThumbNail }} style={styles.listAvatar} />

                    {/* Styled as Deep Obsidian Blue / Sapphire Blue */}
                    <Text style={[styles.listRank, theme.rankNumber]}>{index + 4}.</Text>

                    {/* Color text blue if it's the current user */}
                    <Text style={[styles.listName, isMe ? styles.selfTextHighlight : theme.textPrimary]} numberOfLines={1}>
                      {user.name} {isMe && "(You)"}
                    </Text>

                    <Text style={[styles.listDivider, theme.divider]}>|</Text>
                    <Text style={[styles.listAuraText, isMe ? styles.selfTextHighlight : theme.textSecondary]}>
                      {user.aura} Aura
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          /* VIEW 2 DISCOVER PEOPLE  */
          <View style={styles.discoverGridContainer}>
            {allUsers.map((user, index) => (
              <DiscoverUserCard
                key={user.userName || index}
                user={user}
                currentUser={currentUser}
                theme={theme}
                maxAura={currentMaxAura}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Discover;

// not again bit**...just an animal .
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: '12%',
  },
  container: {
    flex: 1,
  },
  displayTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    marginBottom: '6%',
  },
  switchTabs: {
    width: '48%',
    paddingVertical: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 999,
  },
  activeTabBorder: {
    borderColor: '#4D96FF',
    backgroundColor: 'rgba(77, 150, 255, 0.08)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: '15%',
  },
  centerElements: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: '10%',
    paddingHorizontal: '3%',
  },
  podiumItem: {
    alignItems: 'center',
    width: '30%',
    marginHorizontal: '1%',
  },
  rankOne: { marginBottom: '5%', zIndex: 2 },
  rankTwo: { marginBottom: 0 },
  rankThree: { marginBottom: 0 },
  avatarLarge: {
    width: 90, height: 90, borderRadius: 45, marginBottom: '10%',
  },
  avatar: {
    width: 70, height: 70, borderRadius: 35, marginBottom: '10%',
  },
  goldGlow: {
    borderWidth: 3, borderColor: '#4D96FF',
    shadowColor: '#4D96FF', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, shadowRadius: 15,
  },
  silverGlow: {
    borderWidth: 2, borderColor: '#A1A8BA',
    shadowColor: '#A1A8BA', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 10,
  },
  bronzeGlow: {
    borderWidth: 2, borderColor: '#CD7F32',
    shadowColor: '#CD7F32', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 10,
  },
  podiumRankGold: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  podiumRank: { fontSize: 16, fontWeight: 'bold' },
  podiumName: { fontSize: 14, fontWeight: '600', marginTop: '4%' },
  podiumAura: { fontSize: 12, marginTop: '2%' },

  // LEADERBOARD LIST
  listContainer: { paddingHorizontal: '6%' },
  listItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: '3%',
    borderRadius: 12, paddingHorizontal: '2%'
  },
  listAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 15 },
  listRank: { fontWeight: 'bold', fontSize: 16, width: '8%' },
  listName: { fontSize: 16, flex: 1 },
  listDivider: { marginHorizontal: '3%', fontSize: 16 },
  listAuraText: { fontSize: 14, width: '22%', textAlign: 'right' },
  selfTextHighlight: { color: '#4D96FF', fontWeight: 'bold' },

  // DISCOVER GRID
  discoverGridContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: '6%', paddingTop: '2%', paddingBottom: '20%',
  },
  discoverCard: {
    width: '48%', borderRadius: 16, marginBottom: '6%', overflow: 'hidden',
  },
  discoverCardImage: { width: '100%', aspectRatio: 1 },
  discoverCardInfo: { padding: '8%' },
  discoverCardName: { fontSize: 15, fontWeight: 'bold', marginBottom: '2%' },
  discoverCardUsername: { fontSize: 12, marginBottom: '2%' },
  discoverCardStats: { fontSize: 11, marginBottom: '10%' },

  // ACTION BUTTONS (Pill Layout)
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  halfPillBtn: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: '8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const darkTheme = StyleSheet.create({
  background: { backgroundColor: '#0A0D14' },
  textPrimary: { color: '#FFFFFF' },
  textSecondary: { color: '#8A8D9F' },
  textSecondaryHeading: { color: '#9dabfa' },
  divider: { color: '#1E2336' },
  discoverCardBackground: { backgroundColor: '#151923' },
  selfListHighlight: { backgroundColor: 'rgba(77, 150, 255, 0.1)' },
  rankNumber: { color: '#4D96FF' },

  // Custom Dark Mode Buttons
  followActive: { backgroundColor: '#059669', borderColor: '#059669' }, // Deeper Emerald Green
  messageActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' }, // Deeper Royal Blue
  messageDefault: { backgroundColor: 'transparent', borderColor: '#1E2336' },
  messageDefaultText: { color: '#FFFFFF' }
});

const lightTheme = StyleSheet.create({
  background: { backgroundColor: '#F2F4F7' },
  textPrimary: { color: '#121629' },
  textSecondary: { color: '#6B7280' },
  textSecondaryHeading: { color: '#A1A8BA' },
  divider: { color: '#D1D5DB' },
  discoverCardBackground: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selfListHighlight: { backgroundColor: 'rgba(77, 150, 255, 0.05)' },
  rankNumber: { color: '#0A0D14' },

  // Custom Light Mode Buttons
  followActive: { backgroundColor: '#00C853', borderColor: '#00C853' }, // Vibrant Neon Green
  messageActive: { backgroundColor: '#4D96FF', borderColor: '#4D96FF' }, // Bright Sapphire Blue
  messageDefault: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  messageDefaultText: { color: '#121629' }
});