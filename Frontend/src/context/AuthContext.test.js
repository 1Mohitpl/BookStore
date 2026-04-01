import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

const TestComponent = () => {
  const { user, loading, error } = useAuth();
  return (
    <div>
      <div data-testid="user-display">{user ? user.username : 'No user'}</div>
      <div data-testid="loading-display">{loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="error-display">{error || 'No error'}</div>
    </div>
  );
};

describe('AuthContext - InitialState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-display')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading-display')).toHaveTextContent('Not loading');
  });

  it('should have no error initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('error-display')).toHaveTextContent('No error');
  });

  it('should not be loading initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading-display')).toHaveTextContent('Not loading');
  });

  it('should restore user from localStorage on mount', () => {
    const mockUser = {
      id: '1',
      username: 'persisteduser',
      role: 'user'
    };
    // Set up localStorage manually for this specific test
    localStorage.setItem('token', 'persisted-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for effect to run and user to be set
    waitFor(() => {
      expect(screen.getByTestId('user-display')).toHaveTextContent('persisteduser');
    });
  });
});
