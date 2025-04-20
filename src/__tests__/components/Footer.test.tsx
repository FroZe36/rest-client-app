import { render, screen } from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { describe, expect, it } from 'vitest';

import Footer from '@/components/Footer';

describe('Footer Component', () => {
  it('should render without errors', () => {
    render(
      <MemoryRouterProvider>
        <Footer />
      </MemoryRouterProvider>
    );
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should render copyright text', () => {
    render(
      <MemoryRouterProvider>
        <Footer />
      </MemoryRouterProvider>
    );
    expect(screen.getByText('2025 The Rolling Scopes')).toBeInTheDocument();
  });

  it('should render GitHub link', () => {
    render(
      <MemoryRouterProvider>
        <Footer />
      </MemoryRouterProvider>
    );
    const githubLink = screen.getByRole('link', { name: /githublink/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/M-M-Band/rest-client-app'
    );
  });

  it('should render RS School link', () => {
    render(
      <MemoryRouterProvider>
        <Footer />
      </MemoryRouterProvider>
    );
    const rsLink = screen.getByRole('link', { name: /RSSchoolLogo/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
  });

  it('should render GitHub image with correct attributes', () => {
    render(
      <MemoryRouterProvider>
        <Footer />
      </MemoryRouterProvider>
    );
    const githubImage = screen.getByRole('img', { name: /githublink/i });
    expect(githubImage).toBeInTheDocument();
    expect(githubImage).toHaveAttribute(
      'src',
      expect.stringContaining('/_next/image')
    );
    expect(githubImage).toHaveAttribute('alt', 'githubLink');
    expect(githubImage).toHaveAttribute('width', '50');
    expect(githubImage).toHaveAttribute('height', '50');
  });

  it('should render RS School image with correct attributes', () => {
    render(
      <MemoryRouterProvider>
        <Footer />
      </MemoryRouterProvider>
    );
    const rsImage = screen.getByRole('img', { name: /RSSchoolLogo/i });
    expect(rsImage).toBeInTheDocument();
    expect(rsImage).toHaveAttribute(
      'src',
      expect.stringContaining('/_next/image')
    );
    expect(rsImage).toHaveAttribute('alt', 'RSSchoolLogo');
    expect(rsImage).toHaveAttribute('width', '50');
    expect(rsImage).toHaveAttribute('height', '50');
  });
});
