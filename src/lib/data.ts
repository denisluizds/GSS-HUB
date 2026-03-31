import { Policy, FastLearningVideo, Recognition, Banner, SiteContent } from './types';
import { INITIAL_FLOWS, siteContent as mockSiteContent } from './mock-data';

export const getPolicies = async (): Promise<Policy[]> => {
  return [
    {
      id: '1',
      title: 'Política de Upgrade de Cabine',
      description: 'Regras e procedimentos para upgrade de cabine em voos nacionais e internacionais.',
      scope: 'Global',
      implementationDate: '2024-01-01',
      considerations: 'Válido para todas as rotas operadas pela LATAM.',
      publicationDate: '2023-12-15',
      lastUpdated: '2024-02-10'
    },
    {
      id: '2',
      title: 'Procedimento de Reacomodação',
      description: 'Diretrizes para reacomodação de passageiros em casos de atrasos ou cancelamentos.',
      scope: 'Operacional',
      implementationDate: '2023-06-01',
      considerations: 'Priorizar passageiros com conexões curtas.',
      publicationDate: '2023-05-20',
      lastUpdated: '2024-01-05'
    }
  ];
};

export const getFastLearningVideos = async (): Promise<FastLearningVideo[]> => {
  return [
    {
      id: '1',
      title: 'Como usar a Matriz Inteligente',
      description: 'Aprenda a navegar pelos fluxos de decisão de forma rápida e eficiente.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      viewCount: 1250,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Novidades na Política de Bagagem',
      description: 'Resumo das principais mudanças nas regras de bagagem despachada.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      viewCount: 850,
      createdAt: '2024-02-01'
    }
  ];
};

export const getAllRecognitions = async (): Promise<Recognition[]> => {
  return [
    {
      id: '1',
      employeeName: 'Maria Silva',
      description: 'Excelente atendimento ao cliente durante a contingência do voo LA3456.',
      imageUrl: 'https://picsum.photos/seed/maria/200/200',
      createdAt: '2024-03-15'
    },
    {
      id: '2',
      employeeName: 'João Santos',
      description: 'Destaque em produtividade e assertividade nos fluxos da Matriz.',
      imageUrl: 'https://picsum.photos/seed/joao/200/200',
      createdAt: '2024-03-10'
    }
  ];
};

export const getBanners = async (): Promise<Banner[]> => {
  return [
    {
      id: '1',
      message: 'Atenção: Nova atualização na política de Waiver v.2 já disponível!',
      isActive: true,
      lastUpdated: '2024-03-30',
      duration: null,
      activatedAt: '2024-03-30T08:00:00Z'
    }
  ];
};

export const siteContent: SiteContent = mockSiteContent;
