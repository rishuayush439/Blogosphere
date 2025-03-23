
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, ArrowLeft, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Blog categories
const CATEGORIES = [
  "Design",
  "Technology",
  "Writing",
  "Marketing",
  "Business",
  "Productivity",
  "Development",
  "Lifestyle",
  "Other",
];

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlog, createBlog, updateBlog } = useBlog();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the editor",
      });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate, toast]);

  // Load blog if editing
  useEffect(() => {
    if (id) {
      const blog = getBlog(id);
      if (blog) {
        // Check if user is the author
        if (user && blog.authorId !== user.id) {
          toast({
            title: "Access denied",
            description: "You can only edit your own blog posts",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setTitle(blog.title);
        setContent(blog.content);
        setCoverImage(blog.coverImage);
        setExcerpt(blog.excerpt);
        setTags(blog.tags.join(", "));
        setCategory(blog.category);
        setPublished(blog.published);
      } else {
        toast({
          title: "Blog not found",
          description: "The blog you are trying to edit does not exist",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  }, [id, getBlog, user, navigate, toast]);

  const handleSave = async (publish = false) => {
    if (!title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!content) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const blogData = {
        title,
        content,
        coverImage:
          coverImage ||
          "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        excerpt: excerpt || title,
        tags: tagArray.length > 0 ? tagArray : ["Uncategorized"],
        category: category || "Other",
        published: publish || published,
      };

      if (id) {
        await updateBlog(id, blogData);
        toast({
          title: "Blog updated",
          description: publish
            ? "Your blog has been published"
            : "Your changes have been saved",
        });
      } else {
        const newBlog = await createBlog(blogData);
        toast({
          title: "Blog created",
          description: publish
            ? "Your blog has been published"
            : "Your blog has been saved as a draft",
        });
        navigate(`/blog/${newBlog.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save your blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-4"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="heading-lg">
              {id ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
          </div>

          <div className="flex gap-2 items-center self-end md:self-auto">
            <div className="flex items-center gap-2 mr-2">
              <Switch
                id="preview-mode"
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <Label htmlFor="preview-mode" className="cursor-pointer">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </div>
              </Label>
            </div>

            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your blog post"
                className="text-xl font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {coverImage && (
                <div className="aspect-[16/9] overflow-hidden rounded-md border border-border mt-2">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              {showPreview ? (
                <div className="border border-border rounded-lg p-4 min-h-[300px] prose max-w-none bg-card">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              ) : (
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your blog post..."
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your blog post"
                className="resize-none h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {published
                  ? "Your blog will be visible to everyone"
                  : "Your blog will be saved as a draft"}
              </p>
            </div>

            {/* Blog preview */}
            {title && (
              <div className="space-y-2 border-t border-border pt-6">
                <Label>Preview</Label>
                <div className={cn(
                  "rounded-lg overflow-hidden border border-border",
                  showPreview ? "opacity-100" : "opacity-70"
                )}>
                  <div className="aspect-[16/9] bg-muted">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        No cover image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">
                      {tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== "")
                        .slice(0, 2)
                        .map((tag, i) => (
                          <span key={i} className="tag">
                            {tag}
                          </span>
                        ))}
                    </div>
                    <h3 className="font-serif font-semibold text-lg mb-1 line-clamp-2">
                      {title || "Untitled Blog Post"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {excerpt || "No excerpt provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
