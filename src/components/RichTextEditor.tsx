import { useRef } from 'react';
import { Bold, Italic, List, Image as ImageIcon } from 'lucide-react';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void; }) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleAddImage = () => {
    const url = prompt("Nhập đường dẫn (URL) ảnh của bạn:");
    if (url) execCommand('insertImage', url);
  };

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-[#0f172a]">
      <div className="flex items-center gap-1 p-2 bg-slate-800 border-b border-slate-700">
        <button type="button" onClick={() => execCommand('bold')} className="p-1.5 text-slate-300 hover:bg-slate-700 rounded"><Bold size={16} /></button>
        <button type="button" onClick={() => execCommand('italic')} className="p-1.5 text-slate-300 hover:bg-slate-700 rounded"><Italic size={16} /></button>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 text-slate-300 hover:bg-slate-700 rounded"><List size={16} /></button>
        <div className="w-px h-4 bg-slate-600 mx-1"></div>
        <button type="button" onClick={handleAddImage} className="p-1.5 text-emerald-400 hover:bg-slate-700 rounded flex items-center gap-1"><ImageIcon size={16} /> <span className="text-xs font-bold">Ảnh</span></button>
      </div>
      <div
        ref={editorRef} contentEditable
        className="min-h-[200px] p-4 text-slate-300 focus:outline-none prose prose-invert prose-sm max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}