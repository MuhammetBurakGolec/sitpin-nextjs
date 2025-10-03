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
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Category } from '../types';
import { Settings, Trash2 } from 'lucide-react';

interface ManageCategoriesDialogProps {
  categories: Category[];
  onAdd: (category: { name: string; color: string }) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16' // lime
];

export function ManageCategoriesDialog({
  categories,
  onAdd,
  onDelete
}: ManageCategoriesDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      color: selectedColor
    });

    setName('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Settings className='mr-2 h-4 w-4' />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Add new category */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='category-name'>Category Name</Label>
              <Input
                id='category-name'
                placeholder='Enter category name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label>Color</Label>
              <div className='flex gap-2'>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type='button'
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor === color
                        ? 'border-foreground'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <Button type='submit' className='w-full'>
              <Icons.add className='mr-2 h-4 w-4' />
              Add Category
            </Button>
          </form>

          {/* Existing categories */}
          <div className='space-y-2'>
            <Label>Existing Categories</Label>
            <div className='max-h-48 space-y-2 overflow-y-auto'>
              {categories.length === 0 ? (
                <p className='text-muted-foreground text-sm'>
                  No categories yet.
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className='flex items-center justify-between rounded border p-2'
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-4 w-4 rounded-full'
                        style={{ backgroundColor: category.color }}
                      />
                      <span className='text-sm'>{category.name}</span>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDelete(category.id)}
                      className='text-destructive hover:text-destructive h-8 w-8 p-0'
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
