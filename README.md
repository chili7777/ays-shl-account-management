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

## 📦 Ecosistema de Repositorios

Este proyecto forma parte de un ecosistema distribuido. A continuación se detallan los repositorios relacionados:

### Microfrontends (MFA)
*   **[ays-shl-account-management](https://github.com/chili7777/ays-shl-account-management):** (Este repositorio) Aplicación Shell que orquesta los microfrontends y gestiona la autenticación.
*   **[ays-mfa-customer](https://github.com/chili7777/ays-mfa-customer):** Microfrontend encargado de la gestión y visualización de datos de clientes.
*   **[ays-mfa-account](https://github.com/chili7777/ays-mfa-account):** Microfrontend dedicado a la administración de cuentas bancarias.
*   **[ays-mfa-movements](https://github.com/chili7777/ays-mfa-movements):** Microfrontend para la consulta y gestión de movimientos financieros.

### Microservicios (MSA)
*   **[ays-msa-dm-cuaa-cr-account](https://github.com/chili7777/ays-msa-dm-cuaa-cr-account):** Microservicio para la gestión de dominios y operaciones de cuentas.
*   **[ays-msa-dm-pain-cr-movement](https://github.com/chili7777/ays-msa-dm-pain-cr-movement):** Microservicio encargado del procesamiento y registro de movimientos/transacciones.

### Configuración y Guías
*   **[ays-custom-instructions](https://github.com/chili7777/ays-custom-instructions):** Repositorio con instrucciones personalizadas y guías de estandarización para el desarrollo del proyecto.

---

## 🔐 Credenciales de Acceso (Pruebas)

Para probar las diferentes funcionalidades y niveles de acceso en la plataforma, puede utilizar los siguientes usuarios:

### Perfil Administrativo (BackOffice)
*   **Usuario:** `0103322228`
*   **Contraseña:** `asdfghjk`

### Perfil Usuario (App de Transferencias)
*   **Opción 1:**
    *   **Usuario:** `1718048232`
    *   **Contraseña:** `qwertyui`
*   **Opción 2:**
    *   **Usuario:** `1718048315`
    *   **Contraseña:** `zxcvbnmq`

---

## 📁 Estructura del Proyecto
- `src/app/auth/`: Lógica de Login y Registro (3 pasos).
- `src/app/shared/`: Componentes comunes (Header, Footer), Servicios (Auth) y Guards.
- `src/app/microfrontend-frame.component.ts`: Componente principal que gestiona el Iframe y el flujo de comunicación.
- `deploy/`: Configuraciones de Docker, Nginx y Scripts de despliegue para Digital Ocean.
