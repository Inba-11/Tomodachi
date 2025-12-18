import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Clock, Bookmark, Plus, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockCommunities } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Flame, label: 'Popular', path: '/feed?sort=popular' },
  { icon: Clock, label: 'Recent', path: '/feed?sort=recent' },
  { icon: TrendingUp, label: 'Trending', path: '/feed?sort=trending' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-4">
          <div className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                    location.pathname === item.path && "bg-sidebar-accent text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="px-3">
            <div className="flex items-center justify-between mb-2 px-3">
              <span className="text-sm font-semibold text-muted-foreground">Communities</span>
              <Link to="/communities">
                <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                  See all
                </Button>
              </Link>
            </div>

            <Link to="/create-community">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground mb-1">
                <Plus className="h-5 w-5" />
                Create Community
              </Button>
            </Link>

            <div className="space-y-1">
              {mockCommunities.slice(0, 6).map((community) => (
                <Link key={community.id} to={`/community/${community.id}`} onClick={onClose}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                      location.pathname === `/community/${community.id}` && "bg-sidebar-accent text-foreground"
                    )}
                  >
                    <span className="text-lg">{community.icon}</span>
                    <span className="truncate">{community.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="px-3">
            <Link to="/communities">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <Users className="h-5 w-5" />
                Browse All Communities
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-muted-foreground">
            <p>© 2024 Tomodachi</p>
            <p className="mt-1">Made with 💜 for anime fans</p>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
