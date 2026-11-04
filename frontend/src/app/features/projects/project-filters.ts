import { Project, ProjectCategory } from '@core/models/project.model';

export type TechFilter = 'angular' | 'laravel' | 'next' | 'dotnet' | 'wordpress' | 'cicd';

export type ProjectFilter = 'all' | `type:${ProjectCategory}` | `tech:${TechFilter}` | `client:${string}`;

export interface FilterOption {
  key: ProjectFilter;
  labelKey: string;
}

export interface FilterChip {
  key: ProjectFilter;
  /** Translation key, or null when `name` is a proper noun shown as is. */
  labelKey: string | null;
  name: string | null;
  count: number;
}

export interface FilterGroup {
  id: string;
  labelKey: string;
  chips: FilterChip[];
}

export const TYPE_FILTERS: FilterOption[] = [
  { key: 'type:erp', labelKey: 'projects.filterErp' },
  { key: 'type:ecommerce', labelKey: 'projects.filterEcommerce' },
  { key: 'type:website', labelKey: 'projects.filterWebsite' },
  { key: 'type:infrastructure', labelKey: 'projects.filterInfrastructure' },
];

export const TECH_FILTERS: FilterOption[] = [
  { key: 'tech:angular', labelKey: 'projects.filterAngular' },
  { key: 'tech:laravel', labelKey: 'projects.filterLaravel' },
  { key: 'tech:next', labelKey: 'projects.filterNext' },
  { key: 'tech:dotnet', labelKey: 'projects.filterDotNet' },
  { key: 'tech:wordpress', labelKey: 'projects.filterWordpress' },
  { key: 'tech:cicd', labelKey: 'projects.filterCicd' },
];

const TECH_STACK_NAMES: Record<Exclude<TechFilter, 'cicd'>, string> = {
  angular: 'Angular',
  laravel: 'Laravel',
  next: 'Next.js',
  dotnet: '.NET',
  wordpress: 'WordPress',
};

export function matchesFilter(project: Project, filter: ProjectFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  const separator = filter.indexOf(':');
  const group = filter.slice(0, separator);
  const value = filter.slice(separator + 1);
  const stack = project.stack ?? [];

  switch (group) {
    case 'type':
      return project.categories.includes(value as ProjectCategory);
    case 'tech':
      return value === 'cicd'
        ? !!project.has_cicd || stack.includes('CI/CD')
        : stack.includes(TECH_STACK_NAMES[value as Exclude<TechFilter, 'cicd'>]);
    case 'client':
      return project.company === value;
    default:
      return false;
  }
}

export function countMatches(projects: Project[], filter: ProjectFilter): number {
  return projects.filter((project) => matchesFilter(project, filter)).length;
}

export function buildFilterGroups(projects: Project[]): FilterGroup[] {
  const chip = ({ key, labelKey }: FilterOption): FilterChip => ({
    key,
    labelKey,
    name: null,
    count: countMatches(projects, key),
  });

  return [
    {
      id: 'type',
      labelKey: 'projects.filterGroupType',
      chips: [chip({ key: 'all', labelKey: 'projects.filterAll' }), ...TYPE_FILTERS.map(chip)],
    },
    { id: 'tech', labelKey: 'projects.filterGroupTech', chips: TECH_FILTERS.map(chip) },
    {
      id: 'client',
      labelKey: 'projects.filterGroupClient',
      chips: clientNames(projects).map((name) => {
        const key: ProjectFilter = `client:${name}`;
        return { key, labelKey: null, name, count: countMatches(projects, key) };
      }),
    },
  ];
}

/** Clients with at least two projects, most projects first. A single-project client doesn't need a filter. */
export function clientNames(projects: Project[]): string[] {
  const counts = new Map<string, number>();
  for (const { company } of projects) {
    if (company) {
      counts.set(company, (counts.get(company) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}
