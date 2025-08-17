# Metodología para desarrollo de Frontend en React

## Introducción

Esta metodología comienza **después de definir claramente**:

- Levantamiento de requerimientos.
- Clasificación de requerimientos.
- Endpoints del Backend.

El enfoque adoptado por **Innteligen** para el desarrollo de front-ends en React es usar:

- **Component-Driven Architecture (CDA)**: estructura la interfaz mediante componentes reutilizables.
- **Atomic Design**: organización visual estructurada en niveles.
- **Design System**: garantiza coherencia visual.
- **Storybook**: documenta visualmente los componentes.

---

## Component-Driven Architecture (CDA)

Es una forma de **desarrollo frontend** donde las aplicaciones se construyen a partir de componentes reutilizables, empezando desde los más pequeños hasta formar vistas completas.

En este enfoque usamos **React con ES Modules** para dividir el código en componentes funcionales bien encapsulados, manteniendo una estructura modular y escalable.

Aplicamos **Atomic Design** como patrón estructural para organizar los componentes en niveles (atoms, molecules, organisms, templates, pages), facilitando la coherencia y la reusabilidad.

Usamos **styled-components junto con design tokens** para implementar un sistema visual consistente y personalizable, en línea con el **Design System** de la marca, que define colores, tipografía, espaciado y estilos globales. Asegurando que todos los componentes sigan un mismo sistema visual y respondan a los principios del diseño de producto.

Además, integramos **Storybook** como entorno aislado para documentar, visualizar y testear cada componente de forma independiente, lo cual mejora la colaboración entre diseño, desarrollo y QA, y refuerza la calidad del producto final.

---

## Paso 1 – Flujo de trabajo con los diseñadores

Es clave una buena comunicación entre diseño y desarrollo:

### ¿Qué pedir a los diseñadores?

Solicita específicamente:

- Archivo en **Figma** o herramienta similar.
- Pantallas completas **y componentes individuales**.
- **Estados visuales claros** (activo, desactivado, error, etc.).
- Guía básica de interacción y animaciones esperadas.

### Forma ideal de recibir la información

- Archivo de Figma organizado claramente en páginas.
- Pantallas completas separadas claramente de componentes individuales.
- **Tokens de diseño** definidos claramente en Figma con estilos globales:
  - Colores
  - Tipografías (familia, tamaño, peso)
  - Espaciado (márgenes, paddings)
  - Sombras y bordes

### Ejemplo de petición a diseño

> Necesitamos que nos entreguen el diseño en Figma estructurado por componentes individuales (botones, inputs, tarjetas), cada uno con sus variantes visuales (hover, activo, desactivado, error). Además, por favor definan los tokens de diseño globalmente en el archivo (colores, tipografía, tamaños) utilizando la función de “Estilos” de Figma.

---

## Paso 2 – Definición de Tokens de Diseño

Los tokens de diseño son variables reutilizables para elementos visuales comunes, como colores, fuentes o espaciados. Esto permite mantener coherencia en toda tu aplicación. En lugar de repetir los mismos valores en todas partes, los centralizas en un archivo único. Deben coincidir exactamente con los definidos por diseño.

### ¿Cómo hacerlo paso a paso?

1. **Habla con tu diseñador** y pídele específicamente un archivo de diseño (por ejemplo, en Figma), donde los colores, tipografía, tamaños y márgenes estén claramente definidos y organizados en "estilos globales". Es importante que estén agrupados claramente y etiquetados con nombres fáciles de entender (por ejemplo: "primary", "danger", "background").

2. **Crea el archivo tokens en React**
   En tu carpeta `src/tokens`, crea un archivo llamado `tokens.js`. Dentro coloca algo así:

```javascript
// src/tokens/tokens.js
export const colors = {
  primary: '#0070f3',
  secondary: '#7928ca',
  success: '#17C964',
  danger: '#e00',
  background: '#ffffff',
  text: '#333333',
};

export const fontSizes = {
  small: '12px',
  medium: '16px',
  large: '20px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
};

export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.12)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
};
```

3. **Cómo usar estos tokens**
   Cuando desarrolles cualquier componente visual, importas este archivo y lo utilizas para estilos. Por ejemplo:

```jsx
import React from 'react';
import { colors, spacing } from '../tokens/tokens';

const Button = ({ children }) => (
  <button
    style={{
      backgroundColor: colors.primary,
      color: colors.background,
      padding: spacing.sm,
      border: 'none',
      borderRadius: '4px',
    }}
  >
    {children}
  </button>
);

export default Button;
```

Esto asegura que cualquier cambio en los tokens se reflejará automáticamente en toda tu aplicación.

---

## Paso 3 – Organización estructurada del código del proyecto

Es vital definir una estructura clara desde el inicio. Sigue esta organización recomendada:

```bash
auth-client-app/
├── public/                                  # Archivos estáticos servidos directamente
│   ├── index.html                           # HTML principal
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/                                     # Código fuente
│   ├── app/                                 # Setup general (routing, contextos, tema)
│   │   ├── router/
│   │   │   └── AppRouter.tsx                # Rutas públicas y protegidas
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx             # Estado global de sesión
│   │   │   └── ThemeProvider.tsx            # Proveedor de tokens y estilos
│   │   └── index.tsx                        # Punto de entrada ReactDOM
│   ├── components/                          # Componentes organizados por Atomic Design
│   │   ├── atoms/                           # Elementos visuales básicos
│   │   │   └── Input/
│   │   │       ├── Input.tsx
│   │   │       ├── Input.styled.ts
│   │   │       ├── Input.test.tsx
│   │   │       ├── Input.stories.tsx
│   │   │       └── index.ts
│   │   ├── molecules/                       # Combinaciones simples (form rows, toggles)
│   │   │   └── AuthField/
│   │   │       └── AuthField.tsx
│   │   ├── organisms/                       # Bloques funcionales (forms completos, headers)
│   │   │   └── ui-states/                   # Estados visuales (loading, error, vacío)
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ErrorMessage.tsx
│   │   │   └── LoginForm/
│   │   │       └── LoginForm.tsx
│   │   ├── templates/                       # Layouts reutilizables (auth, dashboard)
│   │   │   └── AuthLayout.tsx
│   ├── pages/                               # Vistas completas por ruta
│   │   ├── login/
│   │   │   ├── LoginPage.tsx
│   │   │   └── index.ts
│   │   ├── register/
│   │   │   ├── RegisterPage.tsx
│   │   │   └── index.ts
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx
│   │       └── index.ts
│   ├── hooks/                               # Lógica de interacción reutilizable
│   │   ├── useAuth.ts                       # Iniciar sesión, cerrar sesión
│   │   ├── useSession.ts                    # Obtener sesión y estado
│   │   └── index.ts
│   ├── services/                            # Llamadas API al backend de autenticación
│   │   └── auth/
│   │       ├── AuthService.ts               # login(), register(), getSession(), logout()
│   │       ├── auth.mapper.ts               # Adaptación de datos entre frontend y backend
│   │       └── index.ts
│   ├── domain/                              # Tipos y reglas de negocio del dominio auth
│   │   └── auth/
│   │       ├── types.ts                     # Ej: AuthToken, SessionUser
│   │       ├── guards.ts                    # Funciones para validar sesión o rol
│   │       └── index.ts
│   ├── context/                             # React Contexts centralizados
│   │   ├── AuthContext.tsx                  # Provee usuario actual y funciones de sesión
│   │   └── ThemeContext.tsx
│   ├── shared/                              # Herramientas compartidas
│   │   ├── utils/
│   │   │   ├── fetcher.ts                   # Wrapper de fetch/axios
│   │   │   ├── parseJwt.ts                  # Decodificador de JWT
│   │   │   └── delay.ts                     # Simulador de latencia
│   │   └── constants/
│   │       ├── endpoints.ts                 # Rutas de la API
│   │       └── roles.ts                     # Roles de usuario permitidos
│   ├── tokens/                              # Design tokens (estilos desde el Design System)
│   │   ├── colors.ts                        # Paleta de colores
│   │   ├── spacing.ts                       # Márgenes y paddings
│   │   ├── typography.ts                    # Fuentes y tamaños
│   │   ├── radius.ts                        # Bordes redondeados
│   │   └── index.ts                         # Exporta todos los tokens
│   └── stories/                             # Casos visuales adicionales para Storybook
│       └── Auth/
│           └── LoginForm.stories.tsx
├── .storybook/                              # Configuración de Storybook
│   ├── main.ts
│   ├── preview.ts
│   └── manager.ts
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts / webpack.config.js

```

**¿Por qué esta estructura?**

- Fácil mantenimiento.
- Escalable y clara.
- Compatible con CDA y Atomic Design.

---

## Paso 4 – Estructura visual del proyecto por componentes (basada en Atomic Design)

La idea principal al construir una app en React es no crear páginas enteras como un bloque único, sino más bien construir piezas pequeñas que puedas reutilizar en diferentes partes de la aplicación.

Atomic Design es un método muy útil para conseguir esto, ya que permite dividir claramente cada interfaz en distintos niveles visuales según su complejidad, desde elementos básicos hasta componentes más complejos y pantallas enteras.

Usamos 5 niveles claramente definidos para organizar visualmente la interfaz:

| Nivel      | Rol en la interfaz                          | Ejemplo React               |
| ---------- | ------------------------------------------- | --------------------------- |
| Átomos     | Elementos visuales básicos                  | Button, Input, Label        |
| Moléculas  | Agrupaciones funcionales pequeñas de átomos | InputWithLabel, SearchField |
| Organismos | Componentes completos más grandes           | LoginForm, NavigationBar    |
| Templates  | Estructura general de una pantalla          | MainLayoutTemplate          |
| Páginas    | Pantallas finales con datos reales          | HomePage, RegisterPage      |

{.dense}

Estructurar la interfaz como un sistema de piezas reutilizables, dividiendo por niveles de abstracción según Component-Driven Architecture.

---

### ¿Cómo aplicarlo claramente?

#### 1. Crea carpetas separadas para átomos, moléculas y organismos en tu proyecto:

```
src/components/
├── atoms
├── molecules
├── organisms
└── templates
```

#### 2. Recorrer cada pantalla y dividirla en unidades de UI

- Clasifica cada unidad en uno de los niveles: átomo, molécula, organismo, template o página.
- Nombra cada componente de forma semántica y autoexplicativa.
- Documentar qué datos requiere cada componente y qué acciones puede emitir.

**¿Qué significa "forma semántica y autoexplicativa"?**
Un nombre **semántico** describe el **propósito funcional del componente**, y no solo su forma.
Un nombre **autoexplicativo** permite entender qué hace ese componente solo con leerlo, sin abrir el archivo.

**Ejemplos de nombres correctos:**
`LoginForm` → deja claro que es un formulario de login completo (organismo).
`InputWithLabel` → especifica que es un input acompañado de una etiqueta (molécula).
`UserCard` → representa una tarjeta con datos de usuario (organismo).
`DashboardLayout` → layout general de una vista tipo dashboard (template).
`PrimaryButton` → botón estilizado según el estilo principal del sistema (átomo).

**Ejemplos de nombres incorrectos:**
`Box1`, `ComponentA`, `StyledDiv` → no indican función ni propósito.
`CustomForm` → demasiado genérico, no describe qué tipo de formulario es.
`FormWrapper` → ambiguo, no se sabe qué contenido envuelve o para qué se usa.

#### 3. Desarrolla primero los átomos (componentes sencillos) como botones e inputs.

#### 4. Luego agrúpalos en moléculas (por ejemplo, un input con su etiqueta).

#### 5. Usa moléculas para crear organismos completos (por ejemplo, formularios enteros).

Así, siempre tendrás tu código modular y reutilizable.

---

## Paso 5 – Traducir requerimientos en código

Perfecto. A continuación se explica cómo traducir el campo **“Detalle técnico Frontend”** de la tabla de requerimientos a una implementación basada en:

- **Component-Driven Architecture (CDA)**
- **React (con ES Modules)**
- **Atomic Design como patrón estructural**
- **Styled-components + design tokens** para estilos coherentes y mantenibles

Este enfoque asegura que cada requerimiento funcional, visual o de interacción quede reflejado en componentes reutilizables, trazables y alineados con diseño.

---

### `Page`

**Qué es:** Vista completa asociada a una ruta (`/visa/status`)
**Ubicación:** `src/pages/VisaStatusPage.jsx`

**Contenido típico:**

- Uso de `organisms` para contenido estructurado
- Fetching de datos con hooks
- Estado de carga/error
- Navegación

**Naming convention:**
`NombreEntidadPage.jsx`
Ej: `VisaStatusPage.jsx`, `DashboardPage.jsx`

---

### `Component`

**Qué es:** Unidad de UI reutilizable
**Ubicación:** según atomic level: `atoms/`, `molecules/`, `organisms/`

**Contenido típico:**

- `atoms`: Button, Text, Icon, Input
- `molecules`: Card, FormField, InputWithLabel
- `organisms`: VisaStatusCard, UserProfile, Modal

**Naming convention:**

- Carpeta + archivo = PascalCase
  Ej: `VisaStatusCard/index.jsx`, `Button/index.jsx`

**Con styled-components:**

```js
// components/atoms/Button/index.jsx
import styled from 'styled-components';
import { colors, spacing } from '../../../styles/tokens';

export const Button = styled.button`
  background-color: ${colors.primary};
  padding: ${spacing.sm};
  border-radius: 4px;
  color: white;
`;
```

---

### `Hook`

**Qué es:** Lógica compartida y reutilizable (fetching, formularios, lógica local)
**Ubicación:** `src/hooks/`

**Contenido típico:**

- `useVisaStatus()`: consulta estado de visa
- `useForm()`: manejo y validación de formularios
- `useAuth()`: contexto de sesión

**Naming convention:**
`useNombreEntidadAccion.js`
Ej: `useVisaStatus.js`, `useApproveVisa.js`

---

### `Context`

**Qué es:** Estado global compartido
**Ubicación:** `src/context/`

**Contenido típico:**

- Usuario autenticado
- Tema visual
- Configuraciones del sistema

**Naming convention:**
`NombreContext.js`
Ej: `AuthContext.js`, `ThemeContext.js`

---

### `Form`

**Qué es:** Componente completo de formulario (con validación, estado y envío)
**Ubicación:** `src/components/forms/`

**Contenido típico:**

- `formik` + `zod/yup` para validación
- Uso de `atoms` (Input, Label) y `molecules` (FormRow)
- Integración con hook de datos

**Naming convention:**
`NombreEntidadForm.jsx`
Ej: `ApproveVisaForm.jsx`, `LoginForm.jsx`

---

### `UI State` (`Loading`, `Error`, `Empty`)

**Qué es:** Estados visuales generales del sistema
**Ubicación:** `src/components/ui-states/`

**Contenido típico:**

- `<LoadingSpinner />`
- `<ErrorMessage message="Algo salió mal" />`
- `<EmptyState message="No hay datos disponibles" />`

**Naming convention:**
`LoadingSpinner.jsx`, `ErrorMessage.jsx`

---

### `Template` (Layout)

**Qué es:** Estructura visual base que se reutiliza entre páginas
**Ubicación:** `src/components/templates/`

**Contenido típico:**

- Encabezado + navegación + contenedor de contenido
- Footer, modales globales

**Naming convention:**
`AppLayout.jsx`, `DashboardLayout.jsx`

---

### `Tokens de diseño` (`tokens.js`)

```js
// src/styles/tokens.js

export const colors = {
  primary: '#1e90ff',
  secondary: '#f4f4f4',
  error: '#ff4d4f',
  success: '#52c41a',
  text: '#333',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
};

export const typography = {
  fontBase: '"Roboto", sans-serif',
  fontSize: '16px',
};
```

Usados dentro de componentes con styled-components:

```js
import styled from 'styled-components';
import { colors, spacing } from '../../styles/tokens';

export const Card = styled.div`
  background: ${colors.secondary};
  padding: ${spacing.md};
`;
```

---

---

## Paso 6 – Documentación visual con Storybook

Storybook es una herramienta de desarrollo y documentación que nos permite construir, ver, testear y compartir componentes de UI en aislamiento.

Cada componente tiene una o más historias, que son representaciones visuales del componente en un estado determinado (por ejemplo: botón deshabilitado, input con error, loading, etc.).

> **Importante:** Las “historias” en Storybook no son lo mismo que las historias de usuario.
>
> **Historias de usuario:** necesidades funcionales del sistema (“Como usuario, quiero...”).
> **Historias en Storybook:** ejemplos visuales de cómo se ve y comporta un componente.

1. **Instalar Storybook en React:**

```bash
npx storybook init
npm run storybook
```

2. **Crea historias visuales (`Button.stories.jsx`):**

```jsx
import Button from '../components/atoms/Button';

export default {
  title: 'Átomos/Button',
  component: Button,
};

export const Primary = () => <Button>Enviar</Button>;
export const Danger = () => <Button variant="danger">Borrar</Button>;
```

Esto genera documentación interactiva automáticamente.

---

## Paso 8 – Pruebas finales

Usa Jest para pruebas unitarias y React Testing Library para pruebas interactivas. Esto garantiza calidad y seguridad antes de desplegar tu app.

---

## Paso 9 – Despliegue

Finalmente, construye tu aplicación (`npm run build`) y publícala en tu servicio preferido (Render, AWS, Netlify, Vercel, etc.).

---

## Herramientas recomendadas

Para desarrollar un **frontend en React (como Cliente de Aplicación: CDA)** conectado a un **backend en Node.js con Clean Architecture**, lo ideal es que cada capa del sistema esté claramente definida, organizada y mantenible. A continuación, se detallan las **herramientas recomendadas** para cada lado, con un enfoque en productividad, escalabilidad y buenas prácticas.

| Categoría                       | Herramienta                        | Función / Justificación                                                                             |
| ------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| ⚙️ Empaquetador + Dev Server    | **Vite**                           | Rápido, moderno, tiempos de recarga mínimos. Ideal para proyectos React modulares.                  |
| 🧱 Componentes UI               | **ShadCN UI / Chakra UI / MUI**    | Bibliotecas accesibles, personalizables y listas para producción. ShadCN se adapta bien a Tailwind. |
| 🎨 Estilos                      | **styled-components**              | Estilos en componentes, scoped, soporta theming. Ideal para design tokens y CDA.                    |
| 🎨 Design Tokens                | **Manual (tokens.ts)**             | Define y centraliza colores, tipografías, spacing, etc. para un Design System sólido.               |
| 🔤 Tipografía y escalado        | **capsize / modern-normalize**     | Mejora la consistencia del sistema tipográfico y resetea estilos base del navegador.                |
| 🧭 Ruteo                        | **React Router DOM**               | Control de navegación por rutas. Soporta rutas protegidas, anidadas y dinámicas.                    |
| 🔁 Manejo de estado             | **Zustand / Redux Toolkit**        | Zustand es simple y reactivo. Redux Toolkit es robusto para estados globales complejos.             |
| 🔌 Llamadas a API               | **React Query / Axios**            | React Query gestiona estado de server (loading, error, cache). Axios da control fino.               |
| 💬 Internacionalización         | **i18next**                        | Gestión de contenido multilenguaje, detecta idioma del navegador y soporta traducción dinámica.     |
| 📄 Formularios                  | **React Hook Form**                | Ligero, rápido y controlado sin necesidad de re-renderización global.                               |
| 🔐 Autenticación (cliente)      | **JWT + Context / React Query**    | Manejo de tokens, refresco de sesión, estado del usuario autenticado.                               |
| 📚 Documentación de componentes | **Storybook**                      | Permite aislar, documentar y testear visualmente cada componente en desarrollo.                     |
| 🧪 Testing                      | **Vitest + React Testing Library** | Pruebas unitarias modernas, ligeras y cercanas al comportamiento real del usuario.                  |
| 🧱 Arquitectura de carpetas     | **Basado en Componentes y CDA**    | Organización clara por `atoms`, `molecules`, `organisms`, `templates`, `pages`.                     |
| 🎨 Accesibilidad                | **eslint-plugin-jsx-a11y**         | Linter que advierte sobre problemas de accesibilidad en JSX.                                        |
| 💡 Linting y formato            | **ESLint + Prettier**              | Mantiene estilo de código uniforme y sin errores de sintaxis.                                       |
| 🔍 Análisis de rendimiento      | **React DevTools + Web Vitals**    | Medición en tiempo real del rendimiento y problemas de renderizado.                                 |
| 🧪 Mocking de API               | **MSW (Mock Service Worker)**      | Simula peticiones del backend en local sin necesidad de implementar endpoints reales.               |

{.dense}

---

### Comunicación entre Frontend y Backend

- API REST (`/api/v1/...`)
- Manejo de tokens (JWT) en headers (`Authorization: Bearer`)
- Protección de rutas desde React usando hooks o context
- Si usas React Query o Axios, configura un cliente común (`axiosInstance`) con baseURL y headers

---

### DevOps y Extras

| Herramienta                    | Uso                                  |
| ------------------------------ | ------------------------------------ |
| **Docker**                     | Contenedores para frontend y backend |
| **GitHub Actions / GitLab CI** | CI/CD para pruebas y despliegue      |
| **Render / Vercel / Netlify**  | Despliegue simple de frontend        |
| **PM2 / Docker Compose**       | Orquestación backend en producción   |

{.dense}

# Guía para Construir un sistema de componentes

Este artículo explica, en lenguaje claro y sin rodeos, cómo decidir **en qué nivel vive un componente**, cómo **definir su anatomía y estados**, cómo **conectarlo a tokens** a través de un **tema único (default)** y, sobre todo, **cómo elegir props adecuados**. El ejemplo conductor será el **Botón**, incluyendo casos de solo icono, icono + etiqueta y solo etiqueta.

---

## 1) Elegir el nivel correcto: átomo, molécula, organismo, template o página

Pensar en LEGO ayuda: hay piezas básicas, pequeños conjuntos, bloques grandes y, al final, la construcción completa. Lo mismo pasa con la interfaz.

### Átomos

Un **átomo** es una pieza **pequeña, reutilizable y autosuficiente**.
¿Qué significa “autosuficiente” aquí? Que **no necesita información del negocio ni llamadas a servidores** para existir o mostrarse correctamente. Solo requiere **props simples** (por ejemplo, `variant="solid"`, `disabled`, `onClick`), y con eso ya funciona en cualquier contexto.
**Ejemplos:** Botón, Texto, Input básico, Avatar, Icono.

> “No necesita datos” quiere decir: el componente no depende de una lista de usuarios, un pedido del backend, ni reglas del dominio para renderizarse. Un botón no requiere conocer “qué usuario está logueado” para existir; un campo de entrada no necesita “productos en stock” para dibujarse.

### Moléculas

Una **molécula** combina **dos o tres átomos** para **resolver una mini-tarea completa**.
**Clave para detectarlas:** si se quita una de sus piezas, **el conjunto pierde su sentido original**. Por ejemplo, un **campo de texto completo** (Etiqueta + Input + Mensaje de ayuda u error): si se elimina la etiqueta, se afecta la comprensión y la accesibilidad; si se elimina el mensaje de error, se corta un flujo esencial.
**Ejemplos:** `TextField` (Label + Input + Helper/Error), Tarjeta simple (Imagen + Título).

> “Sin una de sus partes deja de tener sentido” no es poesía: significa que **la intención principal del componente queda incompleta**. Un `TextField` necesita la etiqueta vinculada al input para ser claro y accesible; sin esa relación, **no cumple** su objetivo.

### Organismos

Un **organismo** es un **bloque de pantalla reconocible**: agrupa átomos y moléculas para cumplir una función más amplia. No suele traer datos; **da forma a una sección** que luego la página alimentará.
**Ejemplos:** Barra superior con título y acciones, Tabla con cabecera/filas/paginación.

### Templates

Un **template** es **la maqueta de una página**: organiza **zonas (slots)** como encabezado, menú lateral, contenido principal. Aquí se define el esqueleto, **no el contenido real**.

### Pages

Una **page** es la **pantalla real**: conecta datos, maneja acciones de negocio, navega. Usa el template y los organismos para **llenar** esa estructura con información viva.

---

## 2) Cuando parecía átomo… y resultó ser molécula

Suele ocurrir: se crea un “Input inteligente” que, al final, **incluye etiqueta, contador, error y sugerencias**. Eso **no es un átomo**. Es una **molécula** compuesta por átomos (`Label`, `Input`, `HelperText`, quizá `Icon`).
La forma correcta de enderezarlo:

1. **Separar piezas**: extraer o reutilizar átomos existentes.
2. **Componer la molécula**: orquestar estados (foco, error), relaciones (`label ↔ input`, `aria-describedby`).
3. **Migrar con calma**: si ya existía el “falso átomo”, mantenerlo un tiempo como envoltorio (deprecado) mientras se adoptan las piezas nuevas.

Esta corrección **aumenta la reutilización**, baja la complejidad y mejora la accesibilidad.

---

## 3) Anatomía: desglosar las partes de cada componente

Definir la **anatomía** evita ambigüedades y asegura consistencia:

* **Contenedor**: el marco que envuelve (relleno, borde, fondo).
* **Contenido principal**: el texto o valor.
* **Iconos opcionales**: a izquierda o derecha; o el caso de **solo icono**.
* **Mensajes**: ayuda, error, contadores, badges.
* **Accesibilidad**: relaciones entre etiqueta y control, descripciones, foco.
* **Extras de estado**: spinner de carga, marca de selección, etc.

**Ejemplo (Botón)**: contenedor · etiqueta (opcional) · icono (opcional) · spinner (si `loading`).

---

## 4) Estados: cómo reacciona y cómo se ve

Los estados definen el comportamiento visual ante interacciones. Conviene nombrarlos bien:

* **Default**: aspecto normal, sin interacción.
* **Hover**: “**sobrevolado**” = **puntero del ratón sobre el componente**; suele aclarar u oscurecer levemente, o mostrar un fondo sutil.
* **Focus-visible**: el componente **recibe el foco de teclado** y lo muestra con un halo/contorno visible. Es esencial para accesibilidad.
* **Active**: durante el **clic** (o mientras se pulsa la tecla de acción); puede usar una ligera traslación o sombreado.
* **Disabled**: **no interactúa ni reacciona**; visualmente atenuado y sin cambios en hover/active.
* **Loading**: muestra **spinner** y **bloquea** clics; opcionalmente oculta el contenido mientras tanto.
* **Validación (si aplica)**: `invalid` (error) o `success` (confirmación).

---

## 5) Tokens y tema “default”: la columna vertebral

Los **tokens** son las **decisiones de diseño** del equipo: colores, espacios (4, 8, 12…), radios, sombras, tamaños de texto.
El **tema default** **mapea** esos tokens a **roles semánticos** que los componentes entienden:

* `color.text.primary` / `color.text.inverse`
* `color.bg.surface` / `color.bg.subtle`
* `color.border.default` / `color.border.focus`
* `color.intent.primary | success | warning | danger` (y variantes como `primaryHover`)
* `shadow.focus`, `shadow.sm`
* `space`, `radius`, `type.size`

La regla que sostiene todo: **los componentes solo usan el tema**. Nada de hex ni píxeles sueltos. Si algo falta, **se agrega a tokens/tema**, no en el componente.

---

## 6) Elegir props adecuados: un método práctico

Los **props** son las “perillas” del componente. Deben ser **claros, cortos, predecibles** y **consistentes entre componentes**.

### 6.1 Props visuales (configuran aspecto)

* **`variant`** (énfasis): define la **caja** o presencia visual.
  Valores típicos: `solid`, `outline`, `ghost`, `soft`, `link`.
* **`tone`** (intención): expresa el **significado** (primario, éxito, alerta, peligro, neutro).
  Valores típicos: `primary`, `neutral`, `success`, `warning`, `danger`.
* **`size`** (escala): controla altura, padding, tipografía e icono.
  Valores típicos: `xs`, `sm`, `md`, `lg`.
* **`shape`** (forma): normal, pastilla, cuadrado.
  Valores típicos: `default`, `pill`, `square`.

**Cómo elegirlos bien:**

* **Usar listas cerradas** (no strings libres) para que el diseño sea estable y las decisiones coherentes.
* **No solapar significados**: `variant` controla el “envoltorio visual”; `tone`, el “color semántico”.
* **Definir defaults útiles**: por ejemplo, `size="md"` y `variant="solid"`.

### 6.2 Props de contenido y composición

* **`children`**: el texto o contenido principal.
* **`icon`** y **`iconPosition`**: permiten icono a la izquierda o derecha.
* **`as`**: si en algún caso debe renderizarse como `<a>`, `<div>`, etc.

**Decisiones finas:**

* **Solo icono**: cuando no hay `children`, `icon` pasa a ser **contenido único**; en ese caso **pide `aria-label`** y **usa `shape="square"`** para un área táctil equilibrada.

### 6.3 Props de comportamiento

* **`disabled`**: desactiva interacción.
* **`loading`**: muestra spinner y bloquea clics.
* Eventos como **`onClick`**, **`onChange`**, etc.

**Regla de visibilidad:** cada booleano **debe tener reflejo visual**. Si existe `invalid`, que se vea el borde/error; si hay `loading`, que se vea el spinner.

### 6.4 Props de accesibilidad

* **`aria-label`**: obligatorio cuando **no hay texto visible** (caso solo icono).
* **`aria-describedby`**: vincula mensajes de ayuda o error en controles de formulario.
* **`id`** y relaciones (`label` ↔ `control`) en inputs compuestos.

### 6.5 Qué props **no** poner

* **Props de estilo crudo** (`backgroundColor="#f00"`, `padding="18px"`): rompen la coherencia.
  Si hace falta una nueva apariencia, se crea una **nueva `variant` o `tone`** y, si procede, se amplían **tokens/tema**.

---

## 7) El botón como ejemplo guía

### 7.1 Variantes (énfasis visual)

| Variant     | Uso típico             | Fondo → Hover                    | Texto          | Borde            | Extra                             |
| ----------- | ---------------------- | -------------------------------- | -------------- | ---------------- | --------------------------------- |
| **solid**   | Acción principal (CTA) | `intent[tone]` → más oscuro      | `text.inverse` | —                | `shadow.sm`                       |
| **outline** | Acción secundaria      | `transparent` → `bg.subtle`      | `text.primary` | `border.default` | define jerarquía sin “caja” llena |
| **ghost**   | Acción discreta        | `transparent` → `bg.subtle`      | `intent[tone]` | —                | ideal en toolbars                 |
| **soft**    | Fondo tenue            | `bg.subtle` → un poco más oscuro | `text.primary` | —                | útil en agrupaciones              |
| **link**    | Acción como texto      | `transparent`                    | `intent[tone]` | —                | subrayado, sin caja               |
{.dense}

> “Hover” = **puntero encima**. No confundir con `focus-visible` (uso de teclado).

### 7.2 Tonos (intención)

| Tone        | Significado             | Ejemplos                  |
| ----------- | ----------------------- | ------------------------- |
| **primary** | acción principal/avance | Guardar, Continuar, Crear |
| **neutral** | acción genérica/segura  | Cancelar, Cerrar          |
| **success** | confirmación            | Aprobar, Confirmar        |
| **warning** | precaución              | Revisar, Reintentar       |
| **danger**  | destructiva             | Eliminar, Bloquear        |
{.dense}

### 7.3 Tamaños (escala)

| Size   | Altura | Padding X | Tipografía     | Icono | Recomendación         |
| ------ | -----: | --------: | -------------- | ----: | --------------------- |
| **xs** |  28 px |      8 px | `type.size.xs` | 16 px | controles densos      |
| **sm** |  32 px |     12 px | `type.size.sm` | 18 px | formularios compactos |
| **md** |  40 px |     16 px | `type.size.md` | 20 px | **default** y cómodo  |
| **lg** |  48 px |     20 px | `type.size.lg` | 22 px | CTAs y móvil          |
{.dense}

> Para **solo icono**, conviene **ancho = alto** (forma `square`) y un tamaño **≥ 40 px** para buena pulsación.

### 7.4 Formas (shape)

| Shape       | Esquinas      | Cuándo                            |
| ----------- | ------------- | --------------------------------- |
| **default** | `radius.md`   | uso general                       |
| **pill**    | `radius.pill` | acciones primarias o chips        |
| **square**  | ancho = alto  | **solo icono** (con `aria-label`) |
{.dense}

### 7.5 Combinaciones de contenido

| Tipo                 | Reglas                    | Accesibilidad                         | Sugerencia                         |
| -------------------- | ------------------------- | ------------------------------------- | ---------------------------------- |
| **Solo etiqueta**    | texto claro y breve       | —                                     | `size=md`, `variant` según énfasis |
| **Icono + etiqueta** | `iconPosition=left/right` | icono decorativo `aria-hidden="true"` | útil para acciones memorables      |
| **Solo icono**       | sin `children`            | **`aria-label` obligatorio**          | `shape="square"` y tamaño ≥ 40 px  |
{.dense}

### 7.6 Estados clave y qué cambia

* **Default**: colores de base según `variant` y `tone`.
* **Hover**: ligeros cambios de fondo o brillo (desde el tema).
* **Focus-visible**: halo/sombra de foco (`shadow.focus`) **siempre visible con teclado**.
* **Active**: puede sumar una mínima traslación (“apretar” el botón).
* **Disabled**: opacidad reducida, **sin** reacciones a hover/active.
* **Loading**: spinner centrado y bloqueo de interacción; el contenido puede ocultarse mientras dura.

## 8 Ejemplos en código

¡vamos a armarlo de punta a punta! Aquí tienes **cómo idear, crear y separar** componentes en **Atomic Design** (atoms → molecules → organisms → templates → pages) con **un único tema default**, **tokens de diseño** y **styled-components**. Uso **Botón** como hilo conductor y te dejo **stories** de ejemplo.

---

### 8.1 Tokens (fuente de verdad) + Tema único

**Idea:**

* En **tokens** defines decisiones puras (colores, espacios, radios, tipografías…).
* El **tema** mapea esos tokens a **roles semánticos** (texto, fondo, intenciones).

**`src/design-system/tokens/tokens.js`**

```js
export const tokens = {
  color: {
    brand:   { 500: "#3b82f6", 600: "#2563eb" },
    neutral: { 0:"#fff", 50:"#f8fafc", 100:"#f1f5f9", 200:"#e2e8f0", 300:"#cbd5e1", 600:"#475569", 900:"#0f172a" },
    success: { 500:"#10b981" },
    warning: { 500:"#f59e0b" },
    danger:  { 500:"#ef4444" },
  },
  space: {
    0:"0px", 1:"4px", 2:"8px", 3:"12px", 4:"16px", 5:"20px", 6:"24px", 8:"32px"
  },
  radius: {
    xs:"6px", sm:"8px", md:"10px", lg:"14px", pill:"999px"
  },
  shadow: {
    sm:"0 1px 2px rgba(0,0,0,0.08)",
    focus:"0 0 0 3px rgba(59,130,246,0.35)"
  },
  type: {
    fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial`,
    size: { xs:"12px", sm:"14px", md:"16px", lg:"18px", xl:"20px" },
    weight: { regular:400, medium:500, semibold:600 },
    lineHeight: { normal:1.5 }
  }
};
```

**`src/design-system/theme/theme.js`**

```js
import { tokens } from "../tokens/tokens";

export const defaultTheme = {
  color: {
    text: {
      primary: tokens.color.neutral[900],
      secondary: tokens.color.neutral[600],
      inverse: tokens.color.neutral[0]
    },
    bg: {
      canvas: tokens.color.neutral[50],
      surface: tokens.color.neutral[0],
      subtle: tokens.color.neutral[100]
    },
    border: {
      default: tokens.color.neutral[200],
      strong: tokens.color.neutral[300],
      focus: tokens.color.brand[500]
    },
    intent: {
      primary: tokens.color.brand[500],
      primaryHover: tokens.color.brand[600],
      neutral: tokens.color.neutral[900], // usado para ghost/link neutros
      success: tokens.color.success[500],
      warning: tokens.color.warning[500],
      danger: tokens.color.danger[500]
    }
  },
  space: tokens.space,
  radius: tokens.radius,
  shadow: tokens.shadow,
  type: tokens.type
};

```

**`src/design-system/theme/styled.d.js`**

```js
import { defaultTheme } from "./theme";

export const theme = defaultTheme;
```

**`src/design-system/theme/GlobalStyles.js`**

```js
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.type.fontFamily};
    font-size: ${({ theme }) => theme.type.size.md};
    line-height: ${({ theme }) => theme.type.lineHeight.normal};
    color: ${({ theme }) => theme.color.text.primary};
    background: ${({ theme }) => theme.color.bg.canvas};
  }
`;

```

---

### 8.2 Atomic Design: responsabilidades por nivel

* **Átomos**: piezas mínimas y reutilizables. Sin lógica compleja. Ej.: `Button`.
* **Moléculas**: composición de átomos con una tarea pequeña. Ej.: `ButtonGroup`.
* **Organismos**: bloques UI completos con múltiples moléculas/átomos. Ej.: `Toolbar`.
* **Templates**: estructura de página (layout + slots); sin datos reales. Ej.: `AppShellTemplate`.
* **Pages**: instancia real con datos/estado. Ej.: `UsersPageExample` usando el template.

> Regla: **nadie** usa valores “a mano”. Todo via `theme` → **tokens**.

---

### 8.3 Átomo — `Button`

**Props estándar**

* `variant`: `"solid" | "outline" | "ghost" | "soft" | "link"`
* `tone`: `"primary" | "neutral" | "success" | "warning" | "danger"`
* `size`: `"xs" | "sm" | "md" | "lg"` (default `md`)
* `shape`: `"default" | "pill" | "square"`
* `icon?`: `ReactNode` · `iconPosition?`: `"left" | "right"`
* `fullWidth?`, `loading?`, `disabled?`, `as?`
* **`aria-label` obligatorio si es icon-only** (icono sin texto)

**`src/design-system/atoms/Button.jsx`**

```js
import React from "react";
import styled, { css } from "styled-components";

const sizeMap = {
  xs: { h: 28, px: 8, fs: "xs", icon: 16 },
  sm: { h: 32, px: 12, fs: "sm", icon: 18 },
  md: { h: 40, px: 16, fs: "md", icon: 20 },
  lg: { h: 48, px: 20, fs: "lg", icon: 22 },
};

const StyledButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  height: ${({ $size }) => sizeMap[$size].h}px;
  padding: 0 ${({ $size }) => sizeMap[$size].px}px;
  font-size: ${({ theme, $size }) => theme.type.size[sizeMap[$size].fs]};
  border-radius: ${({ theme, $shape }) =>
    $shape === "pill" ? theme.radius.pill : theme.radius.md};
  border: 1px solid transparent;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: transform 0.02s, box-shadow 0.2s, background-color 0.2s, color 0.2s, border-color 0.2s;

  ${({ $iconOnly, $side }) =>
    $iconOnly &&
    css`
      width: ${$side}px;
      padding: 0;
      justify-content: center;
    `}

  ${({ theme, $variant, $tone }) => {
    const c = theme.color;
    switch ($variant) {
      case "solid":
        return css`
          background: ${c.intent[$tone] ?? c.intent.primary};
          color: ${c.text.inverse};
          box-shadow: ${theme.shadow.sm};
          &:hover {
            background: ${c.intent.primaryHover};
          }
          &:active {
            transform: translateY(1px);
          }
        `;
      case "outline":
        return css`
          background: transparent;
          color: ${c.text.primary};
          border-color: ${c.border.default};
          &:hover {
            background: ${theme.color.bg.subtle};
          }
          &:active {
            transform: translateY(1px);
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          color: ${c.intent[$tone] ?? c.intent.primary};
          &:hover {
            background: ${theme.color.bg.subtle};
          }
          &:active {
            transform: translateY(1px);
          }
        `;
      case "soft":
        return css`
          background: ${theme.color.bg.subtle};
          color: ${c.text.primary};
          &:hover {
            filter: brightness(0.98);
          }
          &:active {
            transform: translateY(1px);
          }
        `;
      case "link":
        return css`
          background: transparent;
          color: ${c.intent[$tone] ?? c.intent.primary};
          text-decoration: underline;
          border-color: transparent;
          padding-left: 0;
          padding-right: 0;
          height: auto;
        `;
      default:
        return "";
    }
  }}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
  &:disabled,
  &[aria-busy="true"] {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    pointer-events: none;
  }
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 0;
  svg,
  img {
    width: ${({ $size }) => sizeMap[$size].icon}px;
    height: ${({ $size }) => sizeMap[$size].icon}px;
  }
`;

const Spinner = styled.span`
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &::after {
    content: "";
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-right-color: transparent;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export function Button({
  variant = "solid",
  tone = "primary",
  size = "md",
  shape = "default",
  fullWidth,
  loading,
  icon,
  iconPosition = "left",
  children,
  "aria-label": ariaLabel,
  ...rest
}) {
  const hasLabel = !!children;
  const hasIcon = !!icon;
  const iconOnly = hasIcon && !hasLabel;

  if (process.env.NODE_ENV !== "production" && iconOnly && !ariaLabel) {
    console.warn("Icon-only Button requiere `aria-label`.");
  }

  const side = sizeMap[size].h;

  return (
    <StyledButton
      $variant={variant}
      $tone={tone}
      $size={size}
      $shape={shape}
      $fullWidth={fullWidth}
      $iconOnly={iconOnly}
      $side={side}
      $loading={loading}
      aria-busy={loading ? "true" : undefined}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading && <Spinner aria-hidden="true" />}
      <span
        style={{
          display: loading ? "none" : "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {hasIcon && !iconOnly && iconPosition === "left" && (
          <IconWrap $size={size}>{icon}</IconWrap>
        )}
        {hasLabel && children}
        {hasIcon && !iconOnly && iconPosition === "right" && (
          <IconWrap $size={size}>{icon}</IconWrap>
        )}
        {iconOnly && <IconWrap $size={size}>{icon}</IconWrap>}
      </span>
    </StyledButton>
  );
}
```

---

### 8.4 Molécula — `ButtonGroup`

**Idea:** agrupa botones manteniendo separación y alineaciones coherentes.

**Props**

* `gap?: keyof DefaultTheme["space"]` (ej.: `2`, `3`, `4`)
* `align?: "start" | "center" | "end" | "space-between"`
* `wrap?: boolean`

**`src/design-system/molecules/ButtonGroup.jsx`**

```js
import styled from "styled-components";

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme, gap = 2 }) => theme.space[gap]};
  justify-content: ${({ align = "start" }) =>
    align === "start"
      ? "flex-start"
      : align === "center"
      ? "center"
      : align === "end"
      ? "flex-end"
      : "space-between"};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
`;
```

---

### 8.5 Organismo — `Toolbar`

**Idea:** barra con título + acciones (grupo de botones).

**Props**

* `title?: string`
* `actions?: React.ReactNode`

**`src/design-system/organisms/Toolbar.jsx`**

```js
import styled from "styled-components";
import { ButtonGroup } from "../molecules/ButtonGroup";

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.color.bg.surface};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.default};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.type.size.lg};
  color: ${({ theme }) => theme.color.text.primary};
`;

export function Toolbar({ title, actions }) {
  return (
    <Bar role="banner" aria-label="Toolbar">
      <Title>{title}</Title>
      <ButtonGroup gap={2} align="end">
        {actions}
      </ButtonGroup>
    </Bar>
  );
}
```

---

### 8.6 Template — `AppShellTemplate`

**Idea:** estructura base: toolbar + contenedor de contenido. No trae datos.

**`src/design-system/templates/AppShellTemplate.jsx`**

```js
import styled from "styled-components";
import { Toolbar } from "../organisms/Toolbar";

const Main = styled.main`
  padding: ${({ theme }) => theme.space[6]};
  max-width: 1040px;
  margin: 0 auto;
`;

export function AppShellTemplate({ title, actions, children }) {
  return (
    <>
      <Toolbar title={title} actions={actions} />
      <Main>{children}</Main>
    </>
  );
}
```

---

### 8.7 Page — `UsersPageExample`

**Idea:** instancia real que pasa datos/handlers a Template/Organismos.

**`src/design-system/pages/UsersPageExample.jsx`**

```js
import { AppShellTemplate } from "../templates/AppShellTemplate";
import { Button } from "../atoms/Button";
import { ButtonGroup } from "../molecules/ButtonGroup";

export function UsersPageExample() {
  return (
    <AppShellTemplate
      title="Usuarios"
      actions={
        <ButtonGroup gap={2}>
          <Button variant="ghost">Importar</Button>
          <Button variant="outline" tone="neutral">Exportar</Button>
          <Button>Nuevo usuario</Button>
        </ButtonGroup>
      }
    >
      {/* Contenido de la página */}
      <p>Listado de usuarios…</p>
    </AppShellTemplate>
  );
}
```

---

## 9 Storybook: stories de cada nivel

> Asumo que ya tienes `.storybook/main.js` y `preview.jsx` con `ThemeProvider` y `GlobalStyles` (como te mostré antes).

### 9.1 Átomo — `Button.stories.jsx`

```js
import React from "react";
import { Button } from "../../design-system/atoms/Button";

const SaveIcon = (p) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" {...p}>
    <path d="M5 3h11l3 3v15H5V3zm2 2v4h8V5H7zm8 14v-6H7v6h8z" fill="currentColor" />
  </svg>
);

const meta = {
  title: "Design System/Atoms/Button",
  component: Button,
  args: { children: "Button", variant: "solid", tone: "primary", size: "md", shape: "default" },
  tags: ["autodocs"]
};
export default meta;

export const Playground = {};
export const LabelOnly = { args: { children: "Guardar" } };
export const IconLeft = { args: { children: "Guardar", icon: <SaveIcon />, iconPosition: "left" } };
export const IconOnly = { args: { icon: <SaveIcon />, children: undefined, "aria-label": "Guardar", shape: "square" } };

export const Variants = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline" tone="neutral">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="soft">Soft</Button>
      <Button {...args} variant="link" as="a" href="#">Link</Button>
    </div>
  )
};

export const Sizes = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button {...args} size="xs">XS</Button>
      <Button {...args} size="sm">SM</Button>
      <Button {...args} size="md">MD</Button>
      <Button {...args} size="lg" icon={<SaveIcon />}>LG + Icon</Button>
    </div>
  )
};

export const LoadingAndDisabled = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} loading>Procesando…</Button>
      <Button {...args} disabled variant="outline" tone="neutral">Deshabilitado</Button>
      <Button {...args} icon={<SaveIcon />} shape="square" aria-label="Guardando" loading />
    </div>
  )
};
```

### 9.2 Molécula — `ButtonGroup.stories.jsx`

```js
import React from "react";
import { ButtonGroup } from "../../design-system/molecules/ButtonGroup";
import { Button } from "../../design-system/atoms/Button";

export default {
  title: "Design System/Molecules/ButtonGroup",
  component: ButtonGroup,
  args: { gap: 2, align: "start", wrap: false },
  tags: ["autodocs"]
};

export const Basic = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" tone="neutral">Cancelar</Button>
      <Button>Guardar</Button>
    </ButtonGroup>
  )
};

export const ResponsiveWrap = {
  args: { wrap: true, gap: 3, align: "space-between" },
  render: (args) => (
    <div style={{ width: 320, border: "1px dashed #ccc", padding: 8 }}>
      <ButtonGroup {...args}>
        <Button variant="ghost">Importar</Button>
        <Button variant="outline" tone="neutral">Exportar</Button>
        <Button>Nuevo</Button>
      </ButtonGroup>
    </div>
  )
};
```

### 9.3 Organismo — `Toolbar.stories.jsx`

```js
import React from "react";
import { Toolbar } from "../../design-system/organisms/Toolbar";
import { Button } from "../../design-system/atoms/Button";

export default {
  title: "Design System/Organisms/Toolbar",
  component: Toolbar,
  args: { title: "Usuarios" },
  tags: ["autodocs"],
};

export const WithActions = {
  render: (args) => (
    <Toolbar
      {...args}
      actions={
        <>
          <Button variant="ghost">Importar</Button>
          <Button variant="outline" tone="neutral">
            Exportar
          </Button>
          <Button>Nuevo usuario</Button>
        </>
      }
    />
  ),
};
```

### 9.4 Template — `AppShellTemplate.stories.jsx`

```js
import React from "react";
import { AppShellTemplate } from "../../design-system/templates/AppShellTemplate";
import { Button } from "../../design-system/atoms/Button";

export default {
  title: "Design System/Templates/AppShellTemplate",
  component: AppShellTemplate,
  args: { title: "Usuarios" },
  tags: ["autodocs"],
};

export const Basic = {
  render: (args) => (
    <AppShellTemplate
      {...args}
      actions={
        <>
          <Button variant="outline" tone="neutral">Exportar</Button>
          <Button>Nuevo</Button>
        </>
      }
    >
      <p>Contenido de ejemplo…</p>
    </AppShellTemplate>
  ),
};
```

### 9.5 Page — `UsersPageExample.stories.jsx`

```js
import React from "react";
import { UsersPageExample } from "../../design-system/pages/UsersPageExample";

export default {
  title: "App/Pages/UsersPageExample",
  component: UsersPageExample,
};

export const Demo = {
  render: () => <UsersPageExample />,
};
```

---
