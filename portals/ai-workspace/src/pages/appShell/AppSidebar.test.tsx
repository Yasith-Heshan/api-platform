/*
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { renderWithProviders, screen } from '../../test/utils';
import AppSidebar from './AppSidebar';

let currentProject: { id: string; displayName: string } | null = null;

vi.mock('../../contexts/AppShellContext', () => ({
  useAppShell: () => ({
    currentProject,
    currentOrganization: { id: 'org-1', uuid: 'org-1', handle: 'acme', name: 'Acme' },
  }),
}));
vi.mock('../../contexts/AppAuthContext', () => ({
  useAppAuth: () => ({ hasPermission: () => true, isAuthenticated: true }),
}));

const renderSidebar = () =>
  renderWithProviders(
    <AppSidebar
      shellState={{ sidebarCollapsed: false, activeMenuItem: 'overview', expandedMenus: {} }}
      shellActions={{ setActiveMenuItem: vi.fn(), toggleMenu: vi.fn() }}
      projectCount={1}
    />
  );

beforeEach(() => {
  currentProject = null;
});

describe('the Settings entry', () => {
  it('links to the organization Settings at the organization level', () => {
    renderSidebar();

    expect(screen.getByText('Settings').closest('a')).toHaveAttribute(
      'href',
      '/organizations/acme/settings'
    );
  });

  it('is hidden inside a project', () => {
    currentProject = { id: 'proj-1', displayName: 'Project One' };

    renderSidebar();

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    // The rest of the sidebar still renders, scoped to the project.
    expect(screen.getByText('LLM Providers').closest('a')).toHaveAttribute(
      'href',
      '/organizations/acme/projects/proj-1/service-provider'
    );
  });
});
