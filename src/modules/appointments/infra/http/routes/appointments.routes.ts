import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

/**
 * Rota:
 *  Receber a requisição, chamar outro arquivo, devolver uma resposta
 *  Pode conter transformação de dados
 */

// SoC: Separation of Concerns (SRP)
// DTO: Data Transfer Object (parâmetros nomeados)

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
