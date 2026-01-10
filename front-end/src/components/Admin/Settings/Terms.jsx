"use client"

import { useState, useRef } from "react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export default function Terms() {
  const [isEditing, setIsEditing] = useState(false)
  const [fontSize, setFontSize] = useState("12")
  const contentRef = useRef(null)

  const defaultContent = `• Lorem ipsum dolor sit amet consectetur. Lacus at venenatis gravida vivamus mauris. Quisque mi est vel dis. Donec rhoncus laoreet odio orci sed risus elit accumsan. Mattis ut est tristique amet vitae at aliquet. Ac vel porttitor egestas scelerisque enim quisque senectus. Euismod ultrices vulputate id cras bibendum sollicitudin proin odio bibendum. Velit velit in scelerisque erat etiam rutrum phasellus nunc. Sed lectus sed a at et eget. Nunc purus sed quis at risus. Consectetur nibh justo proin placerat condimentum id at adipiscing.

• Vel blandit mi nulla sodales consectetur. Egestas tristique ultrices gravida duis nisl odio. Posuere curabitur eu platea pellentesque ut. Facilisi elementum neque mauris facilisis in. Cursus condimentum ipsum pretium consequat turpis at porttitor nisl.

• Scelerisque tellus praesent condimentum quismod a faucibus. Auctor at ultricies at urna aliquam massa pellentesque. Vitae vulputate nullam diam placerat m.`

  const [content, setContent] = useState(defaultContent)

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const applyFormat = (command, value) => {
    if (contentRef.current && isEditing) {
      document.execCommand(command, false, value)
      contentRef.current.focus()
    }
  }

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value
    setFontSize(newSize)
    applyFormat("fontSize", newSize)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with title and edit button */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-lg font-medium pb-2 border-b-2 text-[#0096ff] border-[#0096ff]">Terms And Condition</h1>
          </div>

          <button
            onClick={handleEdit}
            className="px-6 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Formatting toolbar - only visible when editing */}
        {isEditing && (
          <div className="flex items-center space-x-2 mb-4 p-2 border border-gray-300 rounded bg-gray-50">
            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
            </select>

            <div className="w-px h-6 bg-gray-300" />

            <button onClick={() => applyFormat("bold")} className="p-1 hover:bg-gray-200 rounded" title="Bold">
              <Bold size={16} />
            </button>

            <button onClick={() => applyFormat("italic")} className="p-1 hover:bg-gray-200 rounded" title="Italic">
              <Italic size={16} />
            </button>

            <button
              onClick={() => applyFormat("underline")}
              className="p-1 hover:bg-gray-200 rounded"
              title="Underline"
            >
              <Underline size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={() => applyFormat("justifyLeft")}
              className="p-1 hover:bg-gray-200 rounded"
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>

            <button
              onClick={() => applyFormat("justifyCenter")}
              className="p-1 hover:bg-gray-200 rounded"
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>

            <button
              onClick={() => applyFormat("justifyRight")}
              className="p-1 hover:bg-gray-200 rounded"
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="bg-white">
          {isEditing ? (
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[400px] p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0096ff] text-gray-800 leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }}
              onBlur={(e) => setContent(e.currentTarget.innerHTML.replace(/<br>/g, "\n"))}
            />
          ) : (
            <div className="text-gray-800 leading-relaxed space-y-4">
              {content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
