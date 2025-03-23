
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Blog } from "@/context/BlogContext";
import { Heart, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: Blog;
  variant?: "default" | "featured";
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  variant = "default",
  className,
}) => {
  const { 
    id, 
    title, 
    excerpt, 
    coverImage, 
    createdAt, 
    authorName, 
    authorImage, 
    tags, 
    likes, 
    comments,
    readingTime 
  } = blog;

  const isFeatured = variant === "featured";
  
  return (
    <motion.article 
      className={cn(
        "group h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300",
        isFeatured ? "md:grid md:grid-cols-2 gap-0" : "",
        className
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link 
        to={`/blog/${id}`} 
        className={cn(
          "block overflow-hidden",
          isFeatured ? "relative h-full min-h-[15rem]" : "relative aspect-[16/9]"
        )}
      >
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="tag"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <Link to={`/blog/${id}`}>
            <h2 className={cn(
              "font-serif font-bold tracking-tight leading-tight hover:text-primary/90 transition-colors",
              isFeatured ? "text-2xl md:text-3xl mb-3" : "text-xl mb-2"
            )}>
              {title}
            </h2>
          </Link>
          
          {isFeatured && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <img
              src={authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`}
              alt={authorName}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div>
              <span className="text-xs font-medium">{authorName}</span>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {readingTime} min
            </div>
            <div className="flex items-center text-xs">
              <Heart className="h-3 w-3 mr-1" />
              {likes}
            </div>
            <div className="flex items-center text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              {comments.length}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
