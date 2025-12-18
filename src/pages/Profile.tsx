import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import PostCard from '@/components/post/PostCard';
import { mockUsers, mockPosts } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const user = mockUsers.find(u => u.username === username) || mockUsers[0];
  const userPosts = mockPosts.filter(p => p.author.id === user.id);
  const savedPosts = mockPosts.filter(p => p.isSaved);
  const isOwnProfile = currentUser?.username === user.username;

  return (
    <div className="animate-fade-in -mx-4 -mt-6">
      {/* Banner */}
      <div className="relative h-32 md:h-48 bg-gradient-to-r from-[color-mix(in_srgb,var(--accent-primary)30%,transparent)] via-[color-mix(in_srgb,var(--accent-emotion)30%,transparent)] to-[color-mix(in_srgb,var(--accent-secondary)30%,transparent)]">
        {user.banner && (
          <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-16 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-4xl">{user.username[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
            {user.bio && <p className="text-muted-foreground mt-1">{user.bio}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{user.karma.toLocaleString()}</span> karma
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {format(new Date(user.createdAt), 'MMM yyyy')}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <Link to="/settings">
              <Button variant="outline" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Content */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-secondary/50 mb-4">
            <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="saved">Saved ({savedPosts.length})</TabsTrigger>}
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No posts yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isOwnProfile && (
            <TabsContent value="saved" className="space-y-4">
              {savedPosts.length > 0 ? (
                savedPosts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <Card className="border-border bg-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No saved posts.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="about">
            <Card className="border-border bg-card">
              <CardContent className="py-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Bio</h3>
                    <p className="text-muted-foreground">{user.bio || 'No bio yet.'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Member Since</h3>
                    <p className="text-muted-foreground">{format(new Date(user.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
