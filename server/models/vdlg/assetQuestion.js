/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';

import Question from './question';

const Schema = mongoose.Schema;

const AssetQuestionSchema = new Schema({
  possibilities: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Possibility',
    }],
  },
});

export default Question.discriminator('AssetQuestion', AssetQuestionSchema);
