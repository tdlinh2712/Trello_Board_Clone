import {CONSTANTS} from "../actions";


let listID=2;
let cardID=5;

const initialState = [
  {
    title:"Last Episode",
    id: `list-${0}`,
    cards: [
      {
        id: `card-${0}`,
        text:"We created a static list and static card",
      },
      {
        id: `card-${1}`,
        text:"do sth",
      },
    ]
  },
  {
    title:"This Episode",
    id: `list-${1}` ,
    cards: [
      {
        id: `card-${2}`,
        text:"We will do sth else",
      },
      {
        id: `card-${3}`,
        text:"do sth else ",
      },
      {
        id: `card-${4}`,
        text:"do sth else else ",
      },
    ]
  }
]

const listReducer = (state = [], action) => {
  switch (action.type) {
    case CONSTANTS.ADD_CARD:
      const newCard = {
        id:action.payload.card.id,
        text:action.payload.card.text,
      }
      const newState = state.map(list => {
        if(list.id === action.payload.listID) {
          return {
            ...list,
            cards: [...list.cards, newCard],
          };
        } else {
          return list;
        }
      });
      console.log(newState);
      return newState;
    case CONSTANTS.DRAG_HAPPENED:
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexStart,
        droppableIndexEnd,
        draggableId,
        type
      } = action.payload;
      const newStateList = [...state];

      //drag list
      if(type==="list") {
        const list = newStateList.splice(droppableIndexStart,1);
        newStateList.splice(droppableIndexEnd,0,...list);
        return newStateList;
      }
      //same list container
      if(droppableIdStart === droppableIdEnd) {
        //console.log("state:",state);
        let list;
        for(var i=0;i<state.length;i++) {
          if(state[i].id==droppableIdStart) {
            list=state[i];
            break;
          }
        }
        const card = list.cards.splice(droppableIndexStart, 1);
        console.log(card);
        list.cards.splice(droppableIndexEnd,0,...card);
      }

      if(droppableIdStart !== droppableIdEnd) {
        //find the list where the drag happened
        let listStart;
        for(var i=0;i<state.length;i++) {
          if(state[i].id==droppableIdStart) {
            listStart=state[i];
            break;
          }
        }
        console.log(listStart);
        const card = listStart.cards.splice(droppableIndexStart, 1);
        let listEnd;
        for(var i=0;i<state.length;i++) {
          if(state[i].id==droppableIdEnd) {
            listEnd=state[i];
            break;
          }
        }
        listEnd.cards.splice(droppableIndexEnd,0,...card);
      }
      return newStateList;
    case CONSTANTS.FETCH_LISTS:
        return action.payload;
    case CONSTANTS.ADD_LIST_DATABASE:
        const newList1 = {
          title:action.payload.title,
          cards: [],
          id:action.payload.id,
        }
        return [...state,newList1];
    default:
      return state;
  }
};
export default listReducer;
