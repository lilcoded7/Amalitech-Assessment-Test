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