# Frontend Test Suite Documentation

## 📋 Overview

This document describes the comprehensive unit test suite for the BookStore Frontend application. The suite focuses on critical user flows:
- Authentication (Login/Signup)
- Cart management
- Checkout process

## 🏗️ Test Files Structure

```
src/
├── context/
│   ├── AuthContext.test.js         # Auth context initialization & state
│   └── CartContext.test.js         # Cart context initialization & state
└── pages/
    ├── Login.test.js                # Login form validation & submission
    ├── Cart.test.js                 # Cart page rendering & interactions
    └── Checkout.test.js             # Checkout form validation
```

## ✅ Test Coverage by Feature

### 1. **AuthContext.test.js**
Tests the authentication context functionality.

**Tests:**
- ✅ Initialize with no user
- ✅ No error initially
- ✅ Not loading initially
- ✅ Restore user from localStorage on mount

**Running:**
```bash
npm test -- AuthContext.test.js
```

### 2. **CartContext.test.js**
Tests the cart context initialization and state management.

**Tests:**
- ✅ Initialize with empty cart
- ✅ Zero discount initially
- ✅ Not loading initially
- ✅ No error initially

**Running:**
```bash
npm test -- CartContext.test.js
```

### 3. **Login.test.js**
Tests the Login page form behavior and validation.

**Tests:**
- ✅ Render login form
- ✅ Display signup link
- ✅ Form validation for empty fields
- ✅ Update form state as user types
- ✅ Have login button

**Running:**
```bash
npm test -- Login.test.js
```

### 4. **Cart.test.js**
Tests the Cart page rendering and interactions.

**Tests:**
- ✅ Render cart page
- ✅ Display cart items
- ✅ Display checkout button

**Running:**
```bash
npm test -- Cart.test.js
```

### 5. **Checkout.test.js**
Tests the Checkout page form and validation.

**Tests:**
- ✅ Render checkout page
- ✅ Display order summary
- ✅ Have back to cart link
- ✅ Have place order button

**Running:**
```bash
npm test -- Checkout.test.js
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm test -- AuthContext.test.js
```

### Run tests with coverage report
```bash
npm test -- --coverage
```

### Run tests in watch mode (development)
```bash
npm test -- --watch
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should initialize with no user"
```

## 📜 Test Examples

### Example 1: Testing Context Initialization
```javascript
describe('AuthContext - InitialState', () => {
  it('should initialize with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-display')).toHaveTextContent('No user');
  });
});
```

### Example 2: Testing Form Validation
```javascript
describe('Login Page', () => {
  it('should show validation error when fields are empty', async () => {
    renderLogin();

    const loginBtn = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Please fill in all fields/i)
      ).toBeInTheDocument();
    });
  });
});
```

### Example 3: Testing User Input
```javascript
it('should update form state as user types', async () => {
  const user = userEvent.setup();
  renderLogin();

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  await user.type(usernameInput, 'testuser');
  await user.type(passwordInput, 'password123');

  expect(usernameInput.value).toBe('testuser');
  expect(passwordInput.value).toBe('password123');
});
```

## 🛠️ Test Utilities & Helpers

### Testing Library Imports
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

### Common Testing Patterns

**1. Rendering a component**
```javascript
render(
  <BrowserRouter>
    <ComponentName />
  </BrowserRouter>
);
```

**2. Finding elements**
```javascript
// By role
screen.getByRole('button', { name: /login/i })

// By placeholder
screen.getByPlaceholderText(/username/i)

// By test ID
screen.getByTestId('user-display')

// By text
screen.getByText(/Login to/i)
```

**3. Simulating user interactions**
```javascript
// Click
fireEvent.click(button)

// Type
await userEvent.type(input, 'text')

// Change
fireEvent.change(input, { target: { value: 'new value' } })
```

**4. Async operations**
```javascript
await waitFor(() => {
  expect(element).toHaveTextContent('text')
})
```

## 📊 Coverage Goals

Current test suite covers:
- ✅ Context initialization state
- ✅ Form rendering and structure
- ✅ User input handling
- ✅ Form validation logic
- ✅ Component rendering

Future enhancements (optional):
- API integration tests with mocked services
- Full user flow integration tests
- E2E tests with Cypress/Playwright

## 🔧 Configuration Files

### setupTests.js
Initializes Jest and React Testing Library:
- Mocks localStorage
- Mocks axios
- Configures window.matchMedia
- Handles console warnings

### jest.config.js (if needed)
Can be created for advanced Jest configuration

## 🐛 Debugging Failed Tests

### Check what's rendered
```javascript
screen.debug() // Prints the DOM
```

### Get more error details
```javascript
screen.logTestingPlaygroundURL() // Provides Testing Playground link
```

### Common Issues

1. **"Cannot destructure property 'x' of undefined"**
   - Make sure hooks are inside a provider
   - Ensure mocks are set up before rendering

2. **"Unable to find an element with..."**
   - Use `screen.debug()` to see what's rendered
   - Check selector is correct
   - Ensure element is visible/rendered

3. **"act() warning"**
   - Wrap state changes in `act()` when testing asynchronous behavior
   - `waitFor()` already handles this for queries

## 📚 Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 💡 Tips for Writing Good Tests

1. **Test behavior, not implementation**
   - ❌ Test internal state
   - ✅ Test what user sees

2. **Use semantic queries**
   - ✅ `getByRole`, `getByLabelText`
   - ❌ `getByDataTestId` (use sparingly)

3. **Keep tests isolated**
   - Clear mocks before each test
   - Don't rely on test execution order

4. **Make assertions specific**
   - ✅ `expect(elem).toHaveTextContent('exact text')`
   - ❌ `expect(elem).toBeTruthy()`

5. **Use meaningful descriptions**
   - ✅ "should show validation error when username is empty"
   - ❌ "should work"

## 🎯 Next Steps

To add more tests to your suite:

1. Create new `*.test.js` file in the same directory as the component
2. Import testing utilities
3. Mock dependencies as needed
4. Write descriptive test cases
5. Run tests and verify they pass

Example command to run only Login tests:
```bash
npm test -- Login.test.js
```

Happy testing! 🎉
