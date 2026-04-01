import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const TestComponent = () => {
  const { cartItems, discount, loading, error } = useCart();

  return (
    <div>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <div data-testid="loading-display">{loading ? 'Loading' : 'Ready'}</div>
      <div data-testid="error-display">{error || 'No error'}</div>
      <div data-testid="discount-display">{discount}</div>
    </div>
  );
};

describe('CartContext - InitialState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    });

    expect(screen.getByTestId('discount-display')).toHaveTextContent('0');
  });

  it('should load cart items on mount', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-display')).toHaveTextContent('Ready');
    });
  });

  it('should have no error initially', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-display')).toHaveTextContent('No error');
    });
  });

  it('should have zero discount initially', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('discount-display')).toHaveTextContent('0');
  });

  it('should have correct initial cart items count', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    });
  });
});
