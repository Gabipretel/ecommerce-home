import axios from 'axios';

class AdminApiService {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || 'Error en la petición';
        console.error('API Error:', message);
        throw new Error(message);
      }
    );
  }

  // Método para construir query parameters
  buildQueryParams(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    return params.toString();
  }

  // CRUD genérico
  async getAll(resource, filters = {}) {
    const queryString = this.buildQueryParams(filters);
    const response = await this.api.get(`/${resource}${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  async getById(resource, id) {
    const response = await this.api.get(`/${resource}/${id}`);
    return response.data;
  }

  async create(resource, data) {
    const response = await this.api.post(`/${resource}`, data);
    return response.data;
  }

  async update(resource, id, data) {
    const response = await this.api.put(`/${resource}/${id}`, data);
    return response.data;
  }

  async delete(resource, id) {
    const response = await this.api.delete(`/${resource}/${id}`);
    return response.data;
  }

  async deletePermanent(resource, id) {
    let endpoint;
    if (resource === 'usuarios') {
      endpoint = `/${resource}/permanent/${id}`;
    } else {
      endpoint = `/${resource}/${id}/permanent`;
    }
    const response = await this.api.delete(endpoint);
    return response.data;
  }

  // Métodos específicos para usuarios
  async getUsuarios(filters = {}) {
    return this.getAll('usuarios', filters);
  }

  async createUsuario(userData) {
    return this.create('usuarios', userData);
  }

  async updateUsuario(id, userData) {
    return this.update('usuarios', id, userData);
  }

  async deleteUsuario(id, permanent = false) {
    return permanent ? this.deletePermanent('usuarios', id) : this.delete('usuarios', id);
  }

  // Métodos específicos para productos
  async getProductos(filters = {}) {
    return this.getAll('productos', filters);
  }

  async createProducto(productData) {
    return this.create('productos', productData);
  }

  async updateProducto(id, productData) {
    return this.update('productos', id, productData);
  }

  async deleteProducto(id, permanent = false) {
    return permanent ? this.deletePermanent('productos', id) : this.delete('productos', id);
  }

  // Métodos específicos para categorías
  async getCategorias(filters = {}) {
    return this.getAll('categorias', filters);
  }

  async createCategoria(categoryData) {
    return this.create('categorias', categoryData);
  }

  async updateCategoria(id, categoryData) {
    return this.update('categorias', id, categoryData);
  }

  async deleteCategoria(id) {
    return this.delete('categorias', id);
  }

  // Métodos para obtener datos para formularios
  async getMarcas() {
    try {
      const response = await this.api.get('/marcas');
      return response.data;
    } catch (error) {
      console.warn('Endpoint de marcas no disponible');
      return { data: [] };
    }
  }

  async getAdministradores() {
    try {
      const response = await this.api.get('/administradores');
      return response.data;
    } catch (error) {
      console.warn('Endpoint de administradores no disponible');
      return { data: [] };
    }
  }
}

// Instancia del servicio
const adminApi = new AdminApiService();

export default adminApi;


