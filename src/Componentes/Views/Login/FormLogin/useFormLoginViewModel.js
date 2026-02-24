import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../Utils/ValidacionesForm';
import { useNavigate } from 'react-router-dom';

export const useFormLoginViewModel = ({ onSubmit, onClose, onAbrirRegistro }) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
    reset
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { credencial: "", contrasena: "" }
  });

  const credencial = watch("credencial");
  const contrasena = watch("contrasena");

  useEffect(() => {
    setErrorGeneral(null);
  }, [credencial, contrasena]);

  const procesarEnvio = useCallback(async (data) => {
    setEstaEnviando(true);
    setErrorGeneral(null);

    const esValido = await trigger();
    if (!esValido) {
      setEstaEnviando(false);
      return;
    }

    try {
      await onSubmit?.({
        credencial: data.credencial,
        contrasena: data.contrasena
      });
    } catch (error) {
      console.error("Error en login:", error);
      setErrorGeneral("Error inesperado. Intente nuevamente.");
    } finally {
      setEstaEnviando(false);
    }
  }, [onSubmit, trigger]);

  const toggleMostrarContrasena = useCallback(() => {
    setMostrarContrasena(prev => !prev);
  }, []);

  const limitarCaracteres = useCallback((e, maxLength) => {
    if (e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
  }, []);

  const limpiarErrorGeneral = useCallback(() => {
    setErrorGeneral(null);
  }, []);

  const manejarClickRegistro = useCallback((e) => {
    e.preventDefault();
    reset();
    onAbrirRegistro?.();
  }, [reset, onAbrirRegistro]);

  const navigate = useNavigate();

  const manejarClickRecuperarPassword = useCallback((e) => {
    e?.preventDefault?.();
    onClose?.();
    navigate('/recuperar-password');
  }, [onClose, navigate]);

  return {
    // Estado del formulario
    mostrarContrasena,
    estaEnviando,
    errorGeneral,
    isValid,
    isDirty,

    // Valores observados
    credencial,
    contrasena,

    // Funciones de react-hook-form
    register,
    handleSubmit: handleSubmit(procesarEnvio),
    errors,

    // Funciones de UI
    toggleMostrarContrasena,
    limitarCaracteres,
    limpiarErrorGeneral,
    manejarClickRegistro,
    manejarClickRecuperarPassword,
    onRecuperarPassword: manejarClickRecuperarPassword,

    // Callbacks externos
    onClose,
  };
};
