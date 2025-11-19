import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // En producción debería estar hasheado
  createdAt: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Ruta al archivo JSON de usuarios en la raíz del proyecto
const USERS_FILE = path.join(process.cwd(), 'users.json');

// Asegurar que el archivo exista
function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
}

// Inicializar archivo al cargar el módulo
ensureUsersFile();

// Hash de contraseña simple (en producción usar bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verificar contraseña
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Obtener todos los usuarios
function getAllUsers(): User[] {
  ensureUsersFile();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Guardar usuarios
function saveUsers(users: User[]): void {
  ensureUsersFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Servicio de autenticación
export const authService = {
  // Registrar nuevo usuario
  register(email: string, password: string, name: string): { success: boolean; error?: string; user?: UserWithoutPassword } {
    const users = getAllUsers();
    
    // Verificar si el email ya existe
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  },

  // Iniciar sesión
  login(email: string, password: string): { success: boolean; user?: UserWithoutPassword; error?: string } {
    const users = getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    if (!verifyPassword(password, user.password)) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  },

  // Obtener usuario por ID
  getUserById(id: string): UserWithoutPassword | null {
    const users = getAllUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Obtener usuario por email
  getUserByEmail(email: string): UserWithoutPassword | null {
    const users = getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

