# Cliente React - Consulta de Acciones

## 📋 Descripción General

Esta es una **aplicación web SPA (Single Page Application)** construida con **React** y **Vite** que permite consultar datos históricos y en tiempo real del mercado de acciones. El cliente se comunica de manera asíncrona con un backend (gateway Spring) a través de llamadas HTTP REST en formato JSON.

### Características Principales:
- 🔍 **Búsqueda de acciones** por símbolo (ejemplo: AAPL, GOOGL, MSFT)
- 📊 **Múltiples tipos de consulta**: 
  - Daily (datos diarios)
  - Weekly (datos semanales)
  - Monthly (datos mensuales)
  - Intraday (datos intradía con intervalos personalizables)
- 📈 **Visualización de resultados** en tiempo real
- ⚡ **Comunicaciones asíncronas** con manejo de errores
- 🎯 **Interfaz responsiva y moderna**

---

## 🏗️ Arquitectura de Componentes

### Estructura del Proyecto:
```
src/
├── App.jsx                 # Componente principal - controla lógica de fetch y estado global
├── main.jsx               # Punto de entrada de React
├── index.js               # Configuración de React DOM
├── style.css              # Estilos globales
├── components/
│   ├── QueryForm.jsx      # Formulario para ingreso de parámetros de búsqueda
│   └── Results.jsx        # Componente para visualizar los resultados
```

### Flujo de Componentes:

```
App (Component Principal)
  │
  ├─→ QueryForm → Envía parámetros de búsqueda
  │
  ├─→ Results → Muestra datos récibidos
```

---

## 🔄 Flujo de Funcionamiento

### 1. **Interacción del Usuario**
El usuario accede a la aplicación y utiliza el componente `QueryForm` para:
- Ingresar un **símbolo de acción** (ej: AAPL)
- Seleccionar el **tipo de datos** (Daily, Weekly, Monthly, Intraday)
- Si elige Intraday, seleccionar el **intervalo** (5min, 15min, 30min, 60min)

### 2. **Envío de la Consulta**
Cuando el usuario envía el formulario, `App.jsx` dispara un `useEffect` que:
- Construye una URL con parámetros: `${API_BASE}/stocks?symbol=AAPL&type=daily`
- Realiza una solicitud **GET asíncrona** usando `fetch()`
- Si la acción es Intraday, incluye el parámetro `intradayInterval`

### 3. **Gestión de Estados**
La aplicación mantiene los siguientes estados:
- `query`: Los parámetros de búsqueda actuales
- `data`: Los datos de la acción recibidos del backend
- `loading`: Indicador de carga para mostrar mensajes al usuario
- `error`: Mensajes de error si la solicitud falla

### 4. **Procesamiento de Respuesta**
- Si la respuesta es **exitosa (200)**: Se parsea el JSON y se almacena en `data`
- Si hay **error de servidor**: Se muestra el mensaje de error
- Si el usuario **cancela la solicitud**: Se aborta silenciosamente (AbortController)

### 5. **Visualización de Resultados**
El componente `Results` recibe los datos y los renderiza en una interfaz visual, mostrando información histórica o en tiempo real de la acción.

---

## 🛠️ Configuración y Instalación

### Requisitos Previos:
- Node.js (v14 o superior)
- npm (incluido con Node.js)

### Pasos de Instalación:

#### 1. **Clonar o descargar el proyecto**
```bash
cd cliente-rest-react
```

#### 2. **Crear archivo `.env`** en la raíz del proyecto
```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

Si no especificas esta variable, la aplicación usa por defecto: `http://localhost:8080/api`

#### 3. **Instalar dependencias**
```bash
npm install
```

#### 4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

#### 5. **Construir para producción**
```bash
npm run build
```

---

## 📡 Comunicación con el Backend

### Endpoint Base:
```
GET ${REACT_APP_API_BASE_URL}/stocks
```

### Parámetros de Consulta:
| Parámetro | Tipo | Requerido | Ejemplo |
|-----------|------|-----------|---------|
| `symbol` | string | ✅ Sí | AAPL |
| `type` | string | ✅ Sí | daily, weekly, monthly, intraday |
| `intradayInterval` | string | ❌ No (solo para intraday) | 5min, 15min, 30min, 60min |

### Ejemplo de Solicitud:
```
GET http://localhost:8080/api/stocks?symbol=AAPL&type=daily
GET http://localhost:8080/api/stocks?symbol=GOOGL&type=intraday&intradayInterval=30min
```

### Formato de Respuesta Esperada:
```json
{
  "symbol": "AAPL",
  "type": "daily",
  "data": [
    {
      "timestamp": "2024-02-23",
      "open": 189.45,
      "high": 191.23,
      "low": 189.10,
      "close": 190.85,
      "volume": 52340000
    }
  ]
}
```
---

## 👥 Uso

1. **Abre la aplicación** en el navegador
2. **Ingresa un símbolo de acción** (AAPL, GOOGL, MSFT, etc.)
3. **Selecciona el tipo de datos** que deseas consultar
4. **Si es Intraday**, elige el intervalo de tiempo
5. **Observa los resultados** en la sección de visualización
6. **Realiza nuevas consultas** tantas veces como necesites