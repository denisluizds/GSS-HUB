import { OperationalFlow } from './types';

export const INITIAL_FLOWS: OperationalFlow[] = [
  {
    id: 'flow-1',
    title: 'Exemplo de Fluxo',
    description: 'Um fluxo de exemplo para demonstração.',
    active: true,
    rootNodeId: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1',
        type: 'question',
        text: 'Você deseja continuar?',
        options: [
          { text: 'Sim', nextNodeId: 'node-2' },
          { text: 'Não', nextNodeId: 'node-3' }
        ]
      },
      'node-2': {
        id: 'node-2',
        type: 'result',
        result: {
          policy: 'Política de Continuidade',
          offered: 'Acesso total ao sistema',
          isNegative: false
        }
      },
      'node-3': {
        id: 'node-3',
        type: 'result',
        result: {
          policy: 'Política de Encerramento',
          offered: 'Nenhum serviço disponível',
          isNegative: true
        }
      }
    }
  }
];

export const siteContent = {
  homeTitle: 'LATAM Agency Hub',
  homeSubtitle: 'Seu ponto de acesso rápido às políticas e procedimentos mais importantes para o canal.',
  policiesTitle: 'Políticas e Procedimentos'
};
