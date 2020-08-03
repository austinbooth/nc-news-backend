exports.formatDates = (list) => {
  const reformatted = list.map((obj) => {
    const objCopy = { ...obj };
    const unixTimestamp = new Date(objCopy.created_at).toISOString();
    objCopy.created_at = unixTimestamp;
    return objCopy;
  });
  return reformatted;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
