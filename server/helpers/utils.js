export const paginate = {
  limit(limit, value) {
    return !isNaN(limit) ? parseInt(limit, 10) : value || 20;
  },
  offset(offset, value) {
    return !isNaN(offset) ? parseInt(offset, 10) : value || 0;
  },
};
