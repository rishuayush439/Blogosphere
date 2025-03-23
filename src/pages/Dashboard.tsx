
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { blogs, userBlogs, isLoading } = useBlog();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Get unique categories
  const categories = [...new Set(blogs.map((blog) => blog.category))];

  // Filter blogs based on search term and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter && categoryFilter !== "all-categories" ? blog.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  // Filter user's blogs
  const filteredUserBlogs = userBlogs.filter((blog) => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter && categoryFilter !== "all-categories" ? blog.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <motion.h1 
            className="heading-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "my" ? "My Blogs" : "All Blogs"}
          </motion.h1>
          
          {isAuthenticated && (
            <Button onClick={() => navigate("/editor")}>
              <PenSquare className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          )}
        </div>
        
        <div className="mb-8">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger value="my">My Posts</TabsTrigger>
                )}
              </TabsList>
              
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search blogs..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all">
              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="heading-sm mb-2">No posts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter
                      ? "Try adjusting your search or filter criteria"
                      : "There are no blog posts available right now"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="my">
              {!isAuthenticated ? (
                <div className="text-center py-16">
                  <h3 className="heading-sm mb-2">Sign in to view your posts</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to be signed in to access your blog posts
                  </p>
                  <Button onClick={() => navigate("/auth")}>Sign In</Button>
                </div>
              ) : filteredUserBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUserBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="heading-sm mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't created any blog posts yet"}
                  </p>
                  <Button onClick={() => navigate("/editor")}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Create Your First Post
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
