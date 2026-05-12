# Palvi Dashboard

## Install

npm install

## Run

npm run dev

Decisiones técnicas

Se desarrolló la aplicación en React + TypeScript para mantener una estructura moderna, reutilizable y fácil de extender.
Se utilizó una arquitectura basada en componentes (GeneralDashboard, ExecutiveDashboard, gráficos y paneles de insights) para separar responsabilidades y facilitar futuras mejoras.
Los datos son leídos dinámicamente desde el archivo metrics, permitiendo cambiar entre los datasets A, B, C y D sin modificar código fuente.
Se incorporó un selector de período de días para mejorar el análisis visual y permitir comparar tendencias de corto y largo plazo.
Los gráficos fueron implementados con Recharts por su integración simple con React y su capacidad de crear dashboards ejecutivos claros y responsivos.
El dashboard fue diseñado pensando en preguntas ejecutivas que deben responderse en menos de 5 minutos, priorizando KPIs visibles, alertas, tendencias y riesgos operacionales.

Se agregaron secciones diferenciadas:
Executive Summary
Today’s Focus
KPI Cards
Funnel de ventas
Tendencias
Riesgos y observaciones
La interfaz fue construida con foco en claridad visual y experiencia de usuario, permitiendo navegar rápidamente entre datasets y dashboards.

Segunda iteración
Incorporar conexión a backend/API real para consumir métricas en tiempo real.
Agregar autenticación y perfiles de usuario (ejecutivo, vendedor, administrador).
Implementar persistencia de configuraciones y filtros personalizados.
Incorporar más tipos de gráficos y análisis predictivo usando tendencias históricas.
Permitir exportar dashboards a PDF o Excel.
Agregar alertas automáticas inteligentes basadas en umbrales y anomalías.