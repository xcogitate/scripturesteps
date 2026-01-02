// Admin authentication and session management

interface AdminUser {
  email: string
  role: "super_admin" | "content_admin" | "support_admin"
  name: string
  lastLogin?: Date
}

const ADMIN_CREDENTIALS = {
  "admin@bibleverse.app": {
    password: "Admin@2024!", // In production, use proper password hashing
    role: "super_admin" as const,
    name: "System Administrator",
  },
}

export class AdminAuth {
  private static STORAGE_KEY = "admin_session"

  static login(email: string, password: string): AdminUser | null {
    const admin = ADMIN_CREDENTIALS[email as keyof typeof ADMIN_CREDENTIALS]

    if (!admin || admin.password !== password) {
      return null
    }

    const user: AdminUser = {
      email,
      role: admin.role,
      name: admin.name,
      lastLogin: new Date(),
    }

    // Store session
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    }

    return user
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static getCurrentAdmin(): AdminUser | null {
    if (typeof window === "undefined") {
      return null
    }

    const stored = sessionStorage.getItem(this.STORAGE_KEY)
    if (!stored) {
      return null
    }

    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentAdmin() !== null
  }

  static hasPermission(
    permission: "user_management" | "content_management" | "analytics" | "system_settings",
  ): boolean {
    const admin = this.getCurrentAdmin()
    if (!admin) return false

    // Super admin has all permissions
    if (admin.role === "super_admin") return true

    // Content admin can manage content
    if (admin.role === "content_admin" && permission === "content_management") return true

    // Support admin can view analytics and manage users
    if (admin.role === "support_admin" && (permission === "analytics" || permission === "user_management")) return true

    return false
  }
}

export const adminAuth = AdminAuth
