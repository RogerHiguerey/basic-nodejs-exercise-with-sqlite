# Guía paso a paso para crear un proyecto Node.js desde cero

## Paso 1: Instalar Node.js

1. Visita [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (Long Term Support) para tu sistema operativo
3. Ejecuta el instalador y sigue las instrucciones en pantalla
4. Verifica la instalación abriendo una terminal y ejecutando:
   ```
   node --version
   npm --version
   ```

## Paso 2: Crear el directorio del proyecto

1. Abre una terminal
2. Navega al directorio donde quieres crear tu proyecto
3. Crea un nuevo directorio y navega a él:
   ```
   mkdir mi-proyecto-nodejs
   cd mi-proyecto-nodejs
   ```

## Paso 3: Inicializar el proyecto

1. Ejecuta el siguiente comando para crear un `package.json`:
   ```
   npm init -y
   ```
2. Esto creará un archivo `package.json` con configuración por defecto

## Paso 4: Editar package.json

1. Abre `package.json` en un editor de texto
2. Modifica los campos según tus necesidades. 
   Por ejemplo:
   ```
   "type": "module",
   ```
   ```json
   {
     "name": "mi-proyecto-nodejs",
     "version": "1.0.0",
     "description": "Mi primer proyecto Node.js",
     "main": "index.js",
     "type": "module",
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
     },
     "keywords": ["node", "principiante"],
     "author": "Tu Nombre",
     "license": "ISC"
   }
   ```

## Paso 5: Instalar dependencias

1. Instala las dependencias que necesites. Por ejemplo, para un servidor web básico:
   ```
   npm install express
   ```
2. Para herramientas de desarrollo, usa la bandera `--save-dev`:
   ```
   npm install --save-dev nodemon
   ```

## Paso 6: Crear el archivo principal

1. Crea un archivo `index.js` en la raíz del proyecto:
   ```
   touch index.js
   ```
2. Abre `index.js` y añade un código básico:
   ```javascript
   const express = require('express');
   const app = express();
   const port = 3000;

   app.get('/', (req, res) => {
     res.send('¡Hola Mundo!');
   });

   app.listen(port, () => {
     console.log(`Servidor corriendo en http://localhost:${port}`);
   });
   ```

## Paso 7: Crear un archivo .gitignore

1. Crea un archivo `.gitignore`:
   ```
   touch .gitignore
   ```
2. Añade las siguientes líneas:
   ```
   node_modules/
   .env
   ```

## Paso 8: Inicializar un repositorio Git (opcional)

1. Inicializa un repositorio Git:
   ```
   git init
   ```
2. Añade los archivos al staging:
   ```
   git add .
   ```
3. Haz tu primer commit:
   ```
   git commit -m "Inicialización del proyecto"
   ```

## Paso 9: Ejecutar el proyecto

1. Para iniciar el servidor:
   ```
   npm start
   ```
2. Para desarrollo con recarga automática:
   ```
   npm run dev
   ```

## Paso 10: Estructurar el proyecto (para proyectos más grandes)
```
project/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── views/
│   │   ├── dashboard.html
│   │   └── styles.css
│   └── app.js
├── package.json
└── .gitignore
```

Para proyectos más grandes, considera crear la siguiente estructura de directorios:

```
project/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
├── public/
├── tests/
├── index.js
├── package.json
├── .env
└── .gitignore
```

## Próximos pasos

- Aprende más sobre Express.js para crear APIs robustas
- Investiga sobre bases de datos como MongoDB o PostgreSQL
- Explora herramientas de prueba como Jest o Mocha
- Considera usar TypeScript para un tipado más fuerte