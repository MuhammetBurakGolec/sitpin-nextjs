'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, CalendarDays, Shield, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='space-y-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='space-y-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
            <p className='text-muted-foreground'>
              Please sign in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='space-y-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
          <p className='text-muted-foreground'>Your account information</p>
        </div>

        <div className='max-w-2xl'>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <User className='h-5 w-5' />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* User Info */}
              <div className='flex items-center gap-3'>
                <Avatar className='h-20 w-10'>
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                  />
                  <AvatarFallback className='text-sm'>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='text-lg font-semibold'>
                    {user.fullName || 'Anonymous User'}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    @{user.username || user.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Mail className='text-muted-foreground h-4 w-4' />
                  <span>
                    {user.primaryEmailAddress?.emailAddress || 'No email'}
                  </span>
                  {user.primaryEmailAddress?.verification?.status ===
                    'verified' && (
                    <Badge variant='secondary' className='text-xs'>
                      Verified
                    </Badge>
                  )}
                </div>

                <div className='flex items-center gap-2 text-sm'>
                  <CalendarDays className='text-muted-foreground h-4 w-4' />
                  <span>Joined {formatDate(user.createdAt!)}</span>
                </div>

                <div className='flex items-center gap-2 text-sm'>
                  <Shield className='text-muted-foreground h-4 w-4' />
                  <span>Security: </span>
                  <Badge variant='outline' className='text-xs'>
                    {user.twoFactorEnabled ? '2FA Enabled' : 'Basic'}
                  </Badge>
                </div>
              </div>

              {/* Account Stats */}
              <div className='grid grid-cols-2 gap-4 pt-2'>
                <div className='bg-muted/50 rounded-lg p-3 text-center'>
                  <div className='text-lg font-semibold'>
                    {user.emailAddresses.length}
                  </div>
                  <div className='text-muted-foreground text-xs'>Email(s)</div>
                </div>
                <div className='bg-muted/50 rounded-lg p-3 text-center'>
                  <div className='text-lg font-semibold'>
                    {user.lastSignInAt
                      ? formatDate(user.lastSignInAt)
                      : 'Never'}
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    Last Sign In
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
