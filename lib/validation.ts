/**
 * Validation utilities for user input
 */

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (password.length < 8) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins 8 caractères' };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins une minuscule' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins une majuscule' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins un chiffre' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?":{}|<>)' };
    }
    return { isValid: true, error: '' };
};
