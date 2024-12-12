# README - PartyNow App

---

## **Enlace a la página**: https://partynow.netlify.app

## **PartyNow**

**PartyNow** es una aplicación moderna y responsiva desarrollada para descubrir, organizar y gestionar fiestas en todo el mundo. Ofrece una experiencia intuitiva y enriquecedora para usuarios que deseen explorar eventos globales, gestionar su perfil, y más. La aplicación está construida utilizando **Ionic Framework** y emplea prácticas de desarrollo avanzado como arquitectura en capas, componentes reutilizables, y formularios reactivos.

---

## **Características Principales**

### **Autenticación de Usuario**

- **Registro de cuenta**: Permite a los usuarios registrarse fácilmente.
- **Inicio y cierre de sesión**: Los usuarios pueden iniciar y cerrar sesión de manera segura.
- **Autologin**: La aplicación recuerda la sesión de los usuarios, proporcionando una experiencia sin interrupciones.

### **Gestión de Fiestas**

- **Explorar eventos**: Ver fiestas alrededor del mundo con información detallada.
- **Filtrar eventos**: Filtrar por país, precio, edad mínima, entre otros.
- **Crear, modificar o eliminar fiestas**: Los usuarios pueden gestionar sus propios eventos a través de un CRUD intuitivo.

### **Gestión de Perfil**

- Los usuarios pueden editar su información personal utilizando un modal dedicado.

---

## **Características Técnicas**

### **Traducción Multilingüe**

- **Servicio de traducción completo** que permite cambiar entre varios idiomas fácilmente.
- Textos traducidos dinámicamente usando `ngx-translate`.

### **Arquitectura en Capas**

- **Servicio de autenticación**: Gestiona el inicio, cierre de sesión y verificación de autenticación.
- **Servicio de comunicaciones**: Preparado para conectar con servicios de backend en entornos distintos.
- **Servicio de acceso a datos**: Gestiona la manipulación de datos y mapeos.

### **Componentización**

- Uso extensivo de componentes reutilizables para mejorar la modularidad y la mantenibilidad del proyecto.

### **Pipes Personalizados**

1. **Formato de fecha**: Controla la visualización de fechas en diferentes formatos.
2. **SafeUrl**: Asegura la integración segura de URLs en Google Maps.

### **Directiva Personalizada**

- Resalta fiestas económicas añadiendo un borde y efecto de `box-shadow` basado en el precio.

### **Modales**

1. **Perfil**: Modal para modificar los datos del perfil.
2. **CRUD de fiestas**: Modal dedicado a gestionar fiestas (crear, modificar, eliminar).

### **Formularios Reactivos**

- Formularios altamente interactivos y validados para el registro, perfil, y CRUD de fiestas.

### **CustomValueAccessor**

- Controla el input del precio de las fiestas de forma personalizada.

### **Navegación**

- **Páginas interactivas**:
  - **Home/About**: Página inicial con información general.
  - **Fiestas**: Página dedicada a explorar eventos.
  - **Perfil**: Gestión de datos del usuario.
- **Menú lateral**:
  - Navegación entre páginas.
  - Selección de idioma.
  - Opción de cerrar sesión.

### **Guardias de Ruta**

- Garantiza que solo usuarios autenticados puedan acceder a secciones específicas de la app.

### **Diseño y Estilo**

- **Colores corporativos**: Diseño moderno y atractivo alineado con la identidad visual.
- **Responsividad completa**: La app se adapta perfectamente a diferentes tamaños de pantalla.

---

## **Uso de Tecnologías**

### **Frontend**

- **Ionic Framework**: Framework de componentes estilizados para un diseño moderno y fluido.
- **Angular**: Framework robusto para el desarrollo web y móvil.

### **Backend Ready**

- Arquitectura lista para conectarse con servicios backend para la gestión de datos en tiempo real.

---

## **Cómo Ejecutar**

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   ```
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Ejecutar la aplicación**:
   ```bash
   ionic serve
   ```

---

## **Capturas de Pantalla**

*(Incluya capturas de pantalla para mostrar las características principales y la interfaz de usuario)*

---

## **Contribución**

Las contribuciones son bienvenidas. Por favor, cree un issue o envíe un pull request para discutir cualquier cambio importante.

---

## **Licencia**

Este proyecto está bajo la licencia MIT. Consulte el archivo `LICENSE` para más detalles.

---

Con **PartyNow**, organizar y asistir a las mejores fiestas nunca fue tan fácil. 🎉

🎉
