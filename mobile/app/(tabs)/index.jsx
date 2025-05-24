import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore';
import styles from "../../assets/styles/home.styles"
import { API_URL } from "../../constants/api"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import COLORS from "../../constants/colors"
import { formatPublishDate } from '../../lib/utils';
import Loader from '../../components/Loader';

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

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to fetch books")

      // setBooks((prevBooks) => [...prevBooks, ...data.books])
      const uniqueBooks =
  refresh || pageNum === 1
    ? data.books
    : Array.from(new Set([...books, ...data.books].map((book) => book._id)))
        .map((id) => [...books, ...data.books].find((book) => book._id === id));


      setBooks(uniqueBooks)

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

  const handleLoadMore = async () => {
  if (hasMore && !loading && !refreshing) {
    const nextPage = page + 1;
    console.log(`Loading page ${nextPage}`);
    await fetchBooks(nextPage);
  }
};

  const renderItem = ({ item, index }) => {
    console.log("Rendering item at index:", index);
    return(
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
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  )
}

  const renderRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />

      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  };

  if(loading) return <Loader size="large" />

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>ReadersHub📚</Text>
            <Text style={styles.headerSubtitle}>Discover great reads from the community</Text>
          </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}

        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
          ) : null
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendation yet</Text>
            <Text style={styles.emptySubtext}>Be the first one to share a book</Text>
          </View>
        }
      />
    </View>
  )
}