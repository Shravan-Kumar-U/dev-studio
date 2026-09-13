import { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import api from '../services/api';

export const useRealtimeProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useContext(SocketContext);
  const wasDisconnected = useRef(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial REST API Fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Re-sync with REST API upon Socket Reconnection
  useEffect(() => {
    if (!isConnected) {
      wasDisconnected.current = true;
    } else if (isConnected && wasDisconnected.current) {
      fetchProducts();
      wasDisconnected.current = false;
    }
  }, [isConnected]);

  // 3. Listen for Real-Time Socket Events
  useEffect(() => {
    if (!socket) return;

    const onProductCreated = (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
    };

    const onProductUpdated = (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    };

    const onProductDeleted = (deletedProductId) => {
      setProducts((prev) => prev.filter((p) => p._id !== deletedProductId));
    };

    socket.on('product-created', onProductCreated);
    socket.on('product-updated', onProductUpdated);
    socket.on('product-deleted', onProductDeleted);

    return () => {
      socket.off('product-created', onProductCreated);
      socket.off('product-updated', onProductUpdated);
      socket.off('product-deleted', onProductDeleted);
    };
  }, [socket]);

  return { products, loading };
};