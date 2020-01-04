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
        //switch id
        let tgId=newStateList[droppableIndexStart].id;
        newStateList[droppableIndexStart].id=newStateList[droppableIndexEnd].id;
        newStateList[droppableIndexEnd].id=tgId;
        return newStateList;
      }

        let listStart;
        for(var i=0;i<state.length;i++) {
          if(state[i].id==droppableIdStart) {
            listStart= newStateList[i];
            break;
          }
        }
        let card = listStart.cards.splice(droppableIndexStart, 1);
        card=card[0];
        card.id=action.payload.newCardId;
        console.log(card)
        //find the list where the drop ended
        let listEnd;
        for(var i=0;i<state.length;i++) {
          if(state[i].id==droppableIdEnd) {
            listEnd=newStateList[i];
            break;
          }
        }
        //switch id
        listEnd.cards.push({id:action.payload.newCardId,text:""});
        for(var i=listEnd.cards.length-1;i>droppableIndexEnd;i--) {
          listEnd.cards[i].text=listEnd.cards[i-1].text;
        }
        listEnd.cards[droppableIndexEnd].text=card.text;

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
    case CONSTANTS.DELETE_CARD:
      let ind
      let listCard;
      //find the list
      let afterDeleteCardState = state.map((list,index) => {
        if(list.id===action.payload.listID) {
          listCard=list;
          ind=index;
        }
        return list;
      })
      afterDeleteCardState.splice(ind,1);
      let cardIndex;
      let newCards=[];
      for(var i=0;i<listCard.cards.length;i++) {
        if(listCard.cards[i].id!==action.payload.cardId)
        {
          newCards.push(listCard.cards[i]);
        }
      }
      const newList = {
        title:listCard.title,
        id:listCard.id,
        cards:newCards
      }
      afterDeleteCardState.splice(ind,0,newList);
      return afterDeleteCardState;
    case CONSTANTS.DELETE_LIST:
      let index;
      let afterDeleteListState = state.map((list,i) => {
        if(list.id===action.payload) {
          index=i;
        }
        return list;
      });
      afterDeleteListState.splice(index,1);
      console.log(afterDeleteListState)
      return afterDeleteListState;
    case CONSTANTS.EDIT_LIST_TITLE:
    const afterEditTitleState = state.map((list,index) => {
      if(list.id===action.payload.listID) {
        return {
          ...list,
          title: action.payload.listTitle
        }
      } else
        {
          return list
        }
    })
    return afterEditTitleState
    default:
      return state;
  }
};
export default listReducer;
