import { LocalizedText } from '@core/i18n/localized-text.model';

export interface SkillGroup {
  titleKey: string;
  items: string[];
}

export type CourseItem = LocalizedText;

export interface CourseGroup {
  titleKey: string;
  items: CourseItem[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    titleKey: 'about.skillFrontend',
    items: ['Angular', 'React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    titleKey: 'about.skillBackend',
    items: ['Laravel', 'PHP', 'REST APIs', 'PostgreSQL', 'MySQL'],
  },
  {
    titleKey: 'about.skillOther',
    items: ['Prompt Engineering', 'WordPress', '.NET (C#)', 'Git', 'Docker (básico)', 'Cloudinary'],
  },
  {
    titleKey: 'about.skillFragrance',
    items: [
      'Diagnóstico olfativo',
      'Layering de fragancias',
      'Matching de perfumes',
      'Familias olfativas',
    ],
  },
];

export const COURSE_GROUPS: CourseGroup[] = [
  {
    titleKey: 'about.skillFrontend',
    items: [
      {
        es: 'Angular desde Cero a Experto: Crear una Aplicación Real',
        en: 'Angular from Scratch to Expert: Build a Real App',
      },
      { es: 'React: de Cero a Experto (Hooks y MERN)', en: 'React: From Scratch to Expert (Hooks & MERN)' },
      { es: 'Curso Profesional de JavaScript', en: 'Professional JavaScript Course' },
    ],
  },
  {
    titleKey: 'about.skillBackend',
    items: [
      {
        es: 'Aprende a Crear una Plataforma de Cursos con Laravel',
        en: 'Learn to Build a Course Platform with Laravel',
      },
      {
        es: 'Desarrollo Web en PHP con Laravel 5.6, VueJS y MariaDB MySQL',
        en: 'Web Development in PHP with Laravel 5.6, VueJS and MariaDB MySQL',
      },
      {
        es: 'Curso de Laravel y Livewire - Crea un Sistema de Parking',
        en: 'Laravel and Livewire Course - Build a Parking System',
      },
      {
        es: 'Construyendo Web APIs RESTful con ASP.NET Core 6',
        en: 'Building RESTful Web APIs with ASP.NET Core 6',
      },
      { es: 'Curso de Refactorización con PHP', en: 'PHP Refactoring Course' },
      { es: 'Curso de Laravel 10 desde Cero', en: 'Laravel 10 From Scratch' },
    ],
  },
  {
    titleKey: 'about.skillOther',
    items: [
      { es: 'Diplomado: Webmaster', en: 'Diploma: Webmaster' },
      { es: 'Diplomado: Diseño de Medios Web', en: 'Diploma: Web Media Design' },
      {
        es: 'Diseño Gráfico, Edición de Video y Programación Web con IA (2026)',
        en: 'Graphic Design, Video Editing and Web Programming with AI (2026)',
      },
      {
        es: 'Diplomado Internacional en Marketing Digital con IA (2026)',
        en: 'International Diploma in Digital Marketing with AI (2026)',
      },
    ],
  },
];
