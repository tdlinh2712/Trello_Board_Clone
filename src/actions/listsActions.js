import database from '../config/firebase';
import  {CONSTANTS} from "../actions";
import thunkMiddleware from 'redux-thunk';
import {moveFbRecord}  from '../config/firebase';

export const addList = list => {
  console.log(database);
  return {
    type:CONSTANTS.ADD_LIST_DATABASE,
    payload: list,
  }
}

// export const addListDatabase = title => {
//   database.push().set(title);
// };

export const fetchLists = lists => {
    return {
      type: CONSTANTS.FETCH_LISTS,
      payload: lists,
    };
  }

/**
 * THUNKS
 */
export function getListsThunk() {
  return dispatch => {
    const lists = [];
    database.ref(`/`).once('value', snap => {
          snap.forEach(data => {
            let list = data.val();
            if(!list.cards) {
              list.cards = [];
            } else {
              const cardArray=Object.values(list.cards);
              list.cards = cardArray;
            }
            lists.push(list)
          })
      })
    .then(() => dispatch(fetchLists(lists)))
  }
}

export function watchListAddedEvent(dispatch) {
  database.ref(`/`).on('child_added', (snap) => {
    dispatch(addList(snap.val()));
  });
}

export function watchListDeletedEvent(dispatch) {
  database.ref(`/`).on('child_removed', (snap) => {
    console.log(snap.val());
    dispatch(deleteList(snap.val().id));
  });
}

export const deleteList = listID => {
  return {
    type: CONSTANTS.DELETE_LIST,
    payload: listID
  }
}


export const sort = (
  droppableIdStart,
  droppableIdEnd,
  droppableIndexStart,
  droppableIndexEnd,
  draggableId,
  type,
  newCardId
) => {
  console.log("heyy");
  //drag list
  return {
    type: CONSTANTS.DRAG_HAPPENED,
    payload: {
      droppableIdStart,
      droppableIdEnd,
      droppableIndexStart,
      droppableIndexEnd,
      draggableId,
      type,
      newCardId
    }
  }
}

export const editTitle = (listID, listTitle) => {
  return {
    type: CONSTANTS.EDIT_LIST_TITLE,
    payload: {listID:listID,listTitle:listTitle}
  }
}
