import  {CONSTANTS} from "../actions";
import database from '../config/firebase';

export const addCard = (listID,card) => {
  return {
    type:CONSTANTS.ADD_CARD,
    payload:{card,listID}
  }
}
