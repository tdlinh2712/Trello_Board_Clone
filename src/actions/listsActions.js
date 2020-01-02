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
    database.ref(`/`).orderByChild("index").once('value', snap => {
          snap.forEach(data => {
            let list = data.val();
            if(!list.cards) {
              list.cards = [];
            } else {
              const cardArray=Object.values(list.cards).sort((a,b)=> a.index-b.index);
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

export const sort = (
  droppableIdStart,
  droppableIdEnd,
  droppableIndexStart,
  droppableIndexEnd,
  draggableId,
  type
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
      type
    }
  }
}

// export function updateDragThunk(
//     droppableIdStart,
//     droppableIdEnd,
//     droppableIndexStart,
//     droppableIndexEnd,
//     draggableId,
//     type
// ) {
//   return dispatch => {
//     const lists = [];
//     database.ref(`/`).once('value', snap => {
//       console.log("drag thunk:", snap.val());
//     }
//     )
//     .then(() => dispatch(sort((
//       droppableIdStart,
//       droppableIdEnd,
//       droppableIndexStart,
//       droppableIndexEnd,
//       draggableId,
//       type
//     ))))
//   }
// }
