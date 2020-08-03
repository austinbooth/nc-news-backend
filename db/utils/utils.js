exports.formatDates = (list) => {
  const reformattedList = list.map((obj) => {
    const objCopy = { ...obj };
    const psqlTimestamp = new Date(objCopy.created_at);
    objCopy.created_at = psqlTimestamp;
    return objCopy;
  });
  return reformattedList;
};

exports.makeRefObj = (list) => {
  const refObj = {};
  list.forEach((article) => {
    const title = article.title;
    const articleId = article.article_id;
    refObj[title] = articleId;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const reformattedComments = comments.map((comment) => {
    const {
      body,
      belongs_to,
      created_by: author,
      votes,
      created_at: createdAtInMS,
    } = comment;
    const article_id = articleRef[belongs_to];

    const created_at = new Date(createdAtInMS);

    return { body, article_id, author, votes, created_at };
  });
  return reformattedComments;
};
