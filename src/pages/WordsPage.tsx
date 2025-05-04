import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Upload,
  Database,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Category,
  Word,
  WordBank,
  WordBankCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getWords,
  createWord,
  updateWord,
  deleteWord,
  addWordsToBank,
  getRandomWordsFromBank,
  addWordsToUserList,
  createWordBankCategory,
  updateWordBankCategory,
  deleteWordBankCategory,
  getWordBankCategories,
} from "../db/db";
import toast from "react-hot-toast";

const WordsPage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wordBankCategories, setWordBankCategories] = useState<
    WordBankCategory[]
  >([]);
  const [words, setWords] = useState<Word[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingWordBankCategory, setIsAddingWordBankCategory] =
    useState(false);
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingWordBankCategory, setEditingWordBankCategory] =
    useState<WordBankCategory | null>(null);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newWordBankCategoryTitle, setNewWordBankCategoryTitle] = useState("");
  const [newWord, setNewWord] = useState({
    word: "",
    translation: "",
    usage: "",
    categoryId: 0,
  });
  const [showWordBank, setShowWordBank] = useState(false);
  const [randomWordCount, setRandomWordCount] = useState(5);
  const [selectedWordBankCategory, setSelectedWordBankCategory] =
    useState<number>(0);
  const [randomWords, setRandomWords] = useState<WordBank[]>([]);
  const [selectedRandomWords, setSelectedRandomWords] = useState<Set<number>>(
    new Set()
  );
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedUploadCategory, setSelectedUploadCategory] =
    useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user, currentPage]);

  const loadData = async () => {
    try {
      const userCategories = await getCategories(user!.id);
      const bankCategories = await getWordBankCategories();
      const { words: userWords, total } = await getWords(
        user!.id,
        currentPage,
        ITEMS_PER_PAGE
      );
      setCategories(userCategories);
      setWordBankCategories(bankCategories);
      setWords(userWords);
      setTotalWords(total);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("خطا در بارگیری اطلاعات");
    }
  };

  const handleAddCategory = async () => {
    if (!user?.id || !newCategoryTitle.trim()) return;

    try {
      await createCategory(user.id, newCategoryTitle.trim());
      await loadData();
      setNewCategoryTitle("");
      setIsAddingCategory(false);
      toast.success("دسته‌بندی با موفقیت اضافه شد");
    } catch (error) {
      toast.error("خطا در ایجاد دسته‌بندی");
    }
  };

  const handleAddWordBankCategory = async () => {
    if (!user?.id || !newWordBankCategoryTitle.trim()) return;

    try {
      await createWordBankCategory(newWordBankCategoryTitle.trim(), user.id);
      await loadData();
      setNewWordBankCategoryTitle("");
      setIsAddingWordBankCategory(false);
      toast.success("دسته‌بندی بانک لغات با موفقیت اضافه شد");
    } catch (error) {
      toast.error("خطا در ایجاد دسته‌بندی بانک لغات");
    }
  };

  const handleUpdateCategory = async () => {
    if (!user?.id || !editingCategory) return;

    try {
      await updateCategory(
        editingCategory.id!,
        user.id,
        newCategoryTitle.trim()
      );
      await loadData();
      setEditingCategory(null);
      setNewCategoryTitle("");
      toast.success("دسته‌بندی با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش دسته‌بندی");
    }
  };

  const handleUpdateWordBankCategory = async () => {
    if (!user?.id || !editingWordBankCategory) return;

    try {
      await updateWordBankCategory(
        editingWordBankCategory.id!,
        newWordBankCategoryTitle.trim(),
        user.id
      );
      await loadData();
      setEditingWordBankCategory(null);
      setNewWordBankCategoryTitle("");
      toast.success("دسته‌بندی بانک لغات با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش دسته‌بندی بانک لغات");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!user?.id) return;

    if (
      !confirm(
        "آیا از حذف این دسته‌بندی اطمینان دارید؟ تمام لغات این دسته‌بندی نیز حذف خواهند شد."
      )
    ) {
      return;
    }

    try {
      await deleteCategory(categoryId, user.id);
      await loadData();
      toast.success("دسته‌بندی با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف دسته‌بندی");
    }
  };

  const handleDeleteWordBankCategory = async (categoryId: number) => {
    if (!user?.id) return;

    if (
      !confirm(
        "آیا از حذف این دسته‌بندی بانک لغات اطمینان دارید؟ تمام لغات این دسته‌بندی نیز حذف خواهند شد."
      )
    ) {
      return;
    }

    try {
      await deleteWordBankCategory(categoryId, user.id);
      await loadData();
      toast.success("دسته‌بندی بانک لغات با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف دسته‌بندی بانک لغات");
    }
  };

  const handleAddWord = async () => {
    if (
      !user?.id ||
      !newWord.word.trim() ||
      !newWord.translation.trim() ||
      !newWord.categoryId
    )
      return;

    try {
      await createWord({
        userId: user.id,
        ...newWord,
      });
      await loadData();
      setNewWord({ word: "", translation: "", usage: "", categoryId: 0 });
      setIsAddingWord(false);
      toast.success("لغت با موفقیت اضافه شد");
    } catch (error) {
      toast.error("خطا در افزودن لغت");
    }
  };

  const handleUpdateWord = async () => {
    if (!user?.id || !editingWord) return;

    try {
      await updateWord(editingWord.id!, user.id, {
        word: newWord.word,
        translation: newWord.translation,
        usage: newWord.usage,
        categoryId: newWord.categoryId,
      });
      await loadData();
      setEditingWord(null);
      setNewWord({ word: "", translation: "", usage: "", categoryId: 0 });
      toast.success("لغت با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش لغت");
    }
  };

  const handleDeleteWord = async (wordId: number) => {
    if (!user?.id) return;

    if (!confirm("آیا از حذف این لغت اطمینان دارید؟")) {
      return;
    }

    try {
      await deleteWord(wordId, user.id);
      await loadData();
      toast.success("لغت با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف لغت");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const validateWordFormat = (word: any): boolean => {
    return (
      typeof word === "object" &&
      word !== null &&
      typeof word.word === "string" &&
      typeof word.translate === "string" &&
      word.word.trim() !== "" &&
      word.translate.trim() !== ""
    );
  };

  const handleUploadWords = async () => {
    if (!uploadedFile || !user?.id || !selectedUploadCategory) {
      toast.error("لطفاً یک دسته‌بندی انتخاب کنید");
      return;
    }

    setIsUploading(true);
    try {
      const content = await uploadedFile.text();

      let words;
      try {
        words = JSON.parse(content);
      } catch (parseError) {
        throw new Error(
          "فایل JSON معتبر نیست. لطفاً مطمئن شوید که فایل شما یک JSON معتبر است و هیچ کاراکتر نامعتبری ندارد."
        );
      }

      if (!Array.isArray(words)) {
        throw new Error("فایل باید حاوی آرایه‌ای از لغات باشد");
      }

      // Validate each word's format
      const invalidWords = words.filter((word) => !validateWordFormat(word));
      if (invalidWords.length > 0) {
        throw new Error(
          `${invalidWords.length} لغت با فرمت نامعتبر یافت شد. هر لغت باید دارای فیلدهای 'word' و 'translate' باشد.`
        );
      }

      // تبدیل ساختار داده به فرمت مورد نیاز
      const formattedWords = words.map((item) => ({
        word: item.word.trim(),
        translation: item.translate.trim(),
      }));

      await addWordsToBank(formattedWords, user.id, selectedUploadCategory);
      toast.success("لغات با موفقیت به بانک لغات اضافه شدند");

      // پاک کردن فایل
      setUploadedFile(null);
      setSelectedUploadCategory(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "خطا در خواندن فایل یا افزودن لغات"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleGetRandomWords = async () => {
    if (!user?.id) return;

    setIsLoadingRandom(true);
    try {
      const words = await getRandomWordsFromBank(
        randomWordCount,
        selectedWordBankCategory || undefined
      );
      setRandomWords(words);
      setSelectedRandomWords(new Set(words.map((w) => w.id!)));
    } catch (error) {
      toast.error("خطا در دریافت لغات تصادفی");
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handleToggleRandomWord = (wordId: number) => {
    const newSelected = new Set(selectedRandomWords);
    if (newSelected.has(wordId)) {
      newSelected.delete(wordId);
    } else {
      newSelected.add(wordId);
    }
    setSelectedRandomWords(newSelected);
  };

  const handleAddSelectedWords = async () => {
    if (!user?.id || selectedRandomWords.size === 0 || !newWord.categoryId) {
      toast.error("لطفاً یک دسته‌بندی انتخاب کنید");
      return;
    }

    try {
      const selectedWords = randomWords.filter((w) =>
        selectedRandomWords.has(w.id!)
      );
      await addWordsToUserList(user.id, selectedWords, newWord.categoryId);
      await loadData();
      setShowWordBank(false);
      setRandomWords([]);
      setSelectedRandomWords(new Set());
      toast.success("لغات انتخاب شده با موفقیت اضافه شدند");
    } catch (error) {
      toast.error("خطا در افزودن لغات");
    }
  };

  const totalPages = Math.ceil(totalWords / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            <span>بازگشت به داشبورد</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مدیریت لغات</h1>
          <p className="text-gray-600">افزودن و ویرایش لغات و دسته‌بندی‌ها</p>
        </div>

        {user?.isAdmin && (
          <div className="mb-8">
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="btn-primary mb-4"
            >
              {showAdminPanel ? "بستن پنل مدیریت" : "پنل مدیریت"}
            </button>

            {showAdminPanel && (
              <div className="card mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  مدیریت بانک لغات
                </h2>

                {/* Word Bank Categories Management */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      دسته‌بندی‌های بانک لغات
                    </h3>
                    <button
                      onClick={() => setIsAddingWordBankCategory(true)}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {isAddingWordBankCategory && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={newWordBankCategoryTitle}
                        onChange={(e) =>
                          setNewWordBankCategoryTitle(e.target.value)
                        }
                        placeholder="عنوان دسته‌بندی"
                        className="form-input mb-2"
                      />
                      <div className="flex justify-end space-x-2 space-x-reverse">
                        <button
                          onClick={() => setIsAddingWordBankCategory(false)}
                          className="btn-outline text-sm py-1 px-3"
                        >
                          انصراف
                        </button>
                        <button
                          onClick={handleAddWordBankCategory}
                          className="btn-primary text-sm py-1 px-3"
                        >
                          افزودن
                        </button>
                      </div>
                    </div>
                  )}

                  {editingWordBankCategory && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={newWordBankCategoryTitle}
                        onChange={(e) =>
                          setNewWordBankCategoryTitle(e.target.value)
                        }
                        placeholder="عنوان دسته‌بندی"
                        className="form-input mb-2"
                      />
                      <div className="flex justify-end space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            setEditingWordBankCategory(null);
                            setNewWordBankCategoryTitle("");
                          }}
                          className="btn-outline text-sm py-1 px-3"
                        >
                          انصراف
                        </button>
                        <button
                          onClick={handleUpdateWordBankCategory}
                          className="btn-primary text-sm py-1 px-3"
                        >
                          ذخیره
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {wordBankCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium">{category.title}</span>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setEditingWordBankCategory(category);
                              setNewWordBankCategoryTitle(category.title);
                            }}
                            className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteWordBankCategory(category.id!)
                            }
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Word Upload Section */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">
                      راهنمای آپلود فایل
                    </h3>
                    <p className="text-sm text-gray-600">
                      فایل JSON باید شامل آرایه‌ای از لغات با ساختار زیر باشد:
                    </p>
                    <pre className="bg-white p-3 rounded mt-2 text-sm overflow-x-auto">
                      {`[
  {"word": "hello", "translate": "سلام"},
  {"word": "world", "translate": "دنیا"}
]`}
                    </pre>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div className="mb-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-center">
                        فایل JSON خود را انتخاب کنید
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">دسته‌بندی بانک لغات</label>
                      <select
                        value={selectedUploadCategory}
                        onChange={(e) =>
                          setSelectedUploadCategory(Number(e.target.value))
                        }
                        className="form-input"
                      >
                        <option value={0}>انتخاب دسته‌بندی</option>
                        {wordBankCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-outline"
                      >
                        انتخاب فایل
                      </button>

                      {uploadedFile && (
                        <button
                          onClick={handleUploadWords}
                          disabled={isUploading || !selectedUploadCategory}
                          className="btn-primary"
                        >
                          {isUploading ? (
                            <span className="flex items-center">
                              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                              در حال آپلود...
                            </span>
                          ) : (
                            "شروع آپلود"
                          )}
                        </button>
                      )}
                    </div>

                    {uploadedFile && (
                      <p className="text-sm text-gray-600 text-center mt-4">
                        فایل انتخاب شده: {uploadedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Words Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">لغات</h2>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => setShowWordBank(true)}
                    className="btn-secondary text-sm py-2 px-4 flex items-center"
                  >
                    <Database className="w-5 h-5 ml-2" />
                    <span>افزودن از بانک لغات</span>
                  </button>
                  <button
                    onClick={() => setIsAddingWord(true)}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showWordBank && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    افزودن از بانک لغات
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">تعداد لغات</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={randomWordCount}
                        onChange={(e) =>
                          setRandomWordCount(Number(e.target.value))
                        }
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">دسته‌بندی بانک لغات</label>
                      <select
                        value={selectedWordBankCategory}
                        onChange={(e) =>
                          setSelectedWordBankCategory(Number(e.target.value))
                        }
                        className="form-input"
                      >
                        <option value={0}>همه دسته‌بندی‌ها</option>
                        {wordBankCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleGetRandomWords}
                      disabled={isLoadingRandom}
                      className="btn-primary"
                    >
                      {isLoadingRandom
                        ? "در حال دریافت..."
                        : "دریافت لغات تصادفی"}
                    </button>
                  </div>

                  {randomWords.length > 0 && (
                    <>
                      <div className="space-y-2 mb-4">
                        {randomWords.map((word) => (
                          <div
                            key={word.id}
                            className={`
                              flex items-center justify-between p-3 rounded-lg cursor-pointer
                              ${
                                selectedRandomWords.has(word.id!)
                                  ? "bg-primary-100"
                                  : "bg-white"
                              }
                              hover:bg-primary-50 transition-colors
                            `}
                            onClick={() => handleToggleRandomWord(word.id!)}
                          >
                            <div>
                              <span className="font-medium">{word.word}</span>
                              <span className="text-gray-600 mx-2">-</span>
                              <span>{word.translation}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedRandomWords.has(word.id!)}
                              onChange={() => handleToggleRandomWord(word.id!)}
                              className="form-checkbox h-5 w-5 text-primary-600"
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="form-label">
                          افزودن به دسته‌بندی
                        </label>
                        <select
                          value={newWord.categoryId}
                          onChange={(e) =>
                            setNewWord({
                              ...newWord,
                              categoryId: Number(e.target.value),
                            })
                          }
                          className="form-input mb-4"
                        >
                          <option value={0}>انتخاب دسته‌بندی</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-end space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            setShowWordBank(false);
                            setRandomWords([]);
                            setSelectedRandomWords(new Set());
                          }}
                          className="btn-outline"
                        >
                          انصراف
                        </button>
                        <button
                          onClick={handleAddSelectedWords}
                          disabled={
                            selectedRandomWords.size === 0 ||
                            !newWord.categoryId
                          }
                          className="btn-primary"
                        >
                          افزودن {selectedRandomWords.size} لغت
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {(isAddingWord || editingWord) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">لغت</label>
                      <input
                        type="text"
                        value={newWord.word}
                        onChange={(e) =>
                          setNewWord({ ...newWord, word: e.target.value })
                        }
                        placeholder="لغت به زبان اصلی"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">ترجمه</label>
                      <input
                        type="text"
                        value={newWord.translation}
                        onChange={(e) =>
                          setNewWord({
                            ...newWord,
                            translation: e.target.value,
                          })
                        }
                        placeholder="ترجمه فارسی"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">کاربرد</label>
                    <input
                      type="text"
                      value={newWord.usage}
                      onChange={(e) =>
                        setNewWord({ ...newWord, usage: e.target.value })
                      }
                      placeholder="مثال کاربردی"
                      className="form-input"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">دسته‌بندی</label>
                    <select
                      value={newWord.categoryId}
                      onChange={(e) =>
                        setNewWord({
                          ...newWord,
                          categoryId: Number(e.target.value),
                        })
                      }
                      className="form-input"
                    >
                      <option value={0}>انتخاب دسته‌بندی</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={() => {
                        setIsAddingWord(false);
                        setEditingWord(null);
                        setNewWord({
                          word: "",
                          translation: "",
                          usage: "",
                          categoryId: 0,
                        });
                      }}
                      className="btn-outline text-sm py-1 px-3"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={editingWord ? handleUpdateWord : handleAddWord}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      {editingWord ? "ذخیره" : "افزودن"}
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4">لغت</th>
                      <th className="text-right py-3 px-4">ترجمه</th>
                      <th className="text-right py-3 px-4 hidden md:table-cell">
                        کاربرد
                      </th>
                      <th className="text-right py-3 px-4 hidden md:table-cell">
                        دسته‌بندی
                      </th>
                      <th className="text-right py-3 px-4">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {words.map((word) => (
                      <tr
                        key={word.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{word.word}</td>
                        <td className="py-3 px-4">{word.translation}</td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {word.usage}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {
                            categories.find((c) => c.id === word.categoryId)
                              ?.title
                          }
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => {
                                setEditingWord(word);
                                setNewWord({
                                  word: word.word,
                                  translation: word.translation,
                                  usage: word.usage,
                                  categoryId: word.categoryId,
                                });
                              }}
                              className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWord(word.id!)}
                              className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      نمایش {(currentPage - 1) * ITEMS_PER_PAGE + 1} تا{" "}
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalWords)} از{" "}
                      {totalWords} لغت
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-outline text-sm py-1 px-2 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700">
                      صفحه {currentPage} از {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="btn-outline text-sm py-1 px-2 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordsPage;
