/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';

import Question from './question';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   StringQuestion:
 *     allOf:
 *       - $ref: '#/definitions/Question'
 *       - properties:
 *           possibilities:
 *             type: array
 *             items:
 *               type: string
 */
const StringQuestionSchema = new Schema({
  possibilityStrings: {
    type: [String],
  },
});

export default Question.discriminator('StringQuestion', StringQuestionSchema);
