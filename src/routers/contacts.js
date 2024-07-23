
import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  deleteContactController,
  createContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/register', validateBody(createContactSchema), ctrlWrapper(createContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

export default router;
