import React, { createContext, useContext, useState } from "react";

const CuponContext = createContext();

export const CuponProvider = ({ children }) => {
  const [cuponActivo, setCuponActivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const aplicarCupon = (cuponData) => {
    setCuponActivo(cuponData);
    setMensaje(
      `Cupón "${cuponData.nombreCupon}" (${cuponData.porcentajeDescuento}%) aplicado con éxito.`
    );
    setTipoMensaje("success");
  };

  const quitarCupon = () => {
    setCuponActivo(null);
    setMensaje("Cupón removido");
    setTipoMensaje("success");
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 2000);
  };

  const mostrarError = (mensajeError) => {
    setCuponActivo(null);
    setMensaje(mensajeError);
    setTipoMensaje("error");
  };

  const limpiarMensaje = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  const calcularPrecioConCupon = (precioOriginal) => {
    if (
      !cuponActivo ||
      !cuponActivo.porcentajeDescuento ||
      cuponActivo.porcentajeDescuento <= 0
    ) {
      return null;
    }
    return (
      precioOriginal - (precioOriginal * cuponActivo.porcentajeDescuento) / 100
    );
  };

  const value = {
    cuponActivo,
    mensaje,
    tipoMensaje,
    aplicarCupon,
    quitarCupon,
    mostrarError,
    limpiarMensaje,
    calcularPrecioConCupon,
  };

  return (
    <CuponContext.Provider value={value}>{children}</CuponContext.Provider>
  );
};

export const useCupon = () => {
  const context = useContext(CuponContext);
  if (!context) {
    throw new Error("useCupon debe ser usado dentro de un CuponProvider");
  }
  return context;
};
