/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';

import Question from './question';

const Schema = mongoose.Schema;

const StringQuestionSchema = new Schema({
  answers: {
    type: [String],
  },
});

export default Question.discriminator('StringQuestion', StringQuestionSchema);
