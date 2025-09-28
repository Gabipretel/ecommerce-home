import React from 'react'

// Componente principal Card
const Card = ({ className = '', children, ...props }) => {
  const finalClassName = `rounded-lg border bg-card text-card-foreground shadow-sm ${className}`
  
  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  )
}

// Encabezado de la tarjeta
const CardHeader = ({ className = '', children, ...props }) => {
  const finalClassName = `flex flex-col space-y-1.5 p-6 ${className}`
  
  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  )
}

// Título de la tarjeta
const CardTitle = ({ className = '', children, ...props }) => {
  const finalClassName = `text-2xl font-semibold leading-none tracking-tight ${className}`
  
  return (
    <h3 className={finalClassName} {...props}>
      {children}
    </h3>
  )
}

// Descripción de la tarjeta
const CardDescription = ({ className = '', children, ...props }) => {
  const finalClassName = `text-sm text-muted-foreground ${className}`
  
  return (
    <p className={finalClassName} {...props}>
      {children}
    </p>
  )
}

// Contenido principal de la tarjeta
const CardContent = ({ className = '', children, ...props }) => {
  const finalClassName = `p-6 pt-0 ${className}`
  
  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  )
}

// Pie de la tarjeta
const CardFooter = ({ className = '', children, ...props }) => {
  const finalClassName = `flex items-center p-6 pt-0 ${className}`
  
  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
