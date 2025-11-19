# Administrador de Gastos Compartidos

Aplicación web desarrollada con Next.js para gestionar gastos entre grupos de personas.

## Características

- ✅ Crear grupos con múltiples integrantes
- ✅ Registrar gastos con descripción, monto, moneda y participantes
- ✅ Conversión automática de monedas usando la API de exchangerate.host
- ✅ Almacenamiento en localStorage del navegador
- ✅ Cálculo de balances simplificado
- ✅ Visualización con gráficos interactivos (Recharts)

## Instalación y ejecución

### Opción 1: Usando shadcn CLI (Recomendado)

\`\`\`bash
npx shadcn@latest init
# Sigue las instrucciones y selecciona este proyecto
\`\`\`

### Opción 2: Instalación manual

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del proyecto

\`\`\`
├── app/
│   ├── api/                 # APIs (simplificadas para v0)
│   ├── group/[id]/          # Página de detalle de grupo
│   └── page.tsx             # Página principal
├── components/
│   ├── group-card.tsx       # Tarjeta de grupo
│   ├── create-group-dialog.tsx  # Diálogo para crear grupos
│   ├── add-expense-dialog.tsx   # Diálogo para agregar gastos
│   ├── expense-list.tsx     # Lista de gastos
│   ├── balance-view.tsx     # Vista de balances y liquidaciones
│   └── expense-charts.tsx   # Gráficos de gastos
├── lib/
│   ├── client-storage.ts    # Manejo de localStorage
│   ├── exchange-rate.ts     # Integración con API de tipos de cambio
│   └── balance-calculator.ts # Cálculo de balances
└── types/
    └── index.ts             # Definiciones de tipos TypeScript
\`\`\`

## Funcionalidades principales

### 1. Gestión de grupos
- Crear grupos con nombre y moneda base
- Agregar múltiples miembros al grupo
- Ver lista de todos los grupos
- Eliminar grupos (también elimina sus gastos)

### 2. Registro de gastos
- Descripción del gasto
- Monto y moneda (con conversión automática)
- Selección de quien pagó
- Selección de participantes (split personalizado)
- Categorización de gastos
- Fecha automática

### 3. Cálculo de balances
- Muestra cuánto pagó cada persona
- Calcula cuánto debería haber pagado cada uno
- Genera balance (positivo si se le debe, negativo si debe)
- Proporciona liquidación simplificada de pagos

### 4. Visualizaciones
- Gráfico de barras: gastos totales por persona
- Gráfico circular: distribución por categoría
- Tabla detallada con estadísticas

## API de conversión de monedas

La aplicación usa la API gratuita de [exchangerate.host](https://exchangerate.host) para obtener tipos de cambio en tiempo real. Los tipos de cambio se cachean en localStorage durante 1 hora para optimizar las solicitudes.

## Almacenamiento de datos

Los datos se guardan en **localStorage** del navegador, lo que significa:
- ✅ No requiere base de datos ni servidor
- ✅ Los datos persisten entre sesiones
- ⚠️ Los datos son locales a cada navegador
- ⚠️ Limpiar el caché del navegador eliminará los datos

## Tecnologías utilizadas

- **Next.js 16** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **Recharts** - Gráficos
- **shadcn/ui** - Componentes de UI
- **date-fns** - Manejo de fechas
- **exchangerate.host API** - Conversión de monedas

## Decisiones técnicas importantes

1. **Almacenamiento en localStorage**: Se usa localStorage del navegador para la persistencia de datos, ideal para aplicaciones cliente y entornos como v0.

2. **Sin autenticación**: No se implementó sistema de login/registro ya que no se cubrió JWT en el curso. Los datos son locales a cada navegador.

3. **Conversión de monedas**: Se integró la API de exchangerate.host con sistema de caché para evitar llamadas excesivas.

4. **Algoritmo de liquidación**: Se usa un algoritmo básico greedy que empareja acreedores con deudores de mayor a menor balance, priorizando simplicidad sobre optimización mínima de transacciones.

5. **Cálculo de balances**: El sistema calcula cuánto pagó cada persona vs. cuánto debería haber pagado según su participación en cada gasto, todo convertido a la moneda base del grupo.

## Autor

Desarrollado como trabajo práctico del curso de Aplicaciones Web con Next.js.
