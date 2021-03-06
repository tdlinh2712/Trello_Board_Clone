import React, {Component} from 'react';
import TrelloList from './TrelloList';
import {connect} from 'react-redux';
import { createStore, applyMiddleware, bindActionCreators} from 'redux';
import thunk from 'redux-thunk';
import TrelloActionButton from './TrelloActionButton';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {sort} from '../actions';
import styled from 'styled-components';
import { getListsThunk, watchListAddedEvent,updateDragThunk,watchListDeletedEvent} from '../actions/listsActions';
import {watchCardAddedEvent} from '../actions/cardsActions';
import {moveFirebaseList,moveFirebaseCard} from '../config/firebase';
import TrelloCreate from "./TrelloCreate";

const ListContainer=styled.div`
  display:flex;
  flex-direction:row;
`;

class App extends Component {

  onDragEnd = (result) => {
    const {destination, source, draggableId, type} = result;
    if(!destination) {
      return;
    }
    //update in firebase
    let newCardId;
    if(type==="list")
    {
      moveFirebaseList(source.index, destination.index)
    } else {
      newCardId = moveFirebaseCard(source.droppableId,
        destination.droppableId,
        source.index,
        destination.index,
        draggableId);
      console.log("new card id", newCardId)
    }
    //update in interface
    this.props.dispatch(sort(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId,
      type,
      newCardId
    )
  );
  }

  render() {
    const {lists} = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div>
          <h2>Trello Board Clone</h2>
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {provided =>(
              <ListContainer {...provided.droppableProps} ref={provided.innerRef}>
                {lists.map((list,index) =>
                  <TrelloList listID={list.id} key={list.id} title={list.title} cards = {list.cards} index={index}/>
                )}
                {provided.placeholder}
                <TrelloCreate list />
              </ListContainer>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    )
  }
}
const style = {
  listsContainer : {
    display:"flex",
    flexDirection:"row",
  }
}

const mapStateToProps = state => ({
  lists: state.lists,
})

const mapDispatch = dispatch => {
  let actions = bindActionCreators({ sort });
  dispatch(getListsThunk())
  watchListAddedEvent(dispatch)
  watchListDeletedEvent(dispatch)
  return {
    ...actions,dispatch
  }
}

export default connect(mapStateToProps,mapDispatch) (App);
