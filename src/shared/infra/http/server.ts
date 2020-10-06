import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});

// Domínio: Qual a área de conhecimento daquele módulo/arquivo

// DDD: Domain Driven Design (Metodologia)
// TDD: Test Driven Development (Metodologia)

// Testes automatizados
/* Garantem que a aplicação continue funcionando independente do número de novas funcionalidades e do número de devs no time. */

// 1. Testes unitários (TDD): testam funcionalidades específicas da aplicação (precisam ser funções puras).
/* Funções puras não realizam chamadas à APIs e não possuem efeitos colaterais. */

// 2. Testes de integração: testam uma funcionalidade completa, passando por várias camadas da aplicação.
/* Route -> Controller -> Service -> Repository -> ... */

// 3. Testes E2E: simulam a ação do usuário dentro da aplicação.
/*
  1. Clique no input de email
  2. Preencha victor@rocketseat.com.br
  3. Clique no input de senha
  4. Preencha 12345
  5. Clique no botão "Logar"
  6. Espero que a página tenha enviado o usuário para o dashboard
*/
