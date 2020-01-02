import firebase from 'firebase';
import uuid from 'uuid/v4';
import {addCard} from '../actions';
//import {updateDragThunk}  from '../actions/listsActions';
const config = {
  apiKey: "AIzaSyBacJ_KKJSLLjgfSicFdtCDNPrPSNM9Pa0",
  authDomain: "trello-clone-e04bd.firebaseapp.com",
  databaseURL: "https://trello-clone-e04bd.firebaseio.com",
  projectId: "trello-clone-e04bd",
  storageBucket: "trello-clone-e04bd.appspot.com",
  messagingSenderId: "339754565110",
  appId: "1:339754565110:web:08f0168aff109bc09e5bd7",
  measurementId: "G-L5YDB5K7CS"
};
firebase.initializeApp(config);
const database = firebase.database()

export const addListToFirebase = (title,listIndex) => {
  //this will give us a unique id for our tasks
  const id = Date.now();
  const cards = null;
  const index = listIndex
  database.ref(`/${id}`).set({
    title, id, cards,index
  })
}

export const removeListFromFirebase = (id) => {
    database.ref(`/${id}`).remove()
}

export const addCardToFirebase = (listID,text,cardIndex) => {
  //this will give us a unique id for our tasks
  const id = Date.now();
  const index= cardIndex;
  const cards = null;
  database.ref(`/${listID}/cards/${id}`).set({
    id, text,index
  })
  const card = {id:id,text:text}
  return card
  //dispatch(addCard(dispatch,listID,card));
}

// export const sortFirebase = (droppableIdStart,
// droppableIdEnd,
// droppableIndexStart,
// droppableIndexEnd,
// draggableId,
// type) => {
//   //this will give us a unique id for our tasks
//   console.log(droppableIdStart,
//   droppableIdEnd,
//   droppableIndexStart,
//   droppableIndexEnd,
//   draggableId,
//   type);
//   //drag list
//   if(type==="list") {
//     const sourceId=draggableId;
//     const ref = database.ref(`/${draggableId}`);
//     moveFbRecord(droppableIndexStart,droppableIndexEnd);
//   }
//   updateDragThunk(droppableIdStart,
//   droppableIdEnd,
//   droppableIndexStart,
//   droppableIndexEnd,
//   draggableId,
//   type);
// }

export function moveFirebaseList(droppableIndexStart, droppableIndexEnd) {
     database.ref(`/`).once('value', function(snap)  {
          const value = snap.val();
          const valueArray = Object.values(value);
          //console.log(valueArray);
          const listStart = valueArray[droppableIndexStart];
          const listEnd = valueArray[droppableIndexEnd];
          console.log(listStart,listEnd);
          if(!listStart.cards) {
            listStart.cards = [];
          }
          if(!listEnd.cards) {
            listEnd.cards = [];
          }
          // database.ref(`/${listStart.id}`).set({cards: listEnd.cards,id:listStart.id,title: listEnd.title});
          // database.ref(`/${listEnd.id}`).set({cards: listStart.cards,id:listEnd.id,title:listStart.title});
          let tg = listStart.index;
          database.ref(`/${listStart.id}`).update({index:listEnd.index});
          database.ref(`/${listEnd.id}`).update({index:listStart.index});
     });
}

export function moveFirebaseCard(droppableIdStart,droppableIdEnd,droppableIndexStart,droppableIndexEnd,draggableId) {
     database.ref(`/`).once('value', function(snap)  {
          const value = snap.val();
          console.log("value:",value);
          const valueArray = Object.values(value).sort((a,b) => a.index-b.index);

          let listStart = value[droppableIdStart];
          let listEnd = value[droppableIdEnd];
          if(!listStart.cards) {
            listStart.cards = [];
          } else {
            let startCards = Object.values(listStart.cards).sort((a, b) => a.index - b.index);
            listStart.cards = startCards;
          }
          if(!listEnd.cards) {
            listEnd.cards = [];
          } else {
            let endCards = Object.values(listEnd.cards).sort((a, b) => a.index - b.index);
            listEnd.cards = endCards;
          }



          const card = listStart.cards[droppableIndexStart];
          //console.log(droppableIndexStart,card);
          // database.ref(`/${listStart.id}`).set({cards: listEnd.cards,id:listStart.id,title: listEnd.title});
          // database.ref(`/${listEnd.id}`).set({cards: listStart.cards,id:listEnd.id,title:listStart.title});
          let tg = listStart.index;
          database.ref(`/${listStart.id}/cards/${card.id}`).remove();
          for(var i=droppableIndexStart+1;i<listStart.cards.length;i++)
          {
            database.ref(`/${listStart.id}/cards/${listStart.cards[i].id}`).update({index:i-1});
          }
          card.index=droppableIndexEnd;
          for(var i=droppableIndexEnd;i<listEnd.cards.length;i++)
          {
            database.ref(`/${listEnd.id}/cards/${listEnd.cards[i].id}`).update({index:i+1});
          }
          database.ref(`/${listEnd.id}/cards/${card.id}`).set(card);

     });
}



export default database
