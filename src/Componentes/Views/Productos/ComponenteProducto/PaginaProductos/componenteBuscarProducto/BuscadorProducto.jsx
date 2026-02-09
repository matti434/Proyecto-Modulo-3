import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Button, InputGroup } from "react-bootstrap";
import { toast, Toaster } from "react-hot-toast";

import { useProductos } from "../../../../../Context/ContextoProducto";
import {
  configuracionValidaciones,
  limpiarTodosLosFiltros,
  prevenirCaracteresInvalidos,
  validarCampoNumerico,
  validarTerminoBusqueda,
  validarTodosLosFiltros,
} from "../../../../../Utils/ValidacionesBuscador";

import "./BuscadorProductos.css";

const BuscadorProducto = () => {
  const { productos, filtros, actualizarFiltros, limpiarFiltros, obtenerCategoriasUnicas } = useProductos();
  
  const [filtrosLocales, setFiltrosLocales] = useState({
    terminoBusqueda: filtros.terminoBusqueda,
    categoria: filtros.categoria,
    precioMin: filtros.precioMin,
    precioMax: filtros.precioMax,
    marca: filtros.marca,
    modelo: filtros.modelo
  });

  const [errores, setErrores] = useState({});

  const categoriasUnicas = obtenerCategoriasUnicas();
  const marcasUnicas = [...new Set(productos.map(p => p.marca))];
  const modelosUnicos = [...new Set(productos.map(p => p.modelo))];

  useEffect(() => {
    setFiltrosLocales({
      terminoBusqueda: filtros.terminoBusqueda,
      categoria: filtros.categoria,
      precioMin: filtros.precioMin,
      precioMax: filtros.precioMax,
      marca: filtros.marca,
      modelo: filtros.modelo
    });
  }, [filtros]);

  const mostrarNotificacion = (mensaje, tipo = 'error', duracion = 4000) => {
    const opciones = {
      duration: duracion,
      position: 'top-right',
      style: {
        background: 'var(--color-oscuro)',
        color: 'var(--color-crema)',
        fontWeight: '500',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        border: '1px solid var(--color-dorado)',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif"
      },
      iconTheme: {
        primary: 'var(--color-crema)',
        secondary: 'var(--color-oscuro)'
      }
    };

    const estilosPorTipo = {
      success: {
        background: 'linear-gradient(135deg, var(--color-dorado), #b8941f)',
        borderLeft: '4px solid #f8f4e9',
        color: 'var(--color-oscuro)',
        icon: '✅'
      },
      error: {
        background: 'linear-gradient(135deg, var(--color-rojo), #6a0000)',
        borderLeft: '4px solid #d4af37',
        color: 'var(--color-crema)',
        icon: '❌'
      },
      warning: {
        background: 'linear-gradient(135deg, var(--color-metal), #6e6e6e)',
        borderLeft: '4px solid var(--color-dorado)',
        color: 'var(--color-crema)',
        icon: '⚠️'
      },
      info: {
        background: 'linear-gradient(135deg, var(--color-oscuro), #000)',
        borderLeft: '4px solid var(--color-dorado)',
        color: 'var(--color-crema)',
        icon: 'ℹ️'
      }
    };

    const estilo = estilosPorTipo[tipo] || estilosPorTipo.error;

    toast(mensaje, {
      ...opciones,
      icon: estilo.icon,
      style: {
        ...opciones.style,
        background: estilo.background,
        color: estilo.color,
        borderLeft: estilo.borderLeft,
        fontWeight: '600'
      }
    });
  };

  const manejarCambioFiltro = (campo, valor) => {
    let valorValidado = valor;

    if (campo === 'terminoBusqueda') {
      valorValidado = validarTerminoBusqueda(valor);
      
      if (valor !== valorValidado && valor.length > valorValidado.length) {
        mostrarNotificacion('Se eliminaron caracteres especiales no permitidos', 'warning', 3000);
      }
    } else if (campo === 'precioMin' || campo === 'precioMax') {
      valorValidado = validarCampoNumerico(valor);
      
      if (valor !== valorValidado && /\D/.test(valor)) {
        mostrarNotificacion('Solo se permiten números enteros', 'warning', 3000);
      }
    } else {
      valorValidado = valor.trim();
    }
    
    setFiltrosLocales(prev => ({
      ...prev,
      [campo]: valorValidado
    }));
    
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const manejarAplicarFiltros = (e) => {
    e.preventDefault();
    

    const nuevosErrores = validarTodosLosFiltros(filtrosLocales);
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      
  
      const mensajesError = Object.values(nuevosErrores).filter((msg, index, self) => 
        self.indexOf(msg) === index
      );
      
      if (mensajesError.length > 0) {
        mostrarNotificacion(
          `Corrige los siguientes errores: ${mensajesError.join(' | ')}`,
          'error',
          6000
        );
      }
      return;
    }
    
    const filtrosLimpios = limpiarTodosLosFiltros(filtrosLocales);
    actualizarFiltros(filtrosLimpios);
    setErrores({}); 
    
  
    const filtrosAplicados = [];
    if (filtrosLimpios.terminoBusqueda) {
      filtrosAplicados.push(`"${filtrosLimpios.terminoBusqueda}"`);
    }
    if (filtrosLimpios.categoria) {
      filtrosAplicados.push(`${filtrosLimpios.categoria}`);
    }
    if (filtrosLimpios.precioMin || filtrosLimpios.precioMax) {
      const min = filtrosLimpios.precioMin || '0';
      const max = filtrosLimpios.precioMax || '∞';
      filtrosAplicados.push(`$${min}-${max}`);
    }
    if (filtrosLimpios.marca) {
      filtrosAplicados.push(filtrosLimpios.marca);
    }
    if (filtrosLimpios.modelo) {
      filtrosAplicados.push(filtrosLimpios.modelo);
    }
    
    const mensajeExito = filtrosAplicados.length > 0 
      ? `Filtros aplicados: ${filtrosAplicados.join(' • ')}`
      : 'Mostrando todos los productos';
    
    mostrarNotificacion(mensajeExito, 'success');
  };

  const manejarLimpiarFiltros = () => {
    const filtrosVacios = {
      terminoBusqueda: '',
      categoria: '',
      precioMin: '',
      precioMax: '',
      marca: '',
      modelo: ''
    };
    setFiltrosLocales(filtrosVacios);
    setErrores({});
    limpiarFiltros();
    

    mostrarNotificacion('Todos los filtros han sido restablecidos', 'info');
  };

  const manejarBusquedaEnTiempoReal = (termino) => {
    const terminoLimpio = validarTerminoBusqueda(termino);
    setFiltrosLocales(prev => ({ ...prev, terminoBusqueda: terminoLimpio }));
    
    if (terminoLimpio.length >= 3 || terminoLimpio === '') {
      actualizarFiltros({ 
        terminoBusqueda: terminoLimpio,
        categoria: filtrosLocales.categoria
      });
    } else if (terminoLimpio.length > 0 && terminoLimpio.length < 3) {
      const timeoutId = setTimeout(() => {
        mostrarNotificacion('Ingresa al menos 3 caracteres para buscar', 'info', 2000);
      }, 800);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const manejarCambioCategoria = (categoria) => {
    setFiltrosLocales(prev => ({ ...prev, categoria }));
    actualizarFiltros({ 
      categoria,
      terminoBusqueda: filtrosLocales.terminoBusqueda
    });
    
    if (categoria) {
      mostrarNotificacion(`Categoría seleccionada: ${categoria}`, 'info');
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerClassName="toast-container-royal"
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          className: 'royal-toast',
          duration: 4000,
          success: {
            iconTheme: {
              primary: 'var(--color-oscuro)',
              secondary: 'var(--color-dorado)'
            }
          },
          error: {
            iconTheme: {
              primary: 'var(--color-crema)',
              secondary: 'var(--color-rojo)'
            }
          }
        }}
      />
      
      <Container className="my-4 buscador-royal-enfield">
        <Row>
          <Col lg={12}>
            <h2 className="text-center mb-3 titulo-buscador mt-2">Buscador de Productos</h2>
            <Card className="shadow-sm mb-3 card-buscador">
              <Card.Body className="cuerpo-buscador">
                <Form onSubmit={manejarAplicarFiltros} noValidate>
                  <Row>
                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">
                          Buscar producto
                          <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>
                            (Solo letras o números)
                          </span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control 
                            type="text" 
                            placeholder="Nombre, marca o modelo..." 
                            className={`input-royal ${errores.terminoBusqueda ? 'is-invalid' : ''}`}
                            value={filtrosLocales.terminoBusqueda}
                            onChange={(e) => manejarBusquedaEnTiempoReal(e.target.value)}
                            onKeyDown={(e) => prevenirCaracteresInvalidos(e, 'alfanumerico')}
                            pattern={configuracionValidaciones.terminoBusqueda.pattern}
                            title={configuracionValidaciones.terminoBusqueda.title}
                            maxLength={configuracionValidaciones.terminoBusqueda.maxLength}
                            minLength={3}
                          />
                        </InputGroup>
                        {errores.terminoBusqueda && (
                          <div className="invalid-feedback d-block" style={{ color: 'var(--color-rojo)' }}>
                            {errores.terminoBusqueda}
                          </div>
                        )}
                        <Form.Text className="text-muted">
                          Mínimo 3 caracteres, máximo 50 caracteres. No se permiten símbolos.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">Categoría</Form.Label>
                        <Form.Select 
                          className="select-royal"
                          value={filtrosLocales.categoria}
                          onChange={(e) => manejarCambioCategoria(e.target.value)}
                        >
                          <option value="">Todas las categorías</option>
                          {categoriasUnicas.map(categoria => (
                            <option key={categoria} value={categoria}>
                              {categoria}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-2">
                      <Form.Label className="etiqueta-form">
                        Rango de precio
                        <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>
                          (Solo números enteros positivos)
                        </span>
                      </Form.Label>
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Control 
                              type="text"
                              inputMode="numeric"
                              className={`input-royal ${errores.precioMin ? 'is-invalid' : ''}`}
                              placeholder="Mínimo" 
                              value={filtrosLocales.precioMin}
                              onChange={(e) => manejarCambioFiltro('precioMin', e.target.value)}
                              onKeyDown={(e) => prevenirCaracteresInvalidos(e, 'numerico')}
                              pattern={configuracionValidaciones.precioMin.pattern}
                              title={configuracionValidaciones.precioMin.title}
                              maxLength={configuracionValidaciones.precioMin.maxLength}
                            />
                            {errores.precioMin && (
                              <div className="invalid-feedback d-block" style={{ color: 'var(--color-rojo)' }}>
                                {errores.precioMin}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Control 
                              type="text"
                              inputMode="numeric"
                              className={`input-royal ${errores.precioMax ? 'is-invalid' : ''}`}
                              placeholder="Máximo" 
                              value={filtrosLocales.precioMax}
                              onChange={(e) => manejarCambioFiltro('precioMax', e.target.value)}
                              onKeyDown={(e) => prevenirCaracteresInvalidos(e, 'numerico')}
                              pattern={configuracionValidaciones.precioMax.pattern}
                              title={configuracionValidaciones.precioMax.title}
                              maxLength={configuracionValidaciones.precioMax.maxLength}
                            />
                            {errores.precioMax && (
                              <div className="invalid-feedback d-block" style={{ color: 'var(--color-rojo)' }}>
                                {errores.precioMax}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Text className="text-muted">
                         (solo números enteros, sin decimales)
                      </Form.Text>
                    </Col>

                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">Marca</Form.Label>
                        <Form.Select 
                          className="select-royal"
                          value={filtrosLocales.marca}
                          onChange={(e) => manejarCambioFiltro('marca', e.target.value)}
                        >
                          <option value="">Todas las marcas</option>
                          {marcasUnicas.map(marca => (
                            <option key={marca} value={marca}>{marca}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">Modelo</Form.Label>
                        <Form.Select 
                          className="select-royal"
                          value={filtrosLocales.modelo}
                          onChange={(e) => manejarCambioFiltro('modelo', e.target.value)}
                        >
                          <option value="">Todos los modelos</option>
                          {modelosUnicos.map(modelo => (
                            <option key={modelo} value={modelo}>{modelo}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col className="text-end mt-2">
                      <Button 
                        type="button"
                        variant="outline-secondary" 
                        className="me-2 boton-limpiar"
                        onClick={manejarLimpiarFiltros}
                        style={{ 
                          borderColor: 'var(--color-dorado)',
                          color: 'var(--color-oscuro)'
                        }}
                      >
                        Limpiar filtros
                      </Button>
                      <Button 
                        type="submit"
                        variant="primary" 
                        className="boton-aplicar"
                        style={{ 
                          background: 'var(--color-dorado)',
                          borderColor: 'var(--color-dorado)',
                          color: 'var(--color-oscuro)'
                        }}
                      >
                        Aplicar filtros
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BuscadorProducto;