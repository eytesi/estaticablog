# ESTÁTICA — Setup Guide

## Estructura
```
/
├── index.html       ← Blog home
├── post.html        ← Entrada individual
├── admin/
│   ├── index.html   ← Panel de escritura (Decap CMS)
│   └── config.yml   ← Configuración del CMS
├── posts/           ← Archivos .md (creados por el CMS)
└── images/uploads/  ← Imágenes subidas
```

## Deploy en Vercel

1. Subí todos los archivos a un repo en GitHub
2. Conectá el repo en Vercel (Framework: Other)
3. Deploy — el sitio funciona de inmediato con los posts de muestra

## Activar el CMS (para escribir desde el browser)

El CMS requiere GitHub OAuth para autenticarte. Pasos:

### 1. Crear OAuth App en GitHub
- GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
- Application name: `ESTÁTICA CMS`
- Homepage URL: `https://tu-dominio.vercel.app`
- Callback URL: `https://estatica-oauth.vercel.app/callback`

Guardá el **Client ID** y **Client Secret**.

### 2. Deploy del proxy OAuth
Es un server minúsculo que maneja el login. La forma más fácil:

```bash
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider
# Crear .env con:
# OAUTH_CLIENT_ID=tu_client_id
# OAUTH_CLIENT_SECRET=tu_client_secret
# GIT_HOSTNAME=https://github.com
```
Deploy este proyecto en Vercel también (es otro proyecto separado). Anotá la URL que te da.

### 3. Actualizar config.yml
```yaml
backend:
  name: github
  repo: TU_USUARIO/TU_REPO
  branch: main
  base_url: https://URL_DEL_PROXY_OAUTH.vercel.app
```

### 4. ¡Listo!
Entrá a `tu-dominio.vercel.app/admin/` y logeate con GitHub.

## Agregar una entrada nueva (modo manual, sin CMS)

Si preferís no configurar el OAuth todavía, podés agregar posts directamente en el array `POSTS` dentro de `index.html` y `post.html`.

Cada post tiene esta estructura:
```js
{
  slug: 'url-de-la-entrada',
  title: 'Título de la entrada',
  excerpt: 'Resumen corto.',
  date: '2025-05-12',
  category: 'trabajo', // trabajo | actualidad | lgbtq | salud | personal
  tags: ['tag1', 'tag2'],
  readTime: 6,
  featured: false, // solo uno puede ser true
  content: `<p>HTML del contenido...</p>`,
}
```

## Categorías y colores
| Categoría  | Color            |
|------------|------------------|
| trabajo    | Amarillo #f5df00 |
| actualidad | Magenta #ff2566  |
| lgbtq      | Azul #3d5aff     |
| salud      | Verde #00d46a    |
| personal   | Naranja #ff5200  |
