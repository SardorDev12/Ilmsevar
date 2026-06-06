import React, { useState } from 'react';
import { Book as BookType, Quote, Review } from '../types';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Bookmark, 
  Quote as QuoteIcon, 
  Star, 
  StarHalf, 
  Award, 
  Check, 
  CheckCircle,
  FileText,
  BookmarkCheck
} from 'lucide-react';

interface BookShelfProps {
  books: BookType[];
  quotes: Quote[];
  reviews: Review[];
  onAddBook: (book: Omit<BookType, 'id' | 'userId'>) => void;
  onUpdateProgress: (bookId: string, newPage: number) => void;
  onAddQuote: (bookId: string, quoteText: string, pageNumber?: number) => void;
  onAddReview: (bookId: string, rating: number, reviewText: string) => void;
  onDeleteBook: (bookId: string) => void;
}

export default function BookShelf({
  books,
  quotes,
  reviews,
  onAddBook,
  onUpdateProgress,
  onAddQuote,
  onAddReview,
  onDeleteBook
}: BookShelfProps) {
  // Tabs "books", "quotes", "reviews"
  const [activeSubTab, setActiveSubTab] = useState<'shelf' | 'quotes' | 'reviews'>('shelf');
  const [filter, setFilter] = useState<'All' | 'Reading' | 'Finished'>('All');

  // New book state
  const [showAddBook, setShowAddBook] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTotalPages, setNewTotalPages] = useState(300);

  // Quote input states
  const [targetBookQuote, setTargetBookQuote] = useState<string>('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuotePage, setNewQuotePage] = useState<number | ''>('');

  // Review input states
  const [targetBookReview, setTargetBookReview] = useState<string>('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState<number>(5);

  // Dynamic progress update state
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [tempPageValue, setTempPageValue] = useState<number>(0);

  const filteredBooks = books.filter((b) => {
    if (filter === 'All') return true;
    return b.status === filter;
  });

  const getBookProgressPercentage = (book: BookType) => {
    if (book.totalPages <= 0) return 0;
    const pct = (book.currentPage / book.totalPages) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
  };

  const handleCreateBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || newTotalPages <= 0) return;
    onAddBook({
      title: newTitle,
      author: newAuthor,
      totalPages: newTotalPages,
      currentPage: 0,
      status: 'Reading'
    });
    setNewTitle('');
    setNewAuthor('');
    setNewTotalPages(300);
    setShowAddBook(false);
  };

  const handleUpdateProgressSubmit = (book: BookType) => {
    if (tempPageValue < 0 || tempPageValue > book.totalPages) return;
    onUpdateProgress(book.id, tempPageValue);
    setEditingProgressId(null);
  };

  const handleAddQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBookQuote || !newQuoteText.trim()) return;
    onAddQuote(targetBookQuote, newQuoteText, newQuotePage === '' ? undefined : Number(newQuotePage));
    setNewQuoteText('');
    setNewQuotePage('');
    setTargetBookQuote('');
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBookReview || !newReviewText.trim()) return;
    onAddReview(targetBookReview, newRating, newReviewText);
    setNewReviewText('');
    setNewRating(5);
    setTargetBookReview('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="bookshelf-module-root">
      {/* Header bar */}
      <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-slate-800 text-base leading-tight">Reading Library Module</h3>
            <p className="text-slate-500 text-xs mt-0.5">Track your pages, save memorable quotes, and rate books</p>
          </div>
        </div>

        {/* Mini Tab switcher */}
        <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('shelf')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'shelf' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Shelf
          </button>
          <button
            onClick={() => setActiveSubTab('quotes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'quotes' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Highlights & Quotes
          </button>
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'reviews' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Reviews
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="p-6">
        {activeSubTab === 'shelf' && (
          <div className="space-y-6">
            {/* Shelf Actions and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-1 p-0.5 border border-slate-200 bg-slate-50 rounded-lg">
                {(['All', 'Reading', 'Finished'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      filter === opt ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddBook(!showAddBook)}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Book</span>
              </button>
            </div>

            {/* Create Book Form */}
            {showAddBook && (
              <form onSubmit={handleCreateBookSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Book Title</label>
                    <input
                      required
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                      placeholder="e.g. Range"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Author Name</label>
                    <input
                      required
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                      placeholder="e.g. David Epstein"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Total Pages</label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={newTotalPages}
                      onChange={(e) => setNewTotalPages(Math.max(1, Number(e.target.value)))}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddBook(false)}
                    className="py-1.5 px-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Add Book to Shelf
                  </button>
                </div>
              </form>
            )}

            {/* List books */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBooks.length === 0 ? (
                <div className="col-span-2 border border-dashed border-slate-200 rounded-xl py-10 px-4 text-center">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs font-semibold">No books matching your selection</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Click "Add Book" above to begin tracking reading goals</p>
                </div>
              ) : (
                filteredBooks.map((book) => {
                  const percent = getBookProgressPercentage(book);
                  const isEditingProgress = editingProgressId === book.id;

                  return (
                    <div key={book.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all bg-white shadow-xs">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm leading-snug">{book.title}</h4>
                            <p className="text-slate-500 text-xs">by {book.author}</p>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {book.status === 'Finished' ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                Finished
                              </span>
                            ) : (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide">
                                Reading
                              </span>
                            )}
                            <button
                              onClick={() => onDeleteBook(book.id)}
                              className="text-slate-300 hover:text-red-500 p-0.5 rounded-lg hover:bg-slate-50 transition-colors"
                              title="Delete Book"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="my-3.5">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                            <span>Progress</span>
                            <span className="font-bold text-slate-700">{percent}% ({book.currentPage}/{book.totalPages} p.)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${book.status === 'Finished' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interactive Drawer for Pages */}
                      <div className="border-t border-slate-100/80 pt-3 mt-2 flex flex-wrap gap-2 justify-between items-center">
                        {isEditingProgress ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="number"
                              min={0}
                              max={book.totalPages}
                              value={tempPageValue}
                              onChange={(e) => setTempPageValue(Math.min(book.totalPages, Math.max(0, Number(e.target.value))))}
                              className="w-20 text-xs py-1 px-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-800"
                            />
                            <button
                              onClick={() => handleUpdateProgressSubmit(book)}
                              className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProgressId(null)}
                              className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-md transition-colors text-[10px] px-1.5 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProgressId(book.id);
                              setTempPageValue(book.currentPage);
                            }}
                            className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Bookmark className="w-3 h-3" />
                            <span>Update Progress</span>
                          </button>
                        )}

                        <div className="flex gap-2.5">
                          <button
                            onClick={() => {
                              setTargetBookQuote(book.id);
                              setActiveSubTab('quotes');
                            }}
                            className="text-[11px] text-slate-400 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <QuoteIcon className="w-3 h-3 text-slate-400" />
                            <span>Write Quote</span>
                          </button>
                          <button
                            onClick={() => {
                              setTargetBookReview(book.id);
                              setActiveSubTab('reviews');
                            }}
                            className="text-[11px] text-slate-400 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3 h-3 text-slate-400" />
                            <span>Write Review</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'quotes' && (
          <div className="space-y-6">
            {/* Create Quote Section */}
            <form onSubmit={handleAddQuoteSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <h4 className="font-semibold text-slate-700 text-xs tracking-tight flex items-center gap-1.5">
                <QuoteIcon className="w-4 h-4 text-emerald-500" />
                Save a Mindful Quote
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Select Book</label>
                  <select
                    required
                    value={targetBookQuote}
                    onChange={(e) => setTargetBookQuote(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">-- Choose Book --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Page Number (optional)</label>
                  <input
                    type="number"
                    min={1}
                    value={newQuotePage}
                    onChange={(e) => setNewQuotePage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                    placeholder="e.g. 42"
                  />
                </div>
                <div className="sm:col-span-5">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Quote Passages Text</label>
                  <input
                    required
                    type="text"
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                    placeholder="You fall to the level of your systems..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!targetBookQuote}
                  className="py-1.5 px-4 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Save Quote
                </button>
              </div>
            </form>

            {/* List quotes */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 text-xs tracking-tight">Your Highlithed Quotes Collection</h4>
              
              {quotes.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl py-8 text-center bg-slate-50/50">
                  <QuoteIcon className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-slate-500 text-xs">No quotes saved yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quotes.map((q) => {
                    const book = books.find((b) => b.id === q.bookId);
                    return (
                      <div key={q.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-3 top-3 opacity-15">
                          <QuoteIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-700 italic leading-relaxed z-10 mb-3">
                          "{q.quoteText}"
                        </p>
                        <div className="flex justify-between items-center text-[10px] font-mono border-t border-slate-200/50 pt-2 text-slate-500 mt-2">
                          <span className="font-semibold text-slate-700 truncate max-w-[130px]">{book?.title || 'Unknown Book'}</span>
                          <span>{q.pageNumber ? `page ${q.pageNumber}` : 'General Advice'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'reviews' && (
          <div className="space-y-6">
            {/* Create Review Section */}
            <form onSubmit={handleAddReviewSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <h4 className="font-semibold text-slate-700 text-xs tracking-tight flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Write a Scholar Book Review
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Select Book</label>
                  <select
                    required
                    value={targetBookReview}
                    onChange={(e) => setTargetBookReview(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">-- Choose Book --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Rating Stars</label>
                  <div className="flex gap-1.5 items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-semibold text-slate-500 ml-2">{newRating}/5 Stars</span>
                  </div>
                </div>
                <div className="sm:col-span-12">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Review Details</label>
                  <textarea
                    required
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                    placeholder="Describe what you found interesting about this book, how it impacted your study habit layout..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!targetBookReview}
                  className="py-1.5 px-4 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>

            {/* List reviews */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 text-xs tracking-tight">Your Custom Reviews Diary</h4>
              
              {reviews.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl py-8 text-center bg-slate-50/50">
                  <Star className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-slate-500 text-xs">No reviews catalogued yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => {
                    const book = books.find((b) => b.id === r.bookId);
                    return (
                      <div key={r.id} className="bg-slate-50/70 border border-slate-150 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-slate-800 text-xs leading-none">
                            {book?.title || 'Unknown Title'}
                          </span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{r.reviewText}"
                        </p>
                        <p className="text-[9px] font-mono text-slate-400 mt-2">
                          Posted on {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
