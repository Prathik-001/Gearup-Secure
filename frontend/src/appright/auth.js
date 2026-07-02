export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth';

  // Get authorization header helper
  getHeaders(withAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (withAuth) {
      const token = localStorage.getItem('gearup_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async createAccount({ email, password, name, phone }) {
    try {
      const res = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }

      if (data.token) {
        localStorage.setItem('gearup_token', data.token);
      }
      
      // Inject userId for frontend compatibility with signup step 2 flow
      return {
        ...data.user,
        userId: data.user.$id
      };
    } catch (error) {
      console.error("AuthService :: createAccount :: error", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const res = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login.');
      }

      if (data.token) {
        localStorage.setItem('gearup_token', data.token);
      }

      return {
        ...data.user,
        userId: data.user.$id
      };
    } catch (error) {
      console.error("AuthService :: login :: error", error);
      throw error;
    }
  }

  async loginWithGoogle(credential) {
    try {
      const res = await fetch(`${this.baseUrl}/google-login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google login failed.');
      }

      if (data.token) {
        localStorage.setItem('gearup_token', data.token);
      }

      return {
        ...data.user,
        userId: data.user.$id
      };
    } catch (error) {
      console.error("AuthService :: loginWithGoogle :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('gearup_token');
      if (!token) return null;

      const res = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      if (!res.ok) {
        // Clear invalid token
        localStorage.removeItem('gearup_token');
        return null;
      }

      const user = await res.json();
      return {
        ...user,
        userId: user.$id
      };
    } catch (error) {
      console.error("AuthService :: getCurrentUser :: error", error);
      return null;
    }
  }

  async logout() {
    try {
      localStorage.removeItem('gearup_token');
      return true;
    } catch (error) {
      console.error("AuthService :: logout :: error", error);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;