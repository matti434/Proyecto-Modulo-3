import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registroSchema } from '../../../Utils/ValidacionesForm';

export const useFormRegistroViewModel = ({ onSubmit, onClose }) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registroSchema),
    mode: "onChange",
    defaultValues: {
      nombreDeUsuario: "",
      email: "",
      pais: "",
      fechaNacimiento: "",
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const nombreDeUsuario = watch("nombreDeUsuario");
  const email = watch("email");
  const contrasena = watch("contrasena");
  const confirmarContrasena = watch("confirmarContrasena");

  useEffect(() => {
    setErrorGeneral(null);
  }, [nombreDeUsuario, email, contrasena, confirmarContrasena]);

  const procesarEnvio = useCallback(async (data) => {
    setEstaEnviando(true);
    setErrorGeneral(null);

    try {
      const esValido = await trigger();
      if (esValido) {
        await onSubmit?.(data);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setErrorGeneral(error.message || "Error al procesar el registro");
    } finally {
      setEstaEnviando(false);
    }
  }, [onSubmit, trigger]);

  const toggleMostrarContrasena = useCallback(() => {
    setMostrarContrasena(prev => !prev);
  }, []);

  const toggleMostrarConfirmar = useCallback(() => {
    setMostrarConfirmar(prev => !prev);
  }, []);

  const limitarCaracteres = useCallback((e, maxLength) => {
    if (e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
  }, []);

  const limpiarErrorGeneral = useCallback(() => {
    setErrorGeneral(null);
  }, []);

  return {
    // Estado del formulario
    mostrarContrasena,
    mostrarConfirmar,
    estaEnviando,
    errorGeneral,
    isValid,
    isDirty,
    
    // Valores observados
    nombreDeUsuario,
    email,
    contrasena,
    confirmarContrasena,
    
    // Funciones de react-hook-form
    register,
    handleSubmit: handleSubmit(procesarEnvio),
    errors,
    
    // Funciones de UI
    toggleMostrarContrasena,
    toggleMostrarConfirmar,
    limitarCaracteres,
    limpiarErrorGeneral,
    
    // Callbacks externos
    onClose,
  };
};
