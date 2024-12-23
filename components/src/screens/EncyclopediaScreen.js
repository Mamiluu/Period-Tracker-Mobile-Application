import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from './Encyclopedia/en';

const EncyclopediaScreen = () => {
  // State management
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistoryDelete, setShowHistoryDelete] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const searchBarHeight = useRef(new Animated.Value(56)).current;

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Load saved data
  const loadSavedData = async () => {
    try {
      const [savedFavorites, savedRecent, savedHistory] = await Promise.all([
        AsyncStorage.getItem('encyclopedia_favorites'),
        AsyncStorage.getItem('encyclopedia_recent'),
        AsyncStorage.getItem('encyclopedia_search_history')
      ]);
      
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading saved data:', error);
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const updatedHistory = [
        query.trim(),
        ...searchHistory.filter(item => item !== query.trim())
      ].slice(0, 10);
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem('encyclopedia_search_history', JSON.stringify(updatedHistory));
    }
  };

  // Delete search history item
  const deleteHistoryItem = async (item) => {
    const updatedHistory = searchHistory.filter(i => i !== item);
    setSearchHistory(updatedHistory);
    await AsyncStorage.setItem('encyclopedia_search_history', JSON.stringify(updatedHistory));
  };

  // Clear all history
  const clearAllHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all recently viewed items and search history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setRecentlyViewed([]);
            setSearchHistory([]);
            await AsyncStorage.removeItem('encyclopedia_recent');
            await AsyncStorage.removeItem('encyclopedia_search_history');
          }
        }
      ]
    );
  };

  // Handle category expansion
  const handleCategoryPress = (categoryId) => {
    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: expandedCategory === categoryId ? 0 : 1,
        useNativeDriver: true
      }),
      Animated.timing(searchBarHeight, {
        toValue: expandedCategory === categoryId ? 56 : 0,
        duration: 300,
        useNativeDriver: false
      })
    ]).start();
    
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedSubCategory(null);
  };

  // Handle subcategory expansion with tracking
  const handleSubCategoryPress = async (subCategoryId) => {
    setExpandedSubCategory(expandedSubCategory === subCategoryId ? null : subCategoryId);
    
    if (subCategoryId && expandedSubCategory !== subCategoryId) {
      const updatedRecent = [
        subCategoryId,
        ...recentlyViewed.filter(id => id !== subCategoryId)
      ].slice(0, 5);
      
      setRecentlyViewed(updatedRecent);
      await AsyncStorage.setItem('encyclopedia_recent', JSON.stringify(updatedRecent));
    }
  };

  // Remove from recently viewed
  const removeFromRecent = async (subCategoryId) => {
    const updatedRecent = recentlyViewed.filter(id => id !== subCategoryId);
    setRecentlyViewed(updatedRecent);
    await AsyncStorage.setItem('encyclopedia_recent', JSON.stringify(updatedRecent));
  };

  // Handle favorites
  const toggleFavorite = async (articleId) => {
    const newFavorites = favorites.includes(articleId)
      ? favorites.filter(id => id !== articleId)
      : [...favorites, articleId];
    
    setFavorites(newFavorites);
    await AsyncStorage.setItem('encyclopedia_favorites', JSON.stringify(newFavorites));
  };

  // Filter content based on search
  const filterContent = (item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { height: searchBarHeight }]}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={24} color="#ff69b4" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="close" size={24} color="#ff69b4" />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>

      {/* Search History */}
      {searchHistory.length > 0 && searchQuery && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearAllHistory}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          {searchHistory.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyItem}
              onPress={() => handleSearch(item)}
            >
              <MaterialIcons name="history" size={20} color="#999" />
              <Text style={styles.historyText}>{item}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteHistoryItem(item)}
              >
                <MaterialIcons name="close" size={20} color="#999" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && !searchQuery && (
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recently Viewed</Text>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => setShowHistoryDelete(!showHistoryDelete)}
            >
              <MaterialIcons 
                name={showHistoryDelete ? "done" : "edit"} 
                size={24} 
                color="#ff69b4" 
              />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyViewed.map((subCategoryId) => {
              const subCategory = en.subCategories.byId[subCategoryId];
              return (
                <View key={subCategoryId} style={styles.recentItemContainer}>
                  <TouchableOpacity
                    style={[
                      styles.recentItem,
                      { paddingRight: showHistoryDelete ? 40 : 15 }
                    ]}
                    onPress={() => handleSubCategoryPress(subCategoryId)}
                  >
                    <Text style={styles.recentItemText}>{subCategory?.name}</Text>
                  </TouchableOpacity>
                  {showHistoryDelete && (
                    <TouchableOpacity
                      style={styles.deleteRecentButton}
                      onPress={() => removeFromRecent(subCategoryId)}
                    >
                      <MaterialIcons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.contentContainer}>
        {en.categories.allIds.map((categoryId) => {
          const category = en.categories.byId[categoryId];
          if (!category || !filterContent(category)) return null;

          return (
            <Animated.View 
              key={categoryId} 
              style={[
                styles.category,
                {
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryTitle}>
                    {category.name}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => handleCategoryPress(categoryId)}
                    style={styles.emojiButton}
                  >
                    <Animated.Text style={{
                      fontSize: 20,
                      transform: [{
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg']
                        })
                      }]
                    }}>
                      {category.tags.primary.emoji}
                    </Animated.Text>
                  </TouchableOpacity>
                </View>
              </View>

              {expandedCategory === categoryId && (
                <View style={styles.subCategoryContainer}>
                  {category.subCategories.map((subCategoryId) => {
                    const subCategory = en.subCategories.byId[subCategoryId];
                    if (!subCategory || !filterContent(subCategory)) return null;

                    return (
                      <View key={subCategoryId} style={styles.subcategory}>
                        <TouchableOpacity
                          style={styles.subCategoryHeader}
                          onPress={() => handleSubCategoryPress(subCategoryId)}
                        >
                          <Text style={styles.subCategoryTitle}>
                            {subCategory.name}
                          </Text>
                        </TouchableOpacity>

                        {expandedSubCategory === subCategoryId && (
                          <View style={styles.articleContainer}>
                            {subCategory.articles.map((articleId) => {
                              const article = en.articles.byId[articleId];
                              if (!article || !filterContent(article)) return null;

                              return (
                                <View key={articleId} style={styles.article}>
                                  <View style={styles.articleHeader}>
                                    <Text style={styles.articleTitle}>
                                      {article.title}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() => toggleFavorite(articleId)}
                                    >
                                      <MaterialIcons
                                        name={favorites.includes(articleId) ? 'favorite' : 'favorite-border'}
                                        size={24}
                                        color="#ff69b4"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <Text style={styles.articleContent}>
                                    {article.content}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f8',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffd1dc',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ffd1dc',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  historyContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd1dc',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearText: {
    color: '#ff69b4',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffd1dc',
  },
  historyText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  recentContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  historyButton: {
    padding: 5,
  },
  recentItemContainer: {
    position: 'relative',
    marginRight: 10,
  },
  recentItem: {
    backgroundColor: '#fff',
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd1dc',
    minWidth: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  recentItemText: {
    color: '#ff69b4',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  deleteRecentButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff69b4',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  category: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffd1dc',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryHeader: {
    padding: 15,
    backgroundColor: '#fff5f8',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
    flex: 1,
  },
  emojiButton: {
    padding: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCategoryContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subcategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffd1dc',
    overflow: 'hidden',
  },
  subCategoryHeader: {
    padding: 12,
    backgroundColor: '#fff5f8',
  },
  subCategoryTitle: {
    fontSize: 16,
    color: '#ff69b4',
    fontWeight: '600',
  },
  articleContainer: {
    padding: 10,
  },
  article: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffd1dc',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff69b4',
    flex: 1,
    marginRight: 10,
  },
  articleContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  searchHighlight: {
    backgroundColor: '#ffd1dc',
    borderRadius: 2,
  },
});

export default EncyclopediaScreen;