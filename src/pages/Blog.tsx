
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageSquare,
  Share,
  Clock,
  Edit2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlog, likeBlog, addComment, deleteBlog, isLoading, fetchBlogs } = useBlog();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(getBlog(id || ""));
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!blog) {
      fetchBlogs().then(() => {
        const fetchedBlog = getBlog(id || "");
        if (fetchedBlog) {
          setBlog(fetchedBlog);
        } else {
          navigate("/not-found");
        }
      });
    }
  }, [blog, getBlog, id, navigate, fetchBlogs]);

  if (isLoading || !blog) {
    return <BlogSkeleton />;
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this post",
      });
      return;
    }

    try {
      await likeBlog(blog.id);
      setBlog(getBlog(blog.id));
      toast({
        title: "Success",
        description: "You liked this post",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like this post",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment(blog.id, comment);
      setBlog(getBlog(blog.id));
      setComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been published",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied",
            description: "The link has been copied to your clipboard",
          });
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(blog.id);
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post",
        variant: "destructive",
      });
    }
  };

  const isAuthor = user && blog.authorId === user.id;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-blog">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2 mb-6">
              {blog.tags.map((tag) => (
                <span key={tag} className="tag mr-2">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="heading-xl mb-6">{blog.title}</h1>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={blog.authorImage} alt={blog.authorName} />
                  <AvatarFallback className="text-xs">
                    {blog.authorName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{blog.authorName}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {blog.readingTime} min read
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div 
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>

          <div className="flex items-center justify-between py-4 border-t border-b border-border mt-10 mb-10">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleLike}
              >
                <Heart className="h-5 w-5" />
                <span>{blog.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
              >
                <MessageSquare className="h-5 w-5" />
                <span>{blog.comments.length}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleShare}
              >
                <Share className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/editor/${blog.id}`)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div id="comments" className="mt-12">
            <h2 className="heading-md mb-6">Comments ({blog.comments.length})</h2>

            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mb-8">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-4 min-h-[100px]"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !comment.trim()}
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            ) : (
              <div className="bg-muted/40 rounded-lg p-4 mb-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  Sign in to join the conversation
                </p>
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            )}

            {blog.comments.length > 0 ? (
              <div className="space-y-6">
                {blog.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.authorImage}
                          alt={comment.authorName}
                        />
                        <AvatarFallback className="text-xs">
                          {comment.authorName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {comment.authorName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              blog post and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Loading skeleton
const BlogSkeleton = () => (
  <div className="min-h-screen pt-20 pb-16">
    <div className="container-blog">
      <div className="mb-8">
        <Skeleton className="h-8 w-20 mb-6" />
        <Skeleton className="h-6 w-20 mb-6" />
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-12 w-3/4 mb-8" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
        
        <Skeleton className="aspect-[16/9] w-full rounded-lg mb-8" />
        
        <div className="space-y-4 mb-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

export default Blog;
