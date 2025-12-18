import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, Music, FileText, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCommunities } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { usePostDraft } from '@/hooks/usePostDraft';
import { validateMedia } from '@/utils/mediaValidation';
import { MarkdownEditor } from '@/components/post/MarkdownEditor';

type PostType = 'text' | 'image' | 'video' | 'audio';

const postTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'audio', label: 'Audio', icon: Music },
] as const;

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { draft, updateField, clearDraft } = usePostDraft();
  const [postType, setPostType] = useState<PostType>(draft.postType);
  const [formData, setFormData] = useState({
    title: draft.title,
    content: draft.content,
    community: draft.communityId ?? '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const selectedCommunity = mockCommunities.find(c => c.id === formData.community);

  useEffect(() => {
    updateField('title', formData.title);
    updateField('content', formData.content);
    updateField('postType', postType);
    updateField('communityId', formData.community || null);
  }, [formData.title, formData.content, formData.community, postType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = validateMedia(file, postType === 'image' ? 'image' : postType === 'video' ? 'video' : 'audio');
      if (!result.valid) {
        toast({ title: 'Invalid media', description: result.error, variant: 'destructive' });
        return;
      }
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Please enter a title', variant: 'destructive' });
      return;
    }

    if (formData.title.trim().length < 5) {
      toast({ title: 'Title too short', description: 'Titles should be at least 5 characters.', variant: 'destructive' });
      return;
    }

    if (!formData.community) {
      toast({ title: 'Error', description: 'Please select a community', variant: 'destructive' });
      return;
    }

    // Simple community rule awareness (example: require spoiler mention if rules mention spoilers)
    if (selectedCommunity?.rules?.some(rule => rule.toLowerCase().includes('spoiler'))) {
      const hasSpoilerTag = /\[spoiler\]|>!.*!</i.test(formData.content);
      if (!hasSpoilerTag) {
        toast({
          title: 'Spoiler rules',
          description: 'This community requires spoiler tags. Please use [spoiler] or >!spoiler!< syntax if needed.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({ title: 'Success!', description: 'Your post has been created.' });
    clearDraft();
    navigate('/');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">
        <span className="gradient-text">Create Post</span>
      </h1>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">What do you want to share?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type Selector */}
            <div className="flex gap-2 p-1 bg-secondary rounded-lg">
              {postTypes.map((type) => (
                <Button
                  key={type.id}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "flex-1 gap-2",
                    postType === type.id && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => setPostType(type.id)}
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Community Selector */}
            <div className="space-y-2">
              <Label>Community</Label>
              <Select
                value={formData.community}
                onValueChange={(value) => setFormData({ ...formData, community: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  {mockCommunities.map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      <span className="flex items-center gap-2">
                        <span>{community.icon}</span>
                        {community.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="An interesting title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.title.length}/300
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                {postType === 'text' ? 'Content' : 'Description (optional)'}
              </Label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
            </div>

            {/* Media Upload */}
            {postType !== 'text' && (
              <div className="space-y-2">
                <Label>
                  {postType === 'image' && 'Upload Image'}
                  {postType === 'video' && 'Upload Video'}
                  {postType === 'audio' && 'Upload Audio'}
                </Label>
                
                {mediaPreview ? (
                  <div className="relative rounded-lg overflow-hidden bg-secondary">
                    {postType === 'image' && (
                      <img src={mediaPreview} alt="Preview" className="w-full max-h-96 object-contain" />
                    )}
                    {postType === 'video' && (
                      <video src={mediaPreview} controls className="w-full max-h-96" />
                    )}
                    {postType === 'audio' && (
                      <div className="p-8 flex items-center justify-center">
                        <audio src={mediaPreview} controls className="w-full" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {postType === 'image' && 'PNG, JPG, GIF up to 10MB'}
                      {postType === 'video' && 'MP4, WebM up to 100MB'}
                      {postType === 'audio' && 'MP3, WAV up to 20MB'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept={
                        postType === 'image' ? 'image/*' :
                        postType === 'video' ? 'video/*' :
                        'audio/*'
                      }
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Community Rules */}
            {selectedCommunity?.rules && (
              <div className="rounded-lg border border-border bg-secondary/10 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground text-sm">Community rules</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {selectedCommunity.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
