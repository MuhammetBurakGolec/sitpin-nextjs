'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { BookmarkWithCategory } from '../types';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: BookmarkWithCategory;
  onEdit?: (bookmark: BookmarkWithCategory) => void;
  onDelete?: (id: string) => void;
}

export function BookmarkCard({
  bookmark,
  onEdit,
  onDelete
}: BookmarkCardProps) {
  const handleVisit = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Card className='group transition-shadow hover:shadow-md'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            <div className='flex-shrink-0'>
              {bookmark.favicon || getFaviconUrl(bookmark.url) ? (
                <img
                  src={bookmark.favicon || getFaviconUrl(bookmark.url)!}
                  alt=''
                  className='h-5 w-5 rounded'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Icons.bookmark className='text-muted-foreground h-5 w-5' />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='truncate text-sm font-medium'>{bookmark.title}</h3>
              <p className='text-muted-foreground truncate text-xs'>
                {bookmark.url}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            {onEdit && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onEdit(bookmark)}
                className='h-7 w-7 p-0'
              >
                <Edit className='h-3 w-3' />
              </Button>
            )}
            {onDelete && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDelete(bookmark.id)}
                className='text-destructive hover:text-destructive h-7 w-7 p-0'
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        {bookmark.description && (
          <p className='text-muted-foreground mb-2 line-clamp-1 text-xs'>
            {bookmark.description}
          </p>
        )}
        <div className='flex items-center justify-between gap-2'>
          {bookmark.category && (
            <Badge
              variant='secondary'
              className='px-2 py-0.5 text-xs'
              style={{
                backgroundColor: `${bookmark.category.color}20`,
                color: bookmark.category.color,
                borderColor: `${bookmark.category.color}40`
              }}
            >
              {bookmark.category.name}
            </Badge>
          )}
          <Button
            variant='outline'
            size='sm'
            onClick={handleVisit}
            className='ml-auto h-7 px-2'
          >
            <ExternalLink className='mr-1 h-3 w-3' />
            Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
