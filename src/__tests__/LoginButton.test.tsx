import React from 'react';
import 'whatwg-fetch';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginButton from '../components/LoginButton';
import { auth } from '../components/FirebaseConfig';
import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

jest.mock('firebase/auth');

const renderLoginButton = (user: User | null) =>
  render(<LoginButton user={user} setUser={jest.fn()} />);

const openLoginForm = () => {
  const toggleButtons = screen.getAllByRole('button', { name: /^login$/i });
  fireEvent.click(toggleButtons[0]);
  const emailInput = screen.getByPlaceholderText(/enter email/i);
  const passwordInput = screen.getByPlaceholderText(/enter password/i);
  const submitButton = screen.getByText(/^Login$/i, { selector: 'button[type="submit"]' });
  return { emailInput, passwordInput, submitButton };
};

describe('LoginButton', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('shows logout button when user exists and calls signOut on click', async () => {
    const mockUser = { uid: 'user-123' } as User;
    const signOutMock = signOut as jest.MockedFunction<typeof signOut>;
    signOutMock.mockResolvedValue(undefined);

    renderLoginButton(mockUser);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => expect(signOutMock).toHaveBeenCalledWith(auth));
    expect(alertSpy).toHaveBeenCalledWith('Logout successful!');
  });

  it('renders login dropdown when no user and toggles visibility', () => {
    renderLoginButton(null);
    const { emailInput, passwordInput } = openLoginForm();

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  describe('form validation and login', () => {
    it('blocks submission for invalid email/password and shows error alert', async () => {
      const signInMock = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;

      renderLoginButton(null);
      const { emailInput, passwordInput, submitButton } = openLoginForm();

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/Please ensure you have a valid email/i)).toBeInTheDocument();
      expect(signInMock).not.toHaveBeenCalled();
    });

    it('calls signInWithEmailAndPassword for valid inputs and clears form', async () => {
      const signInMock = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
      signInMock.mockResolvedValue({} as never);

      renderLoginButton(null);
      const { emailInput, passwordInput, submitButton } = openLoginForm();

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => expect(signInMock).toHaveBeenCalledWith(auth, 'test@example.com', 'password123'));
      expect(alertSpy).toHaveBeenCalledWith('Login successful!');

      const { emailInput: resetEmail, passwordInput: resetPassword } = openLoginForm();
      expect(resetEmail).toHaveValue('');
      expect(resetPassword).toHaveValue('');
    });

    it('displays error when sign-in rejects', async () => {
      const signInMock = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
      signInMock.mockRejectedValue(new Error('Invalid credentials'));

      renderLoginButton(null);
      const { emailInput, passwordInput, submitButton } = openLoginForm();

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/Error Logging In:/i)).toBeInTheDocument();
      expect(signInMock).toHaveBeenCalledWith(auth, 'user@example.com', 'password123');
    });
  });

  describe('alerts and keyboard shortcuts', () => {
    it('submits when Enter pressed in password field', async () => {
      const signInMock = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
      signInMock.mockResolvedValue({} as never);

      renderLoginButton(null);
      const { emailInput, passwordInput } = openLoginForm();

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.keyPress(passwordInput, { key: 'Enter', charCode: 13 });

      await waitFor(() => expect(signInMock).toHaveBeenCalledWith(auth, 'user@example.com', 'password123'));
    });
  });
});