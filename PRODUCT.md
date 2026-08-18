# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Reclutadores y empresas evaluando a Nikenver Pulgar para roles de desarrollo Full Stack (Angular/Laravel). Llegan buscando evidencia de trabajo real, no solo un CV — quieren confirmar que la experiencia declarada es concreta y verificable antes de escribirle.

## Product Purpose

Portfolio profesional que muestra la trayectoria y capacidad técnica real de Nikenver, con el objetivo de que un reclutador o empresa decida contactarlo directamente. Éxito = una decisión de contacto informada, sin fricción.

## Positioning

A diferencia de un portfolio con proyectos de práctica o tutorial, este muestra casos de estudio reales y en producción — Subladmin (ERP con lógica FEFO/FIFO y RLS), Axsence (e-commerce con SSR y diagnóstico olfativo por algoritmo) y Sublimax (el negocio real que fundó) — cada uno con demo en vivo o código público, y las decisiones técnicas explicadas, no solo listadas.

## Operating Context

Sitio 100% estático (sin backend), navegado indistintamente en español o inglés, con tema oscuro/claro/sistema. Contacto directo por correo, teléfono o LinkedIn — deliberadamente sin formularios ni captura de datos.

## Capabilities and Constraints

- Angular 19 (standalone components, signals) + Tailwind CSS v4.
- Datos de proyectos y experiencia en JSON estático (`public/data/`), sin backend — decisión deliberada por ahora, no descartada para el futuro (hay un backend Laravel en el repo, actualmente desconectado).
- Internacionalización ES/EN propia (servicio de Signals + diccionario), sin librería externa.
- Tema claro/oscuro/sistema vía variables CSS, sin librería externa.

## Brand Commitments

Identidad "Dark Precision": oscuro por defecto, acentos cian/ámbar/violeta, tipografía Syne (display) + IBM Plex Sans + JetBrains Mono. Marca "NP." en el header. Sin formularios de contacto — filosofía explícita de "sin fricciones".

## Evidence on Hand

Casos de estudio reales con demo en vivo o repositorio público: Subladmin (sublabmin.vercel.app), Axsence (axsence.web.app), Isla de los Dinosaurios (isla-dinosaurio-app.vercel.app + GitHub). Datos de experiencia y proyectos extraídos de dos CVs del usuario y del código fuente real de cada proyecto. No hay testimonios de clientes ni métricas de negocio públicas — no inventar ninguna.

## Product Principles

1. **Evidencia real sobre relleno** — cada proyecto mostrado es verificable (demo vivo o código), nunca ficticio ni exagerado.
2. **Sin fricción para el visitante** — sin formularios ni pasos innecesarios; contacto directo siempre a un clic.
3. **Bilingüe de verdad** — todo el contenido (UI y datos) tiene ES/EN completo, no solo la interfaz.
4. **Estático y simple hasta que haga falta lo contrario** — sin backend ni dependencias nuevas salvo que resuelvan un problema real.
