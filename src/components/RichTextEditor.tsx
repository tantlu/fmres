import { useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon, 
  Quote, Undo, Redo, Heading1, Heading2, Minus 
} from 'lucide-react';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void; }) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Logic chống nhảy con trỏ khi gõ (Giữ nguyên từ phiên bản trước)
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        const currentHTML = editorRef.current.innerHTML;
        if (value === '' && (currentHTML === '<br>' || currentHTML === '<div><br></div>')) {
            return; 
        }
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddLink = () => {
    const url = prompt("Nhập đường dẫn (URL):");
    if (url) execCommand('createLink', url);
  };

  const handleAddImage = () => {
    const url = prompt("Nhập đường dẫn (URL) ảnh của bạn:");
    if (url) execCommand('insertImage', url);
  };

  // Component nút bấm nhỏ gọn
  const ToolButton = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: any, title: string }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-[#0f172a] shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-800 border-b border-slate-700">
        
        {/* Nhóm 1: Undo/Redo */}
        <div className="flex gap-0.5 border-r border-slate-600 pr-2 mr-1">
          <ToolButton onClick={() => execCommand('undo')} icon={Undo} title="Hoàn tác" />
          <ToolButton onClick={() => execCommand('redo')} icon={Redo} title="Làm lại" />
        </div>

        {/* Nhóm 2: Headings */}
        <div className="flex gap-0.5 border-r border-slate-600 pr-2 mr-1">
          <ToolButton onClick={() => execCommand('formatBlock', 'H2')} icon={Heading1} title="Tiêu đề lớn" />
          <ToolButton onClick={() => execCommand('formatBlock', 'H3')} icon={Heading2} title="Tiêu đề nhỏ" />
        </div>

        {/* Nhóm 3: Định dạng chữ */}
        <div className="flex gap-0.5 border-r border-slate-600 pr-2 mr-1">
          <ToolButton onClick={() => execCommand('bold')} icon={Bold} title="In đậm" />
          <ToolButton onClick={() => execCommand('italic')} icon={Italic} title="In nghiêng" />
          <ToolButton onClick={() => execCommand('underline')} icon={Underline} title="Gạch chân" />
          <ToolButton onClick={() => execCommand('strikeThrough')} icon={Strikethrough} title="Gạch ngang" />
        </div>

        {/* Nhóm 4: Căn lề */}
        <div className="flex gap-0.5 border-r border-slate-600 pr-2 mr-1">
          <ToolButton onClick={() => execCommand('justifyLeft')} icon={AlignLeft} title="Căn trái" />
          <ToolButton onClick={() => execCommand('justifyCenter')} icon={AlignCenter} title="Căn giữa" />
          <ToolButton onClick={() => execCommand('justifyRight')} icon={AlignRight} title="Căn phải" />
          <ToolButton onClick={() => execCommand('justifyFull')} icon={AlignJustify} title="Căn đều" />
        </div>

        {/* Nhóm 5: Danh sách & Quote */}
        <div className="flex gap-0.5 border-r border-slate-600 pr-2 mr-1">
          <ToolButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Danh sách chấm" />
          <ToolButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Danh sách số" />
          <ToolButton onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')} icon={Quote} title="Trích dẫn" />
          <ToolButton onClick={() => execCommand('insertHorizontalRule')} icon={Minus} title="Đường kẻ ngang" />
        </div>

        {/* Nhóm 6: Media */}
        <div className="flex gap-0.5">
          <button type="button" onClick={handleAddLink} className="p-1.5 text-blue-400 hover:bg-slate-700 rounded flex items-center gap-1" title="Chèn Link">
            <LinkIcon size={16} />
          </button>
          <button type="button" onClick={handleAddImage} className="p-1.5 text-emerald-400 hover:bg-slate-700 rounded flex items-center gap-1" title="Chèn Ảnh">
            <ImageIcon size={16} />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef} 
        contentEditable
        className="min-h-[200px] p-4 text-slate-300 focus:outline-none prose prose-invert prose-sm max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      
      <div className="bg-slate-900/50 p-2 text-[10px] text-slate-500 italic border-t border-slate-800 flex justify-between">
        <span>Mẹo: Bôi đen chữ rồi bấm nút để định dạng.</span>
        <span>Có thể dán ảnh trực tiếp (Ctrl+V)</span>
      </div>
    </div>
  );
}