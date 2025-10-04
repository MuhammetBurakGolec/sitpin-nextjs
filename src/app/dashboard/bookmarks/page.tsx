'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { apiService } from '@/lib/api';
import { BookmarkCard } from '@/features/bookmarks/components/bookmark-card';
import { AddBookmarkDialog } from '@/features/bookmarks/components/add-bookmark-dialog';
import { CategoryFilter } from '@/features/bookmarks/components/category-filter';
import { ManageCategoriesDialog } from '@/features/bookmarks/components/manage-categories-dialog';
import { EditBookmarkDialog } from '@/features/bookmarks/components/edit-bookmark-dialog';
import { BookmarkWithCategory, Category } from '@/features/bookmarks/types';
import { Search } from 'lucide-react';

// Mock data - In real app, this would come from your database
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Work',
    color: '#3b82f6',
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Personal',
    color: '#10b981',
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Dev Tools',
    color: '#f59e0b',
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockBookmarks: BookmarkWithCategory[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Code repository and collaboration platform',
    categoryId: '3',
    category: mockCategories[2],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Google',
    url: 'https://google.com',
    description: 'Search engine',
    categoryId: '1',
    category: mockCategories[0],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'YouTube',
    url: 'https://youtube.com',
    description: 'Video sharing platform',
    categoryId: '2',
    category: mockCategories[1],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: 'Programming Q&A community',
    categoryId: '3',
    category: mockCategories[2],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'Netflix',
    url: 'https://netflix.com',
    description: 'Streaming service',
    categoryId: '2',
    category: mockCategories[1],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    description: 'Professional networking',
    categoryId: '1',
    category: mockCategories[0],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    title: 'VS Code',
    url: 'https://code.visualstudio.com',
    description: 'Code editor',
    categoryId: '3',
    category: mockCategories[2],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    title: 'Twitter',
    url: 'https://twitter.com',
    description: 'Social media platform',
    categoryId: '2',
    category: mockCategories[1],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    title: 'Figma',
    url: 'https://figma.com',
    description: 'Design collaboration tool',
    categoryId: '3',
    category: mockCategories[2],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    title: 'Notion',
    url: 'https://notion.so',
    description: 'All-in-one workspace',
    categoryId: '1',
    category: mockCategories[0],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function BookmarksPage() {
  const { getToken } = useAuth();
  const [bookmarks, setBookmarks] =
    useState<BookmarkWithCategory[]>(mockBookmarks);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] =
    useState<BookmarkWithCategory | null>(null);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || bookmark.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [bookmarks, searchQuery, selectedCategory]);

  const handleAddBookmark = async (newBookmark: {
    title: string;
    url: string;
    description?: string;
    categoryId?: string;
  }) => {
    try {
      // Try to use external API first
      const token = await getToken();
      const response = await apiService.createBookmark(
        newBookmark,
        token || undefined
      );

      if (response.success) {
        setBookmarks((prev) => [response.data, ...prev]);
        return;
      }
    } catch (error) {
      console.warn('External API failed, using local storage:', error);
    }

    // Fallback to local mock data
    const bookmark: BookmarkWithCategory = {
      id: Date.now().toString(),
      ...newBookmark,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: newBookmark.categoryId
        ? categories.find((c) => c.id === newBookmark.categoryId)
        : undefined
    };

    setBookmarks((prev) => [bookmark, ...prev]);
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      // Try to use external API first
      const token = await getToken();
      const response = await apiService.deleteBookmark(id, token || undefined);

      if (response.success) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        return;
      }
    } catch (error) {
      console.warn('External API failed, using local storage:', error);
    }

    // Fallback to local mock data
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddCategory = async (newCategory: {
    name: string;
    color: string;
  }) => {
    try {
      // Try to use external API first
      const token = await getToken();
      const response = await apiService.createCategory(
        newCategory,
        token || undefined
      );

      if (response.success) {
        setCategories((prev) => [...prev, response.data]);
        return;
      }
    } catch (error) {
      console.warn('External API failed, using local storage:', error);
    }

    // Fallback to local mock data
    const category: Category = {
      id: Date.now().toString(),
      ...newCategory,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCategories((prev) => [...prev, category]);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // Try to use external API first
      const token = await getToken();
      const response = await apiService.deleteCategory(id, token || undefined);

      if (response.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        // Remove category from bookmarks
        setBookmarks((prev) =>
          prev.map((bookmark) =>
            bookmark.categoryId === id
              ? { ...bookmark, categoryId: undefined, category: undefined }
              : bookmark
          )
        );
        // Reset filter if deleted category was selected
        if (selectedCategory === id) {
          setSelectedCategory(null);
        }
        return;
      }
    } catch (error) {
      console.warn('External API failed, using local storage:', error);
    }

    // Fallback to local mock data
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Remove category from bookmarks
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.categoryId === id
          ? { ...bookmark, categoryId: undefined, category: undefined }
          : bookmark
      )
    );
    // Reset filter if deleted category was selected
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
  };

  const handleEditBookmark = (bookmark: BookmarkWithCategory) => {
    setEditingBookmark(bookmark);
  };

  const handleSaveBookmark = async (
    id: string,
    updates: {
      title: string;
      url: string;
      description?: string;
      categoryId?: string;
    }
  ) => {
    try {
      // Try to use external API first
      const token = await getToken();
      const response = await apiService.updateBookmark(
        id,
        updates,
        token || undefined
      );

      if (response.success) {
        setBookmarks((prev) =>
          prev.map((bookmark) =>
            bookmark.id === id ? response.data : bookmark
          )
        );
        return;
      }
    } catch (error) {
      console.warn('External API failed, using local storage:', error);
    }

    // Fallback to local mock data
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === id
          ? {
              ...bookmark,
              ...updates,
              category: updates.categoryId
                ? categories.find((c) => c.id === updates.categoryId)
                : undefined,
              updatedAt: new Date()
            }
          : bookmark
      )
    );
  };

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Bookmarks</h1>
            <p className='text-muted-foreground'>
              Manage your saved websites and links
            </p>
          </div>
          <div className='flex gap-2'>
            <ManageCategoriesDialog
              categories={categories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
            />
            <AddBookmarkDialog
              categories={categories}
              onAdd={handleAddBookmark}
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Search bookmarks...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleEditBookmark}
              onDelete={handleDeleteBookmark}
            />
          ))}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground'>
              {searchQuery || selectedCategory
                ? 'No bookmarks found matching your criteria.'
                : 'No bookmarks yet. Add your first bookmark to get started!'}
            </p>
          </div>
        )}

        <EditBookmarkDialog
          bookmark={editingBookmark}
          categories={categories}
          open={!!editingBookmark}
          onOpenChange={(open) => !open && setEditingBookmark(null)}
          onSave={handleSaveBookmark}
        />
      </div>
    </div>
  );
}
