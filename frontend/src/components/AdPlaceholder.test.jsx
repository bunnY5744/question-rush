import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdPlaceholder from './AdPlaceholder';
describe('AdPlaceholder', () => {
  it('shows a labelled placeholder and no fake publisher id', () => {
    render(<AdPlaceholder slot="home" />);
    expect(screen.getByText(/Ad space reserved/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/ca-pub-\d+/);
  });
});
