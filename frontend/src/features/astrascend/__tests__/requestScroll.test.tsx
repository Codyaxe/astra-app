import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
  UNSAFE_NavigationContext,
  type Navigator,
} from 'react-router-dom';
import { AstrascendLayout } from '../components/AstrascendLayout';
import { RequestPage } from '../pages/RequestPage';

function open(path = '/astrascend/request?service=makeform') {
  let navigator!: Navigator;
  function ObserveNavigation() {
    navigator = useContext(UNSAFE_NavigationContext).navigator;
    return null;
  }
  render(
    <MemoryRouter initialEntries={[path]}>
      <ObserveNavigation />
      <Routes>
        <Route path="/astrascend" element={<AstrascendLayout />}>
          <Route index element={<section id="services">Services</section>} />
          <Route path="request" element={<RequestPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  return navigator;
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('scrollY', 0);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('request scroll behavior', () => {
  it('asks the router to preserve scroll when selecting each service', () => {
    const replace = vi.spyOn(open(), 'replace');
    for (const service of ['upshift', 'linkup', 'reign', 'makeform']) {
      fireEvent.click(
        screen.getByRole('radio', { name: new RegExp(service, 'i') })
      );
      expect(replace).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: `?service=${service}` }),
        undefined,
        { replace: true, preventScrollReset: true }
      );
    }
  });
});
