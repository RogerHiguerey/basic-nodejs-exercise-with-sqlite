# Documentación detallada del proyecto Node.js Express SQLite CRUD

## Índice
1. [package.json](#packagejson)
2. [src/app.js](#srcappjs)
3. [src/config/database.js](#srcconfigdatabasejs)
4. [src/models/User.js](#srcmodelsUserjs)
5. [src/controllers/userController.js](#srccontrollersuserControllerjs)
6. [src/routes/userRoutes.js](#srcroutesuserRoutesjs)
7. [src/views/dashboard.html](#srcviewsdashboardhtml)
8. [src/views/styles.css](#srcviewsstylescss)

---

## package.json

```json
{
  "name": "node-express-sqlite-crud",
  "version": "1.0.0",
  "description": "A basic full stack CRUD application using ECMAScript modules",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "sqlite3": "^5.0.2",
    "sqlite": "^4.0.23"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

### Explicación detallada:

- `"name"`: Nombre del proyecto.
- `"version"`: Versión actual del proyecto.
- `"description"`: Breve descripción del proyecto.
- `"main"`: Punto de entrada principal de la aplicación.
- `"type": "module"`: Indica que este proyecto utiliza ECMAScript modules.
- `"scripts"`: 
  - `"start"`: Comando para iniciar la aplicación en producción.
  - `"dev"`: Comando para iniciar la aplicación en modo desarrollo con recarga automática.
- `"dependencies"`: Librerías necesarias para que la aplicación funcione:
  - `"express"`: Framework web para Node.js.
  - `"sqlite3"`: Driver de SQLite para Node.js.
  - `"sqlite"`: Wrapper de promesas para sqlite3.
- `"devDependencies"`: 
  - `"nodemon"`: Utilidad que monitoriza cambios en el código y reinicia automáticamente el servidor.

---

## src/app.js

```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Explicación detallada:

1. Importaciones:
   - `express`: Framework web para crear el servidor.
   - `path`: Módulo para manejar rutas de archivos.
   - `fileURLToPath`: Función para convertir URL a rutas de archivo.
   - `userRoutes`: Rutas relacionadas con los usuarios.

2. Configuración de __dirname:
   - En ESM, `__dirname` no está disponible, por lo que se crea manualmente.

3. Configuración de Express:
   - `app.use(express.json())`: Permite parsear JSON en las solicitudes.
   - `app.use(express.urlencoded({ extended: true }))`: Permite parsear datos de formularios.
   - `app.use(express.static(...))`: Sirve archivos estáticos desde el directorio 'views'.

4. Rutas:
   - `app.use('/api/users', userRoutes)`: Todas las rutas que comiencen con '/api/users' se manejarán en userRoutes.
   - `app.get('/', ...)`: Ruta principal que sirve el archivo dashboard.html.

5. Inicio del servidor:
   - `app.listen(...)`: Inicia el servidor en el puerto especificado.

---

## src/config/database.js

```javascript
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

export async function getDb() {
  const db = await dbPromise;
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  return db;
}
```

### Explicación detallada:

1. Importaciones:
   - `sqlite3`: Driver de SQLite para Node.js.
   - `open` de `sqlite`: Función para abrir una conexión a la base de datos.

2. Configuración de la base de datos:
   - `dbPromise`: Promesa que representa la conexión a la base de datos.
   - `filename`: Ruta del archivo de la base de datos SQLite.
   - `driver`: Especifica el driver a utilizar (sqlite3.Database).

3. Función `getDb`:
   - Función asíncrona que devuelve una conexión a la base de datos.
   - Crea la tabla 'users' si no existe.
   - Campos de la tabla:
     - `id`: Identificador único autoincremental.
     - `name`: Nombre del usuario.
     - `email`: Correo electrónico del usuario (único).
     - `created_at`: Fecha y hora de creación del registro.

---

## src/models/User.js

```javascript
import { getDb } from '../config/database.js';

export class User {
  static async getAll() {
    const db = await getDb();
    return db.all("SELECT * FROM users");
  }

  static async create(user) {
    const db = await getDb();
    const result = await db.run("INSERT INTO users (name, email) VALUES (?, ?)", [user.name, user.email]);
    return result.lastID;
  }

  static async getById(id) {
    const db = await getDb();
    return db.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  static async update(id, user) {
    const db = await getDb();
    await db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [user.name, user.email, id]);
  }

  static async delete(id) {
    const db = await getDb();
    await db.run("DELETE FROM users WHERE id = ?", [id]);
  }
}
```

### Explicación detallada:

1. Importación:
   - `getDb`: Función para obtener una conexión a la base de datos.

2. Clase `User`:
   - Contiene métodos estáticos para realizar operaciones CRUD en la tabla 'users'.

3. Métodos:
   - `getAll()`: Obtiene todos los usuarios de la base de datos.
   - `create(user)`: Crea un nuevo usuario y devuelve su ID.
   - `getById(id)`: Obtiene un usuario específico por su ID.
   - `update(id, user)`: Actualiza la información de un usuario existente.
   - `delete(id)`: Elimina un usuario de la base de datos.

4. Uso de consultas parametrizadas:
   - Previene inyecciones SQL al usar '?' como marcadores de posición.

---

## src/controllers/userController.js

```javascript
import { User } from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const id = await User.create({ name, email });
    res.status(201).json({ id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await User.update(id, { name, email });
    res.json({ id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Explicación detallada:

1. Importación:
   - `User`: Clase que contiene los métodos para interactuar con la base de datos.

2. Funciones del controlador:
   - Cada función maneja una operación CRUD específica.
   - Todas las funciones son asíncronas para manejar operaciones de base de datos.

3. Manejo de errores:
   - Cada función utiliza un bloque try-catch para manejar errores.
   - En caso de error, se envía una respuesta con estado 500 y el mensaje de error.

4. Respuestas:
   - Se utilizan diferentes códigos de estado HTTP según la operación:
     - 200: Éxito general
     - 201: Creación exitosa
     - 404: Recurso no encontrado
     - 500: Error del servidor

5. Funciones específicas:
   - `getAllUsers`: Obtiene todos los usuarios.
   - `createUser`: Crea un nuevo usuario con los datos del cuerpo de la solicitud.
   - `getUser`: Obtiene un usuario específico por ID.
   - `updateUser`: Actualiza un usuario existente.
   - `deleteUser`: Elimina un usuario de la base de datos.

---

## src/routes/userRoutes.js

```javascript
import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
```

### Explicación detallada:

1. Importaciones:
   - `express`: Para crear el enrutador.
   - `userController`: Contiene las funciones del controlador para manejar las solicitudes.

2. Creación del enrutador:
   - `express.Router()`: Crea una nueva instancia de enrutador.

3. Definición de rutas:
   - Cada ruta se asocia con una función del controlador.
   - Rutas definidas:
     - GET '/': Obtener todos los usuarios
     - POST '/': Crear un nuevo usuario
     - GET '/:id': Obtener un usuario específico
     - PUT '/:id': Actualizar un usuario existente
     - DELETE '/:id': Eliminar un usuario

4. Parámetros de ruta:
   - ':id' es un parámetro de ruta que captura el ID del usuario en las operaciones específicas.

5. Exportación:
   - El enrutador se exporta para ser utilizado en app.js.

---

## src/views/dashboard.html

# Documentación del Dashboard de Usuario

## Índice
1. [Introducción](#introducción)
2. [Estructura HTML](#estructura-html)
3. [Estilos CSS](#estilos-css)
4. [Funcionalidad JavaScript](#funcionalidad-javascript)
   - [getAllUsers()](#getallusers)
   - [saveUser()](#saveuser)
   - [editUser(id)](#edituserid)
   - [deleteUser(id)](#deleteuserid)
   - [clearForm()](#clearform)
5. [Flujo de trabajo](#flujo-de-trabajo)
6. [Consideraciones de seguridad](#consideraciones-de-seguridad)
7. [Mejoras potenciales](#mejoras-potenciales)

## Introducción

Este documento describe un Dashboard de Usuario simple que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en una lista de usuarios. La interfaz está construida con HTML y JavaScript vanilla, y se comunica con una API backend para persistir los datos.

## Estructura HTML

El archivo HTML define la estructura básica de la página:

- Un contenedor principal con la clase "container".
- Un título "User Dashboard".
- Un formulario para ingresar/editar usuarios con campos para nombre y correo electrónico.
- Una tabla para mostrar la lista de usuarios.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>User Dashboard</h1>
        <div id="userForm">
            <!-- Campos del formulario -->
        </div>
        <table id="userTable">
            <!-- Estructura de la tabla -->
        </table>
    </div>
    <script>
        // Código JavaScript (se detalla más adelante)
    </script>
</body>
</html>
```

## Estilos CSS

El documento hace referencia a un archivo de estilos externo (`styles.css`). Este archivo no está incluido en el código proporcionado, pero se recomienda crear uno para mejorar la apariencia y la usabilidad de la interfaz.

## Funcionalidad JavaScript

El script JavaScript proporciona la funcionalidad principal del dashboard. A continuación, se detallan las funciones principales:

### getAllUsers()

Esta función recupera todos los usuarios del servidor y los muestra en la tabla.

```javascript
function getAllUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const tbody = document.querySelector('#userTable tbody');
            tbody.innerHTML = '';
            users.forEach(user => {
                // Genera filas de la tabla para cada usuario
            });
        });
}
```

### saveUser()

Esta función guarda un usuario nuevo o actualiza uno existente.

```javascript
function saveUser() {
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const method = userId ? 'PUT' : 'POST';
    const url = userId ? `/api/users/${userId}` : '/api/users';
    
    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
    })
    .then(() => {
        getAllUsers();
        clearForm();
    });
}
```

### editUser(id)

Esta función carga los datos de un usuario en el formulario para su edición.

```javascript
function editUser(id) {
    fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
        });
}
```

### deleteUser(id)

Esta función elimina un usuario después de solicitar confirmación.

```javascript
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${id}`, { method: 'DELETE' })
            .then(() => getAllUsers());
    }
}
```

### clearForm()

Esta función limpia los campos del formulario.

```javascript
function clearForm() {
    document.getElementById('userId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
}
```

## Flujo de trabajo

1. Al cargar la página, se ejecuta `getAllUsers()` para poblar la tabla.
2. El usuario puede agregar un nuevo usuario llenando el formulario y haciendo clic en "Save User".
3. Para editar un usuario, se hace clic en el botón "Edit", lo que carga los datos en el formulario. Luego se pueden modificar y guardar.
4. Para eliminar un usuario, se hace clic en el botón "Delete" y se confirma la acción.

## Consideraciones de seguridad

- El código actual no implementa autenticación ni autorización.
- Los datos se envían al servidor sin encriptación adicional más allá de HTTPS.
- Se debe implementar validación tanto en el frontend como en el backend para prevenir inyecciones y otros ataques.

## Mejoras potenciales

1. Implementar paginación para manejar grandes cantidades de usuarios.
2. Agregar funcionalidad de búsqueda y filtrado.
3. Implementar validación de formularios en el frontend.
4. Agregar indicadores de carga durante las operaciones asíncronas.
5. Mejorar el manejo de errores y mostrar mensajes de error/éxito al usuario.
6. Implementar un sistema de autenticación y autorización.
7. Utilizar un framework de JavaScript para una gestión más robusta del estado y las actualizaciones de la UI.
