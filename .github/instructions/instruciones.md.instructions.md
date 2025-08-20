# 📘 Guía Centralizada de Reglas para Desarrollo Frontend en React

## 1. Principios Fundamentales

- **CDA (Component-Driven Architecture)**: todo parte de componentes reutilizables.  
- **Atomic Design**: organización en niveles (átomos → moléculas → organismos → templates → pages).  
- **Design System + Tokens**: un único lenguaje visual y semántico, centralizado en `tokens`.  
- **Storybook**: documentación visual, pruebas de estados y comunicación con diseño/QA.  

---

## 2. Flujo con Diseño

- Entregar archivos en **Figma** con:
  - Pantallas completas y **componentes individuales**.
  - Estados visuales: hover, focus-visible, active, disabled, loading, error, success.  
  - **Tokens definidos globalmente** (colores, tipografía, spacing, sombras).  

👉 Ejemplo de petición:  
> Necesitamos que entreguen componentes aislados (botón, input, tarjeta), cada uno con **todas sus variantes visuales** y que los tokens estén en Figma como estilos globales.

---

## 3. Tokens y Tema Default

- **Tokens = decisiones crudas de diseño** (colores, spacing, radios, tipografía).  
- **Tema = mapeo semántico de tokens** (ej. `color.intent.primary`, `color.bg.surface`).  
- **Regla de oro**:  
  **ningún componente usa hex ni pixeles sueltos → todo debe venir del `theme`.**

👉 Ubicación:  
```
src/design-system/tokens/
src/design-system/theme/
```

Ejemplo:

```js
// tokens.js
export const tokens = {
  color: { brand: { 500: "#3b82f6" }, neutral: { 0: "#fff", 900: "#0f172a" } },
  space: { 0:"0px", 1:"4px", 2:"8px", 4:"16px" },
  radius: { sm:"6px", md:"10px", pill:"999px" },
  type: { size: { sm:"14px", md:"16px" } }
};

// theme.js
export const defaultTheme = {
  color: {
    text: { primary: tokens.color.neutral[900], inverse: tokens.color.neutral[0] },
    bg: { surface: tokens.color.neutral[0], subtle: tokens.color.neutral[100] },
    intent: { primary: tokens.color.brand[500], danger: "#ef4444" }
  },
  space: tokens.space,
  radius: tokens.radius,
  type: tokens.type
};
```

---

## 4. Atomic Design: Responsabilidades Claras

| Nivel      | Regla clave                                                                 | Ejemplos                           |
| ---------- | --------------------------------------------------------------------------- | ---------------------------------- |
| Átomos     | **Autosuficientes, sin lógica de negocio ni datos**. Props simples.         | Button, Input, Icon, Text          |
| Moléculas  | **Combinan átomos** para una mini-tarea completa.                           | TextField (Label + Input + Error)  |
| Organismos | **Bloques reconocibles** que agrupan átomos/moléculas.                      | Navbar, LoginForm, Table           |
| Templates  | **Maqueta de la página** (layout + slots).                                  | AppShellTemplate, DashboardLayout  |
| Pages      | **Pantalla real con datos y negocio**.                                      | LoginPage, UsersPage               |

👉 Regla práctica:  
- Si un componente **necesita datos de negocio** → ya no es átomo/molécula, es **page** u organismo conectado.  
- Si “parece átomo pero incluye Label + Error + Icono” → es molécula.  

---

## 5. Anatomía de Componentes

Cada componente debe documentar su **anatomía mínima**:

- Contenedor  
- Contenido principal (texto, valor)  
- Iconos opcionales (izq/dcha)  
- Mensajes (error, ayuda, contador)  
- Estados extra (`loading`, selección, validación)  
- Accesibilidad (foco, roles, aria-*)

👉 Ejemplo (Botón): contenedor · etiqueta · icono · spinner.  

---

## 6. Estados Estándar

Todo componente interactivo debe contemplar:

- `default`  
- `hover` (puntero sobre)  
- `focus-visible` (accesibilidad teclado)  
- `active` (clic o tecla)  
- `disabled` (sin interacción)  
- `loading` (spinner, bloquea)  
- `invalid/success` (validación, si aplica)  

---

## 7. Props: Reglas de Uso

- **Visuales**:  
  - `variant`: `"solid" | "outline" | "ghost" | "soft" | "link"`  
  - `tone`: `"primary" | "neutral" | "success" | "warning" | "danger"`  
  - `size`: `"xs" | "sm" | "md" | "lg"`  
  - `shape`: `"default" | "pill" | "square"`  

- **Composición**:  
  - `children`, `icon`, `iconPosition`, `as`  
  - **Solo icono = requiere `aria-label` + `shape="square"`**  

- **Comportamiento**:  
  - `disabled`, `loading`, eventos (`onClick`, etc.)  

- **Accesibilidad**:  
  - `aria-label` obligatorio cuando no hay texto.  
  - `aria-describedby` para vincular mensajes de error.  

🚫 **No permitido:** props de estilo crudo (`backgroundColor="#f00"`) → todo debe pasar por tokens/tema.  

---

## 8. Convenciones de Nombres y Ubicación

- **Átomos**: `src/design-system/atoms/Button/Button.jsx`  
- **Moléculas**: `src/design-system/molecules/TextField/TextField.jsx`  
- **Organismos**: `src/design-system/organisms/LoginForm/LoginForm.jsx`  
- **Templates**: `src/design-system/templates/DashboardLayout.jsx`  
- **Pages**: `src/pages/LoginPage.jsx`  

Naming = **PascalCase**, semántico y autoexplicativo.  
Ejemplos ✅: `UserCard`, `InputWithLabel`, `DashboardLayout`  
Ejemplos ❌: `Box1`, `ComponentA`, `CustomForm`  

---

## 9. Storybook

- Cada componente tiene sus `.stories.jsx` en la misma carpeta.  
- Historias deben cubrir: variantes, tamaños, estados (`loading`, `disabled`, `focus`).  
- Usar `args` y `controls` para props.  

Ejemplo:

```js
export const Variants = {
  render: (args) => (
    <>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </>
  )
};
```

---

## 10. Testing

- **Jest + React Testing Library**.  
- Cada átomo/molécula debe tener pruebas mínimas:  
  - Renderizado correcto  
  - Props reflejadas en UI  
  - Accesibilidad (aria-roles, focus-visible)  

---

## 11. Despliegue y Mantenimiento

- Compilar con `vite build`.  
- Desplegar en Vercel / Netlify / AWS.  
- **Nunca modificar componentes en caliente con estilos inline** → ampliar tokens/tema si falta algo.  

---

⚡ **Regla final:**  
El **Design System es la fuente de verdad**. Si un diseño o prop no existe, **primero se define en tokens/tema, luego se implementa en componentes**.  