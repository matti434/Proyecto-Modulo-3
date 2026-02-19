import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        login: "Login",
        register: "Register",
        profile: "Profile",
        contact: "Contact",
        support: "Support",
        logout: "Logout",
        home: "Home",
        products: "Products",
        changeLanguage: "Change language",
        shoppingCart: "Shopping Cart",
        userMenu: "User Menu",

        // === TRADUCCIONES PARA LOGIN ===
        loginTitle: "Your journey continues at Rolling Motors",
        loginSubtitle: "Enter your credentials to access your account",
        usernameOrEmail: "USERNAME OR EMAIL",
        usernameOrEmailPlaceholder: "username123 or example@mail.com",
        password: "PASSWORD",
        passwordPlaceholder: "Enter your password",
        forgotPassword: "FORGOT YOUR PASSWORD?",
        cancel: "CANCEL",
        loggingIn: "LOGGING IN...",
        createAccount: "CREATE NEW ACCOUNT",
        noAccount: "DON'T HAVE AN ACCOUNT?",
        registerHere: "REGISTER HERE",
        alreadyHaveAccount: "Already have an account?",
        showPassword: "Show password",
        hidePassword: "Hide password",
        close: "Close",
        loginErrorMessage: "Incorrect credentials. Please verify your data.",

        // === TRADUCCIONES PARA REGISTRO (las dejas dentro de form si quieres) ===
        form: {
          title: "REGISTER",
          subtitle: "Complete all fields to create your account",
          username: "USERNAME",
          email: "EMAIL",
          country: "COUNTRY OF RESIDENCE",
          birthday: "DATE OF BIRTH",
          password: "PASSWORD",
          confirmPassword: "CONFIRM PASSWORD",

          placeholderUsername: "Enter your username",
          placeholderEmail: "example@mail.com",
          placeholderPassword: "Enter your password",
          placeholderConfirmPassword: "Repeat your password",

          countrySelect: "Select your country",

          cancel: "CANCEL",
          register: "REGISTER",
          registering: "REGISTERING...",

          passwordMismatch: "Passwords do not match",
        },
      },
    },
    es: {
      translation: {
        login: "Iniciar sesión",
        register: "Registrarse",
        profile: "Perfil",
        contact: "Contacto",
        support: "Soporte",
        logout: "Cerrar sesión",
        home: "Inicio",
        products: "Productos",
        changeLanguage: "Cambiar idioma",
        shoppingCart: "Carrito de compras",
        userMenu: "Menú de usuario",

        // === TRADUCCIONES PARA LOGIN (al nivel raíz) ===
        loginTitle: "Tu camino continúa en Rolling Motors",
        loginSubtitle: "Ingresa tus credenciales para acceder a tu cuenta",
        usernameOrEmail: "USUARIO O EMAIL",
        usernameOrEmailPlaceholder: "usuario123 o ejemplo@correo.com",
        password: "CONTRASEÑA",
        passwordPlaceholder: "Ingresa tu contraseña",
        forgotPassword: "¿OLVIDASTE TU CONTRASEÑA?",
        cancel: "CANCELAR",
        loggingIn: "INICIANDO SESIÓN...",
        createAccount: "CREAR NUEVA CUENTA",
        noAccount: "¿NO TIENES UNA CUENTA?",
        registerHere: "REGISTRARSE AQUÍ",
        alreadyHaveAccount: "Ya tengo cuenta",
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
        close: "Cerrar",
        loginErrorMessage: "Credenciales incorrectas. Por favor verifica tus datos.",

        // === TRADUCCIONES PARA REGISTRO (dentro de form) ===
        form: {
          title: "REGISTRO",
          subtitle: "Completa todos los campos para crear tu cuenta",
          username: "NOMBRE DE USUARIO",
          email: "EMAIL",
          country: "PAÍS DE RESIDENCIA",
          birthday: "FECHA DE NACIMIENTO",
          password: "CONTRASEÑA",
          confirmPassword: "CONFIRMAR CONTRASEÑA",

          placeholderUsername: "Ingrese su nombre de usuario",
          placeholderEmail: "ejemplo@correo.com",
          placeholderPassword: "Ingrese su contraseña",
          placeholderConfirmPassword: "Repita su contraseña",

          countrySelect: "Selecciona tu país",

          cancel: "CANCELAR",
          register: "REGISTRARSE",
          registering: "REGISTRANDO...",

          passwordMismatch: "Las contraseñas no coinciden",
        },
      },
    },
  },
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;