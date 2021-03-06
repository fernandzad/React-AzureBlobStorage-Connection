
import { Response } from './types/SasTokenGenerator.types';

export const getSasToken = async () => {
  const data = await fetch(process.env.REACT_APP_SAS_ENDPOINT || "");
  const json: Response = await data.json();
  return json;
}