import React from 'react'

const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  // Clases base que siempre se aplican
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  // Diferentes estilos según la variante
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground'
  }
  
  // Obtener las clases de la variante seleccionada
  const variantClass = variants[variant] || variants.default
  
  // Combinar todas las clases
  const finalClassName = `${baseClasses} ${variantClass} ${className}`
  
  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  )
}

export { Badge }
