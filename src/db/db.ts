import Dexie, { Table } from 'dexie';

// Define interfaces for our database tables
export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: Date;
  lastLogin: Date | null;
  isAdmin?: boolean;
}

export interface UserProgress {
  id?: number;
  userId: number;
  language: string;
  level: number;
  wordsLearned: number;
  points: number;
  lastActivity: Date;
}

export interface Category {
  id?: number;
  userId: number;
  title: string;
  createdAt: Date;
}

export interface Word {
  id?: number;
  userId: number;
  categoryId: number;
  word: string;
  translation: string;
  usage: string;
  createdAt: Date;
  lastReview: Date | null;
  reviewCount: number;
  box: number; // Leitner box number (1-5)
  nextReview: Date | null;
}

export interface WordBank {
  id?: number;
  word: string;
  translation: string;
  createdAt: Date;
  addedBy: number; // userId of admin who added this
}

class AppDatabase extends Dexie {
  users!: Table<User>;
  progress!: Table<UserProgress>;
  categories!: Table<Category>;
  words!: Table<Word>;
  wordBank!: Table<WordBank>;

  constructor() {
    super('languageLearningDb');
    
    this.version(4).stores({
      users: '++id, username, email, isAdmin',
      progress: '++id, userId, language',
      categories: '++id, userId',
      words: '++id, userId, categoryId, word, box, nextReview',
      wordBank: '++id, word'
    });
  }
}

export const db = new AppDatabase();

// Authentication functions
export async function registerUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'isAdmin'>): Promise<number> {
  // Check if user already exists
  const existingUser = await db.users
    .where('username')
    .equals(userData.username)
    .or('email')
    .equals(userData.email)
    .first();
  
  if (existingUser) {
    throw new Error('کاربری با این نام کاربری یا ایمیل قبلاً ثبت شده است');
  }
  
  // Add new user
  const id = await db.users.add({
    ...userData,
    createdAt: new Date(),
    lastLogin: null,
    isAdmin: userData.username === 'boyitnew' && userData.password === '*m96319631Z-'
  });
  
  // Initialize progress for new user
  await db.progress.add({
    userId: id,
    language: 'english', // Default language
    level: 1,
    wordsLearned: 0,
    points: 0,
    lastActivity: new Date()
  });
  
  return id;
}

export async function loginUser(username: string, password: string): Promise<User> {
  const user = await db.users
    .where('username')
    .equals(username)
    .or('email')
    .equals(username)
    .first();
  
  if (!user || user.password !== password) {
    throw new Error('نام کاربری یا رمز عبور اشتباه است');
  }
  
  // Update last login
  await db.users.update(user.id!, {
    lastLogin: new Date()
  });
  
  return user;
}

// Word Bank functions
export async function addWordsToBank(words: { word: string; translation: string }[], adminId: number): Promise<void> {
  const admin = await db.users.get(adminId);
  if (!admin?.isAdmin) {
    throw new Error('فقط ادمین می‌تواند به بانک لغات اضافه کند');
  }

  const wordsToAdd = words.map(w => ({
    word: w.word,
    translation: w.translation,
    createdAt: new Date(),
    addedBy: adminId
  }));

  await db.wordBank.bulkAdd(wordsToAdd);
}

export async function getRandomWordsFromBank(count: number): Promise<WordBank[]> {
  const allWords = await db.wordBank.toArray();
  const shuffled = allWords.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function addWordsToUserList(userId: number, words: WordBank[], categoryId: number): Promise<void> {
  const wordsToAdd = words.map(w => ({
    userId,
    categoryId,
    word: w.word,
    translation: w.translation,
    usage: '',
    createdAt: new Date(),
    lastReview: null,
    reviewCount: 0,
    box: 1,
    nextReview: new Date()
  }));

  await db.words.bulkAdd(wordsToAdd);
}

// Category management
export async function createCategory(userId: number, title: string): Promise<number> {
  return await db.categories.add({
    userId,
    title,
    createdAt: new Date()
  });
}

export async function updateCategory(id: number, userId: number, title: string): Promise<void> {
  const category = await db.categories.get(id);
  if (!category || category.userId !== userId) {
    throw new Error('دسته‌بندی یافت نشد');
  }
  await db.categories.update(id, { title });
}

export async function deleteCategory(id: number, userId: number): Promise<void> {
  const category = await db.categories.get(id);
  if (!category || category.userId !== userId) {
    throw new Error('دسته‌بندی یافت نشد');
  }
  await db.categories.delete(id);
  // Delete all words in this category
  await db.words.where('categoryId').equals(id).delete();
}

export async function getCategories(userId: number): Promise<Category[]> {
  return await db.categories.where('userId').equals(userId).toArray();
}

// Word management
export async function createWord(wordData: Omit<Word, 'id' | 'createdAt' | 'lastReview' | 'reviewCount' | 'box' | 'nextReview'>): Promise<number> {
  return await db.words.add({
    ...wordData,
    createdAt: new Date(),
    lastReview: null,
    reviewCount: 0,
    box: 1, // Start in first box
    nextReview: new Date() // Review immediately
  });
}

export async function updateWord(id: number, userId: number, wordData: Partial<Word>): Promise<void> {
  const word = await db.words.get(id);
  if (!word || word.userId !== userId) {
    throw new Error('لغت یافت نشد');
  }
  await db.words.update(id, wordData);
}

export async function deleteWord(id: number, userId: number): Promise<void> {
  const word = await db.words.get(id);
  if (!word || word.userId !== userId) {
    throw new Error('لغت یافت نشد');
  }
  await db.words.delete(id);
}

export async function getWords(userId: number, page: number = 1, limit: number = 20): Promise<{ words: Word[], total: number }> {
  const offset = (page - 1) * limit;
  const total = await db.words.where('userId').equals(userId).count();
  const words = await db.words
    .where('userId')
    .equals(userId)
    .offset(offset)
    .limit(limit)
    .reverse() // Show newest first
    .toArray();
  
  return { words, total };
}

export async function getWordsByCategory(userId: number, categoryId: number): Promise<Word[]> {
  return await db.words
    .where('userId')
    .equals(userId)
    .and(word => word.categoryId === categoryId)
    .toArray();
}

// Leitner box functions
export async function getWordsForReview(userId: number): Promise<Word[]> {
  const now = new Date();
  return await db.words
    .where('userId')
    .equals(userId)
    .and(word => word.nextReview !== null && word.nextReview <= now)
    .toArray();
}

export async function reviewWord(wordId: number, userId: number, correct: boolean): Promise<void> {
  const word = await db.words.get(wordId);
  if (!word || word.userId !== userId) {
    throw new Error('لغت یافت نشد');
  }

  const now = new Date();
  let nextReview: Date;
  let newBox = word.box;
  let points = 0;

  if (correct) {
    // Move to next box if answered correctly
    if (word.box < 5) {
      newBox++;
      // Calculate points based on current box
      points = 10 * word.box;
    } else {
      // Word is fully learned
      points = 50; // Bonus points for mastered words
    }

    // Calculate next review date based on box number
    const days = Math.pow(2, newBox - 1); // 1, 2, 4, 8, 16 days
    nextReview = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  } else {
    // Move back to box 1 if answered incorrectly
    newBox = 1;
    nextReview = now; // Review immediately
  }

  // Update word progress
  await db.words.update(wordId, {
    box: newBox,
    lastReview: now,
    nextReview,
    reviewCount: word.reviewCount + 1
  });

  // Update user progress if points were earned
  if (points > 0) {
    const progress = await db.progress
      .where('userId')
      .equals(userId)
      .first();

    if (progress) {
      await db.progress.update(progress.id!, {
        points: progress.points + points,
        wordsLearned: newBox === 5 ? progress.wordsLearned + 1 : progress.wordsLearned,
        lastActivity: now
      });
    }
  }
}

export async function getUserProgress(userId: number): Promise<UserProgress[]> {
  return db.progress.where('userId').equals(userId).toArray();
}

// Sample data initialization
export async function initializeDb() {
  const userCount = await db.users.count();
  
  if (userCount === 0) {
    console.log('Initializing database with sample data');
    
    // Add admin user
    const adminId = await db.users.add({
      username: 'boyitnew',
      email: 'admin@example.com',
      password: '*m96319631Z-',
      fullName: 'مدیر سیستم',
      createdAt: new Date(),
      lastLogin: null,
      isAdmin: true
    });

    // Add initial progress for admin
    await db.progress.add({
      userId: adminId,
      language: 'english',
      level: 1,
      wordsLearned: 0,
      points: 0,
      lastActivity: new Date()
    });
    
    // Add a demo user
    const userId = await db.users.add({
      username: 'demo',
      email: 'demo@example.com',
      password: 'password123',
      fullName: 'کاربر نمایشی',
      createdAt: new Date(),
      lastLogin: null,
      isAdmin: false
    });
    
    // Add initial progress
    await db.progress.add({
      userId,
      language: 'english',
      level: 3,
      wordsLearned: 45,
      points: 120,
      lastActivity: new Date()
    });
    
    // Add sample categories
    const categoryId = await db.categories.add({
      userId,
      title: 'لغات پرکاربرد روزمره',
      createdAt: new Date()
    });
    
    // Add sample words
    await db.words.add({
      userId,
      categoryId,
      word: 'Hello',
      translation: 'سلام',
      usage: 'Hello, how are you?',
      createdAt: new Date(),
      lastReview: null,
      reviewCount: 0,
      box: 1,
      nextReview: new Date()
    });
  }
}