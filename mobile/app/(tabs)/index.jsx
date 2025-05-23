import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore';
import styles from "../../assets/styles/home.styles"
import { API_URL } from "../../constants/api"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import COLORS  from "../../constants/colors"

export default function Home() {
  const { token, user } = useAuthStore();
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      console.log(refresh, pageNum);
      console.log(token)



      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log(`${API_URL}/books?page=${pageNum}&limit=5`);


      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch books")

      setBooks((prevBooks) => [...prevBooks, ...data.books])

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books");

    } finally {
      if (refresh) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleLoadMore = async () => { }

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit="cover" />
      </View>
      <View style = {styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>
    </View>
  )

  const renderRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style = {{marginRight: 2}}
        />

      )
    }
    return <View style={styles.ratingContainer}> {stars} </View>
  };



  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}