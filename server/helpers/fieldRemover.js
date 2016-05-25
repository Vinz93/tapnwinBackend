module.exports = exports = function fieldRemover(schema, options) {
  schema.set('toJSON', {
    transform(doc, ret, opts) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v; // eslint-disable-line no-underscore-dangle
      const fields = opts.hide || options;
      if (fields) {
        fields.split(' ').forEach(prop => {
          delete ret[prop];
        });
      }
    },
  });
};
