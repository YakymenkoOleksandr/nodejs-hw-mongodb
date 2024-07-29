import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const contact = await createContact(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    return next(
      createHttpError(
        404,
        'Contact not found or you are not authorized to delete it',
      ),
    );
  }

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updateData = { ...req.body };

  const photo = req.file;

  if (photo) {
    try {
      console.log(`ENABLE_CLOUDINARY: ${env('ENABLE_CLOUDINARY')}`);
      if (env('ENABLE_CLOUDINARY') === 'true') {
        const photoUrl = await saveFileToCloudinary(photo);
        updateData.photo = photoUrl;
      } else {
        const photoUrl = await saveFileToUploadDir(photo);
        updateData.photo = photoUrl;
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
      return next(createHttpError(500, 'Failed to upload photo to Cloudinary'));
    }
  }

  try {
    const result = await updateContact(contactId, userId, updateData);
    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;

  const result = await updateContact(contactId, userId, updateData);

  if (!result || !result.contact) {
    return next(
      createHttpError(
        404,
        'Contact not found or you are not authorized to update it',
      ),
    );
  }

  res.json({
    status: 200,
    message: `Successfully updated contact with id ${contactId}!`,
    data: result.contact,
  });
};
