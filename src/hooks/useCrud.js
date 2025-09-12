import { useState, useCallback } from 'react';
import adminApi from '../services/adminApi';

const useCrud = (resource) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0
  });
  const [filters, setFilters] = useState({
    orderBy: 'createdAt',
    orderDirection: 'DESC',
    limit: 10,
    offset: 0
  });

  const fetchData = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const finalFilters = { ...filters, ...newFilters };
      const response = await adminApi.getAll(resource, finalFilters);
      
      setData(response.data || []);
      setPagination(response.pagination || { total: 0, limit: 10, offset: 0 });
      setFilters(response.filters || finalFilters);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${resource}:`, err);
    } finally {
      setLoading(false);
    }
  }, [resource, filters]);

  const createItem = useCallback(async (itemData) => {
    setLoading(true);
    try {
      const response = await adminApi.create(resource, itemData);
      await fetchData();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resource, fetchData]);

  const updateItem = useCallback(async (id, itemData) => {
    setLoading(true);
    try {
      const response = await adminApi.update(resource, id, itemData);
      await fetchData();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resource, fetchData]);

  const deleteItem = useCallback(async (id, permanent = false) => {
    setLoading(true);
    try {
      let response;
      if (permanent) {
        response = await adminApi.deletePermanent(resource, id);
      } else {
        response = await adminApi.delete(resource, id);
      }
      await fetchData();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resource, fetchData]);

  const getById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await adminApi.getById(resource, id);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resource]);

  const handleFilterChange = useCallback((newFilters) => {
    const updatedFilters = { 
      ...filters, 
      ...newFilters,
      offset: newFilters.offset !== undefined ? newFilters.offset : 0 
    };
    setFilters(updatedFilters);
    fetchData(updatedFilters);
  }, [filters, fetchData]);

  const handlePageChange = useCallback((newOffset) => {
    const updatedFilters = { ...filters, offset: newOffset };
    setFilters(updatedFilters);
    fetchData(updatedFilters);
  }, [filters, fetchData]);

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      orderBy: 'createdAt',
      orderDirection: 'DESC',
      limit: 10,
      offset: 0
    };
    setFilters(defaultFilters);
    fetchData(defaultFilters);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    getById,
    handleFilterChange,
    handlePageChange,
    resetFilters,
    setError
  };
};

export default useCrud;


