/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../lib/axios';

// Authentication
export const loginUser = (credentials: any) => {
  return api.post('/v1/accounts/login/', credentials);
};

// Vault Nodes
export const getNodes = (parentId?: string) => {
  // If parentId exists, append it as a query param
  const url = parentId ? `/v2/vault/nodes/?parent=${parentId}` : '/v2/vault/nodes/';
  return api.get(url);
};

export const createNode = (nodeData: any) => {
  return api.post('/v2/vault/nodes/', nodeData);
};

export const getNode = (id: string | number) => {
  return api.get(`/v2/vault/nodes/${id}/`);
};

export const updateNode = (id: string | number, data: any) => {
  return api.patch(`/v2/vault/nodes/${id}/`, data);
};

export const deleteNode = (id: string | number) => {
  return api.delete(`/v2/vault/nodes/${id}/`);
};