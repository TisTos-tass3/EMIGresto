import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex justify-between items-center mt-4 border-t pt-2">
    <span>Page {currentPage} / {totalPages}</span>
    <div className="flex gap-2">
      <button
        onClick={()=>setCurrentPage(p=>Math.max(p-1,1))}
        disabled={currentPage===1}
        className={`px-3 py-1 rounded ${currentPage===1?'bg-gray-300':'bg-gray-200'}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))}
        disabled={currentPage===totalPages}
        className={`px-3 py-1 rounded ${currentPage===totalPages?'bg-gray-300':'bg-gray-200'}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
)

export default Pagination
