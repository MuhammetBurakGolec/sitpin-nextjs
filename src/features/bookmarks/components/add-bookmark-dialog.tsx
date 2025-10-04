'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { Category } from '../types';

interface AddBookmarkDialogProps {
  categories: Category[];
  onAdd: (bookmark: {
    title: string;
    url: string;
    description?: string;
    categoryId?: string;
  }) => void;
}

export function AddBookmarkDialog({
  categories,
  onAdd
}: AddBookmarkDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onAdd({
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      categoryId: categoryId === 'none' ? undefined : categoryId || undefined
    });

    // Reset form
    setTitle('');
    setUrl('');
    setDescription('');
    setCategoryId('');
    setOpen(false);
  };

  const fetchTitleFromUrl = async () => {
    if (!url.trim()) return;

    try {
      // In a real app, you'd call your API to fetch the title
      // For now, we'll extract domain name as fallback
      const domain = new URL(url).hostname.replace('www.', '');
      if (!title.trim()) {
        setTitle(domain);
      }
    } catch (error) {
      console.error('Invalid URL');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.add className='mr-2 h-4 w-4' />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='url'>URL *</Label>
            <div className='flex gap-2'>
              <Input
                id='url'
                type='url'
                placeholder='https://example.com'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={fetchTitleFromUrl}
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='title'>Title *</Label>
            <Input
              id='title'
              placeholder='Website title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              placeholder='Optional description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>Add Bookmark</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
