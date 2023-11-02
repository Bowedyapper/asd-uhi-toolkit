import fs from 'fs';

const folderExists = (folderPath: string): boolean => {
  if (fs.existsSync(folderPath)) {
    return true;
  } else {
    return false;
  }
};

export default folderExists;
