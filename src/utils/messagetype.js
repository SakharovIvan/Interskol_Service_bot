const messageType = (doc) => {
  if (doc === undefined) {
    return "question";
  } else {
    return "docfile";
  }
};

export default messageType;
