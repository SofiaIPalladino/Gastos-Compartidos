export interface User {
  id: string
  email: string
  name: string
  password: string // En producción, esto debería estar hasheado
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Gestión de usuarios
export const authService = {
  // Registrar nuevo usuario
  register(email: string, password: string, name: string): { success: boolean; error?: string } {
    if (typeof window === 'undefined') return { success: false, error: 'No disponible' }
    
    const users = this.getUsers()
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'El email ya está registrado' }
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      password // En producción usar bcrypt o similar
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    return { success: true }
  },

  // Iniciar sesión
  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    if (typeof window === 'undefined') return { success: false, error: 'No disponible' }
    
    const users = this.getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return { success: false, error: 'Email o contraseña incorrectos' }
    }

    // Guardar sesión
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
    
    return { success: true, user }
  },

  // Cerrar sesión
  logout() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('currentUser')
  },

  // Obtener usuario actual
  getCurrentUser(): Omit<User, 'password'> | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('currentUser')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  },

  // Obtener todos los usuarios (privado)
  getUsers(): User[] {
    if (typeof window === 'undefined') return []
    
    const usersStr = localStorage.getItem('users')
    if (!usersStr) return []
    
    try {
      return JSON.parse(usersStr)
    } catch {
      return []
    }
  }
}
