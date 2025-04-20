import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import RestPage from '@/app/[locale]/dashboard/rest/[[...slug]]/page';

describe('RestPage', () => {
  it('should handle async params', async () => {
    const mockParams = Promise.resolve({
      slug: ['api', 'v1'],
    });
    render(await RestPage({ params: mockParams }));
  });
});
