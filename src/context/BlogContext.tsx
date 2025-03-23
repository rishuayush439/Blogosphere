import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  tags: string[];
  category: string;
  likes: number;
  comments: Comment[];
  readingTime: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
}

interface BlogContextType {
  blogs: Blog[];
  fetchBlogs: () => Promise<void>;
  getBlog: (id: string) => Blog | undefined;
  createBlog: (blog: Partial<Blog>) => Promise<Blog>;
  updateBlog: (id: string, blog: Partial<Blog>) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  likeBlog: (id: string) => Promise<void>;
  addComment: (blogId: string, content: string) => Promise<void>;
  isLoading: boolean;
  userBlogs: Blog[];
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Sample blog data
const INITIAL_BLOGS: Blog[] = [
  {
    id: "1",
    title: "The Art of Minimalist Design",
    content: `<p>In the world of design, minimalism has emerged as more than just a trend; it's a philosophy that champions the idea that less is more. This approach prioritizes simplicity, clarity, and functionality without sacrificing elegance or impact.</p><h2>Principles of Minimalist Design</h2><p>At its core, minimalist design embraces several key principles:</p><ul><li><strong>Simplicity:</strong> Stripping away unnecessary elements to focus on what truly matters.</li><li><strong>Intentionality:</strong> Every element must serve a purpose.</li><li><strong>Negative Space:</strong> Using emptiness as a design element itself.</li><li><strong>Limited Color Palette:</strong> Typically restricting to 1-3 primary colors.</li><li><strong>Typography Focus:</strong> Clean, legible typefaces that enhance readability.</li></ul><p>By embracing these principles, designers create work that feels both timeless and contemporary – never overburdened by excessive decoration or trendy elements that quickly become dated.</p><h2>The Impact of White Space</h2><p>Perhaps the most powerful tool in minimalist design is white space (or negative space). Far from being 'empty' or 'wasted' space, these breathing areas create rhythm, hierarchy, and balance within a composition.</p><p>Strategic use of white space:</p><ul><li>Improves readability and comprehension</li><li>Creates visual hierarchy and guides the eye</li><li>Conveys a sense of sophistication and elegance</li><li>Reduces cognitive load for the viewer</li></ul><p>As the legendary designer Dieter Rams once said: "Less, but better." This philosophy continues to influence modern design across all mediums, from physical products to digital interfaces.</p>`,
    excerpt: "Exploring the philosophy and implementation of minimalist design principles across various mediums and contexts.",
    coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    published: true,
    createdAt: "2023-11-15T10:30:00Z",
    updatedAt: "2023-11-15T10:30:00Z",
    authorId: "1",
    authorName: "Jane Doe",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["Design", "Minimalism", "UX/UI"],
    category: "Design",
    likes: 42,
    comments: [
      {
        id: "c1",
        content: "This article perfectly captures why I love minimalist design. Great insights!",
        authorId: "2",
        authorName: "John Smith",
        authorImage: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        createdAt: "2023-11-16T14:25:00Z"
      }
    ],
    readingTime: 5
  },
  {
    id: "2",
    title: "Understanding Modern Typography",
    content: `<p>Typography is both an art and a science. It involves the careful selection, arrangement, and styling of type to make written language legible, readable, and visually appealing.</p><h2>The Elements of Typography</h2><p>Typography encompasses several key elements:</p><ul><li><strong>Typefaces and Fonts:</strong> The design of letters and characters.</li><li><strong>Hierarchy:</strong> Visual organization of type to indicate importance.</li><li><strong>Spacing:</strong> The management of space between letters, words, and lines.</li><li><strong>Size and Scale:</strong> The dimensions of type and their proportional relationships.</li><li><strong>Color and Contrast:</strong> How type appears against its background.</li></ul><p>When these elements come together harmoniously, they create a typographic system that guides readers through content effortlessly.</p><h2>Type Classification</h2><p>Typography has a rich history, and over centuries, various styles have emerged:</p><ul><li><strong>Serif:</strong> These typefaces have small decorative lines at the ends of characters. Examples include Times New Roman and Georgia.</li><li><strong>Sans-serif:</strong> Clean typefaces without decorative lines. Examples include Helvetica and Arial.</li><li><strong>Display:</strong> Designed for headlines and large-format use.</li><li><strong>Script:</strong> Mimics handwriting or calligraphy.</li><li><strong>Monospace:</strong> Each character occupies the same width (often used for code).</li></ul><p>Understanding these classifications helps designers make informed choices that align with their project's goals and aesthetic requirements.</p>`,
    excerpt: "Delving into the principles of typography, its historical evolution, and its critical role in effective communication design.",
    coverImage: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    published: true,
    createdAt: "2023-11-18T09:45:00Z",
    updatedAt: "2023-11-19T11:20:00Z",
    authorId: "1",
    authorName: "Jane Doe",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["Typography", "Design", "Communication"],
    category: "Design",
    likes: 28,
    comments: [],
    readingTime: 6
  },
  {
    id: "3",
    title: "The Psychology of Color in Web Design",
    content: `<p>Color is one of the most powerful tools in a designer's arsenal. It can influence mood, evoke emotions, and guide user behavior in profound ways.</p><h2>Color Perception and Psychology</h2><p>Human perception of color is influenced by both biological factors and cultural associations:</p><ul><li><strong>Red:</strong> Associated with energy, passion, and urgency. Can increase heart rate and create a sense of immediacy.</li><li><strong>Blue:</strong> Evokes feelings of trust, security, and stability. Often used by financial institutions and technology companies.</li><li><strong>Yellow:</strong> Represents optimism, clarity, and warmth. Captures attention but can cause eye fatigue when overused.</li><li><strong>Green:</strong> Suggests growth, harmony, and environmental consciousness. Creates a sense of balance and restoration.</li><li><strong>Purple:</strong> Historically linked to royalty and luxury. Communicates creativity and wisdom.</li></ul><p>These associations, while somewhat universal, can vary significantly across cultures and contexts.</p><h2>Strategic Use of Color in Web Design</h2><p>Effective color implementation in web design considers:</p><ul><li><strong>Brand Identity:</strong> Colors should align with and reinforce brand values and personality.</li><li><strong>User Experience:</strong> Color helps users navigate interfaces and understand interactive elements.</li><li><strong>Accessibility:</strong> Color combinations must maintain sufficient contrast for all users, including those with color vision deficiencies.</li><li><strong>Emotional Response:</strong> Strategic color choices can evoke specific emotional reactions that align with content goals.</li></ul><p>A thoughtful color strategy doesn't merely make a website visually appealing—it enhances functionality, reinforces messaging, and creates meaningful connections with users.</p>`,
    excerpt: "Exploring how color choices in digital design influence user perception, behavior, and emotional responses.",
    coverImage: "https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    published: true,
    createdAt: "2023-11-22T15:10:00Z",
    updatedAt: "2023-11-23T08:30:00Z",
    authorId: "2",
    authorName: "John Smith",
    authorImage: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["Design", "Psychology", "Web Design", "Color Theory"],
    category: "Design",
    likes: 35,
    comments: [
      {
        id: "c2",
        content: "I've always been fascinated by how color influences our decisions online. Great analysis!",
        authorId: "1",
        authorName: "Jane Doe",
        authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        createdAt: "2023-11-23T17:45:00Z"
      }
    ],
    readingTime: 7
  }
];

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Load blogs from localStorage or use initial data
        const savedBlogs = localStorage.getItem("blogs");
        if (savedBlogs) {
          setBlogs(JSON.parse(savedBlogs));
        } else {
          setBlogs(INITIAL_BLOGS);
          localStorage.setItem("blogs", JSON.stringify(INITIAL_BLOGS));
        }
        setIsLoading(false);
        resolve();
      }, 800);
    });
  };

  const getBlog = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  const createBlog = async (blogData: Partial<Blog>) => {
    if (!user) {
      throw new Error("You must be logged in to create a blog");
    }
    
    const newBlog: Blog = {
      id: Math.random().toString(36).substring(2, 9),
      title: blogData.title || "Untitled",
      content: blogData.content || "",
      excerpt: blogData.excerpt || "",
      coverImage: blogData.coverImage || "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      published: blogData.published || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      authorImage: user.image,
      tags: blogData.tags || [],
      category: blogData.category || "Uncategorized",
      likes: 0,
      comments: [],
      readingTime: blogData.content ? Math.ceil(blogData.content.split(" ").length / 200) : 1
    };
    
    setBlogs(prevBlogs => {
      const updatedBlogs = [...prevBlogs, newBlog];
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
    
    return newBlog;
  };

  const updateBlog = async (id: string, blogData: Partial<Blog>) => {
    if (!user) {
      throw new Error("You must be logged in to update a blog");
    }
    
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    
    if (blogIndex === -1) {
      throw new Error("Blog not found");
    }
    
    const blog = blogs[blogIndex];
    
    if (blog.authorId !== user.id) {
      throw new Error("You can only update your own blogs");
    }
    
    const updatedBlog: Blog = {
      ...blog,
      ...blogData,
      updatedAt: new Date().toISOString(),
      readingTime: blogData.content ? Math.ceil(blogData.content.split(" ").length / 200) : blog.readingTime
    };
    
    setBlogs(prevBlogs => {
      const updated = [...prevBlogs];
      updated[blogIndex] = updatedBlog;
      localStorage.setItem("blogs", JSON.stringify(updated));
      return updated;
    });
    
    return updatedBlog;
  };

  const deleteBlog = async (id: string) => {
    if (!user) {
      throw new Error("You must be logged in to delete a blog");
    }
    
    const blog = blogs.find(blog => blog.id === id);
    
    if (!blog) {
      throw new Error("Blog not found");
    }
    
    if (blog.authorId !== user.id) {
      throw new Error("You can only delete your own blogs");
    }
    
    setBlogs(prevBlogs => {
      const updated = prevBlogs.filter(blog => blog.id !== id);
      localStorage.setItem("blogs", JSON.stringify(updated));
      return updated;
    });
  };

  const likeBlog = async (id: string) => {
    if (!user) {
      throw new Error("You must be logged in to like a blog");
    }
    
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    
    if (blogIndex === -1) {
      throw new Error("Blog not found");
    }
    
    setBlogs(prevBlogs => {
      const updated = [...prevBlogs];
      updated[blogIndex] = {
        ...updated[blogIndex],
        likes: updated[blogIndex].likes + 1
      };
      localStorage.setItem("blogs", JSON.stringify(updated));
      return updated;
    });
  };

  const addComment = async (blogId: string, content: string) => {
    if (!user) {
      throw new Error("You must be logged in to comment");
    }
    
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) {
      throw new Error("Blog not found");
    }
    
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      authorId: user.id,
      authorName: user.name,
      authorImage: user.image,
      createdAt: new Date().toISOString()
    };
    
    setBlogs(prevBlogs => {
      const updated = [...prevBlogs];
      updated[blogIndex] = {
        ...updated[blogIndex],
        comments: [...updated[blogIndex].comments, newComment]
      };
      localStorage.setItem("blogs", JSON.stringify(updated));
      return updated;
    });
  };

  // Get blogs by the current user
  const userBlogs = user 
    ? blogs.filter(blog => blog.authorId === user.id) 
    : [];

  return (
    <BlogContext.Provider
      value={{
        blogs,
        fetchBlogs,
        getBlog,
        createBlog,
        updateBlog,
        deleteBlog,
        likeBlog,
        addComment,
        isLoading,
        userBlogs
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
