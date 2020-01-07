import  {CONSTANTS} from "../actions";
import database from '../config/firebase';

export const addCard = (listID,card) => {
  return {
    type:CONSTANTS.ADD_CARD,
    payload:{card,listID}
  }
}
export const deleteCard = (listID,cardId) => {
  return {
    type:CONSTANTS.DELETE_CARD,
    payload:{cardId,listID}
  }
}
export const editCard = (cardId, listID, cardText) => {
  return {
    type:CONSTANTS.EDIT_CARD,
    payload:{cardId,listID,cardText}
  }
}
