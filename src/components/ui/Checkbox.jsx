import React from 'react'

const Checkbox = ({ 
  id, 
  checked, 
  onCheckedChange, 
  disabled = false, 
  className = "" 
}) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked)
    }
  }

  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      className={`
        w-4 h-4 rounded border-2 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked 
          ? 'bg-purple-600 border-purple-600 text-white' 
          : 'bg-transparent border-slate-600 hover:border-slate-500'
        }
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 
        transition-colors duration-200
        ${className}
      `}
    />
  )
}

export { Checkbox }
