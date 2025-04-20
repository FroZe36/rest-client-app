import { describe, expect, it } from 'vitest';

import {
  SignInSchema,
  SignUpSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@/utils/validators';

describe('Validators', () => {
  describe('emailSchema', () => {
    it('should pass with a valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should fail with an invalid email', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email');
      }
    });

    it('should fail with an empty email', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });
  });

  describe('nameSchema', () => {
    it('should pass with a valid name', () => {
      const result = nameSchema.safeParse('John');
      expect(result.success).toBe(true);
    });

    it('should fail with an empty name', () => {
      const result = nameSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required');
      }
    });

    it('should fail with a name without letters', () => {
      const result = nameSchema.safeParse('123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Name must start with an uppercase letter'
        );
      }
    });
  });

  describe('passwordSchema', () => {
    it('should pass with a valid password', () => {
      const result = passwordSchema.safeParse('Qwe!23qwe');
      expect(result.success).toBe(true);
    });

    it('should fail with a password that is too short', () => {
      const result = passwordSchema.safeParse('Qwe!23');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must contain at least 8 characters'
        );
      }
    });

    it('should fail with a password without letters', () => {
      const result = passwordSchema.safeParse('123!4567');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must contain at least one letter'
        );
      }
    });

    it('should fail with a password without digits', () => {
      const result = passwordSchema.safeParse('Qwe!qweq');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must contain at least one digit'
        );
      }
    });

    it('should fail with a password without special characters', () => {
      const result = passwordSchema.safeParse('Qwe123qwe');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must contain at least one special character'
        );
      }
    });
  });

  describe('SignUpSchema', () => {
    it('should pass with valid signup data', () => {
      const result = SignUpSchema.safeParse({
        email: 'test@example.com',
        name: 'John',
        password: 'Qwe!23qwe',
        confirmPassword: 'Qwe!23qwe',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with mismatched passwords', () => {
      const result = SignUpSchema.safeParse({
        email: 'test@example.com',
        name: 'John',
        password: 'Qwe!23qwe',
        confirmPassword: 'Qwe!23qwe1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
      }
    });
  });

  describe('SignInSchema', () => {
    it('should pass with valid signin data', () => {
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: 'Qwe!23qwe',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with an empty password', () => {
      const result = SignInSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });
  });
});
