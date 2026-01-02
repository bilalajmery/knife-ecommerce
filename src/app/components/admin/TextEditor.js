"use client";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function TextEditor({ value, onChange, placeholder, label }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'clean'],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent',
        'link',
    ];

    return (
        <div className="space-y-2">
            {label && <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}
            <div className="bg-white text-black rounded-xl overflow-hidden">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="h-48 mb-12" // mb-12 to account for toolbar height
                />
            </div>
        </div>
    );
}
