
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Ensure Jest globals are available
declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
}

// Simple smoke test to verify test infrastructure
describe('Test Infrastructure', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Test Infrastructure Working</div>;
    
    render(<TestComponent />);
    
    expect(screen.getByText('Test Infrastructure Working')).toBeInTheDocument();
  });

  it('should perform basic assertions', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
  });
});
