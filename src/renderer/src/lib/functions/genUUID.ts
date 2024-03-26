const genUUID = (): string => {
  return crypto.randomUUID();
};

export default genUUID;
