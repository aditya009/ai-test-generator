import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// LLM Service
export const llmService = {
  generateTestCases: async (data) => {
    const response = await api.post('/api/llm/generate', data);
    return response.data;
  },
  
  validateKey: async (provider, apiKey) => {
    const response = await api.post('/api/llm/validate-key', { provider, apiKey });
    return response.data;
  },
};

// JIRA Service
export const jiraService = {
  fetchStories: async (data) => {
    const response = await api.post('/api/jira/fetch', data);
    return response.data;
  },
  
  validate: async (data) => {
    const response = await api.post('/api/jira/validate', data);
    return response.data;
  },
};

// Coverage Service
export const coverageService = {
  analyze: async (data) => {
    const response = await api.post('/api/coverage/analyze', data);
    return response.data;
  },
  
  suggest: async (data) => {
    const response = await api.post('/api/coverage/suggest', data);
    return response.data;
  },
};

// Export Service
export const exportService = {
  exportCSV: async (data) => {
    const response = await api.post('/api/export/csv', data, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.storyId || 'test-cases'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },
  
  exportExcel: async (data) => {
    const response = await api.post('/api/export/excel', data, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.storyId || 'test-cases'}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },
};

// Integration Service
export const integrationService = {
  pushToTestRail: async (data) => {
    const response = await api.post('/api/integration/testrail/push', data);
    return response.data;
  },
  
  pushToZephyr: async (data) => {
    const response = await api.post('/api/integration/zephyr/push', data);
    return response.data;
  },
};

export default api;
