import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

const SearchSortExport = ({ searchTerm, setSearchTerm, setSortBy, exportToPDF }) => {
  const [open, setOpen] = useState(false)
  const cols = ['idEtudiant','nomEtudiant','prenomEtudiant']

  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Rechercher…"
        className="p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={e=>setSearchTerm(e.target.value)}
      />
      <div className="flex gap-2">
        <div className="relative">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded"
            onClick={()=>setOpen(o=>!o)}
          >
            Trier par <ChevronDown className="w-4 h-4" />
          </button>
          {open && (
            <div className="absolute right-0 mt-1 bg-white border rounded shadow-sm z-10">
              {cols.map(c=>(
                <div
                  key={c}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setSortBy(c); setOpen(false) }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={exportToPDF}
        >
          Exporter PDF
        </button>
      </div>
    </div>
  )
}

export default SearchSortExport
