
import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  Quote,
  Unlink,
  RotateCcw,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./editor.css";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your story...",
}) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content === "") {
      editor.commands.setContent("");
    }
  }, [editor, content]);

  const addLink = () => {
    if (!linkUrl) return;
    
    editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setLinkUrl("");
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const addImage = () => {
    if (!imageUrl) return;
    
    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="border-b border-border p-2 flex flex-wrap gap-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-secondary" : ""}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-secondary" : ""}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "bg-secondary" : ""}
          aria-label="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-secondary" : ""}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <span className="w-px h-6 bg-border mx-1"></span>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-secondary" : ""}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-secondary" : ""}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-secondary" : ""}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <span className="w-px h-6 bg-border mx-1"></span>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-secondary" : ""}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-secondary" : ""}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <span className="w-px h-6 bg-border mx-1"></span>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={editor.isActive("link") ? "bg-secondary" : ""}
              aria-label="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <Button onClick={addLink}>Add</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {editor.isActive("link") && (
          <Button
            variant="ghost"
            size="icon"
            onClick={removeLink}
            aria-label="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        )}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button onClick={addImage}>Add</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <span className="w-px h-6 bg-border mx-1"></span>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.commands.clearContent()}
          aria-label="Clear Content"
          className="ml-auto"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <EditorContent editor={editor} className="prose-editor p-4 min-h-[300px] max-h-[600px] overflow-y-auto" />
    </div>
  );
};

export default RichTextEditor;
