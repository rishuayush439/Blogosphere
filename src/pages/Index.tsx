
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "@/context/BlogContext";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PenSquare } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { blogs, fetchBlogs, isLoading } = useBlog();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);
  
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const recentBlogs = blogs.length > 1 ? blogs.slice(1) : [];
  
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-10 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-xl mb-4 md:mb-6">
              A Minimal Blog for Maximum Impact
            </h1>
            <p className="body-lg text-muted-foreground mb-8 md:mb-10">
              Share your ideas with elegant simplicity. Write, read, and connect in a
              space designed for clarity and focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button asChild size="lg">
                  <Link to="/editor">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Start Writing
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link to="/auth">
                    Get Started
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">
                  Explore Posts
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Post */}
      {featuredBlog && (
        <section className="py-10 bg-accent/30">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <h2 className="heading-lg">Featured Post</h2>
              <Link to="/dashboard" className="link-primary">
                View all posts
              </Link>
            </div>
            
            <BlogCard blog={featuredBlog} variant="featured" />
          </div>
        </section>
      )}
      
      {/* Recent Posts */}
      {recentBlogs.length > 0 && (
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <h2 className="heading-lg">Recent Posts</h2>
              <Link to="/dashboard" className="link-primary">
                View all posts
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {blogs.length === 0 && !isLoading && (
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center py-16 max-w-lg mx-auto">
              <h2 className="heading-lg mb-4">No blog posts yet</h2>
              <p className="text-muted-foreground mb-8">
                Be the first to create a blog post and share your ideas with the world.
              </p>
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/editor">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Create your first post
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth">
                    Sign in to write
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
