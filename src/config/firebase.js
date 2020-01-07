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

export const addListToFirebase = (title) => {
  //this will give us a unique id for our tasks
  const id = Date.now();
  const cards = null;
  database.ref(`/${id}`).set({
    title, id, cards
  })
}

export const removeListFromFirebase = (id) => {
    database.ref(`/${id}`).remove()
}

export const addCardToFirebase = (listID,text) => {
  //this will give us a unique id for our tasks
  const id = Date.now();
  const cards = null;
  database.ref(`/${listID}/cards/${id}`).set({
    id, text
  })
  const card = {id:id,text:text}
  return card
  //dispatch(addCard(dispatch,listID,card));
}

export const deleteCardfromFirebase = (listID,cardId) => {
  database.ref(`/${listID}/cards/${cardId}`).remove();
}


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
          database.ref(`/${listStart.id}`).update({cards: listEnd.cards,title: listEnd.title});
          database.ref(`/${listEnd.id}`).update({cards: listStart.cards,title:listStart.title});
          // let tg = listStart.index;
          // database.ref(`/${listStart.id}`).update({index:listEnd.index});
          // database.ref(`/${listEnd.id}`).update({index:listStart.index});
     });
}

export function changeListTitleInFirebase(listID, listTitle) {
  database.ref(`/${listID}`).update({title:listTitle});
}

export const moveFirebaseCard = (droppableIdStart,droppableIdEnd,droppableIndexStart,droppableIndexEnd,draggableId) => {
     let newCardId;
     database.ref(`/`).once('value', function(snap)  {
          const value = snap.val();
          const valueArray = Object.values(value);
          let listStart = value[droppableIdStart];
          let listEnd = value[droppableIdEnd];
          if(!listStart.cards) {
            listStart.cards = [];
          } else {
            let startCards = Object.values(listStart.cards);
            listStart.cards = startCards;
          }
          if(!listEnd.cards) {
            listEnd.cards = [];
          } else {
            let endCards = Object.values(listEnd.cards);
            listEnd.cards = endCards;
          }

          const card = listStart.cards[droppableIndexStart];

          database.ref(`/${listStart.id}/cards/${card.id}`).remove();
          listStart.cards.splice(droppableIndexStart,1)

          newCardId = Date.now();
          card.id=newCardId;
          database.ref(`/${listEnd.id}/cards/${newCardId}`).set(card);
          listEnd.cards.push(card);

          for(var i=droppableIndexEnd+1;i<listEnd.cards.length;i++) {
            database.ref(`/${listEnd.id}/cards/${listEnd.cards[i].id}`).update({text:listEnd.cards[i-1].text});
            console.log(listEnd.cards);
          }
          database.ref(`/${listEnd.id}/cards/${listEnd.cards[droppableIndexEnd].id}`).update({text:card.text});
     });
     return newCardId;
}

export function editCardInFirebase(id,listID,cardText) {
  database.ref(`/${listID}/cards/${id}`).update({text:cardText});
}



export default database
