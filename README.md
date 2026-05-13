# AYS Shell Account Management

Aplicación principal (Shell) encargada de la orquestación de Microfrontends y la gestión de la autenticación de usuarios para el sistema AYS.

## 🚀 Despliegue
La aplicación se encuentra desplegada en **Digital Ocean App Platform**:
🔗 **URL Principal:** [https://ays-shl-account-manage-35jnj.ondigitalocean.app/login](https://ays-shl-account-manage-35jnj.ondigitalocean.app/login)

---

## 🏗️ Arquitectura
Este proyecto utiliza una arquitectura de **Microfrontends** basada en **Iframes**, lo que permite la coexistencia de múltiples aplicaciones independientes dentro de un contenedor común (Shell).

### Características Técnicas:
- **Framework:** Angular 21 (v21.2.x).
- **Estilos:** SASS con arquitectura modular.
- **Comunicación Shell-a-MFE:** Se implementa un "Message Bridge" mediante la API nativa `window.postMessage`.
  - El Shell envía datos críticos de sesión (`role`, `clientId`, `userName`) de forma segura.
  - Soporta un mecanismo de **Handshake** (`MFE_READY`) para asegurar que el microfrontend receptor esté listo antes del envío de datos.
- **Configuración Dinámica:** Las URLs de los microfrontends se configuran en tiempo de ejecución a través de `window.__APP_CONFIG__`, permitiendo cambiar los endpoints sin recompilar el código.
- **Autenticación:** Sistema centralizado con Guards (`AuthGuard`, `AdminGuard`) y manejo de JWT.

---

## 🛠️ Cómo Correr el Proyecto Localmente

### Requisitos:
- **Node.js:** Versión 18 o superior.
- **Package Manager:** npm (incluido con Node).

### Pasos para ejecución:
1.  **Clonar e Instalar:**
    ```bash
    npm install
    ```
2.  **Iniciar Servidor de Desarrollo:**
    ```bash
    npm start
    ```
    Navegue a `http://localhost:4200/`. La aplicación se recargará automáticamente al detectar cambios.

3.  **Construir para Producción:**
    ```bash
    npm run build
    ```
    Los archivos compilados se generarán en la carpeta `dist/`.

---

## 💡 A tener en cuenta (Best Practices)

1.  **Integración de MFEs:** Cada microfrontend cargado debe estar preparado para escuchar el mensaje de tipo `SHELL_SESSION_DATA`. Se recomienda usar el prompt de integración proporcionado en la documentación de desarrollo para Angular/React.
2.  **Seguridad de Origen:** El Shell utiliza el `remoteUrl` configurado como `targetOrigin` en el `postMessage`. Asegúrese de que las URLs en la configuración coincidan exactamente con el dominio donde corre el MFE.
3.  **Variables de Entorno (Docker):** Para despliegues en contenedores, utilice el script proporcionado en `deploy/40-generate-app-config.sh`. Este script inyecta las variables de entorno de Digital Ocean directamente en el `index.html` servido por Nginx.
4.  **Animaciones y UX:** La pantalla de registro utiliza Angular Animations para transiciones entre pasos. No modifique los disparadores de animación sin verificar la consistencia en `register.component.ts`.

---

## 📁 Estructura del Proyecto
- `src/app/auth/`: Lógica de Login y Registro (3 pasos).
- `src/app/shared/`: Componentes comunes (Header, Footer), Servicios (Auth) y Guards.
- `src/app/microfrontend-frame.component.ts`: Componente principal que gestiona el Iframe y el flujo de comunicación.
- `deploy/`: Configuraciones de Docker, Nginx y Scripts de despliegue para Digital Ocean.
