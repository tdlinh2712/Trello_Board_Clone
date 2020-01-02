import React from 'react';
import TrelloCard from './TrelloCard';
import TrelloActionButton from './TrelloActionButton';
import {Droppable,Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';

const ListContainer = styled.div`
  background-color: #dfe3e6;
  border-radius:3px;
  width: 300px;
  padding: 8px;
  margin-right:8px;
  height:100%;
  `;
const TrelloList = ({title, cards, listID, index}) => {
  return (
    <Draggable draggableId={String(listID)} index={index}>
    {provided => (
      <ListContainer {...provided.draggableProps} ref={provided.innerRef}
      {...provided.dragHandleProps}>
        <Droppable droppableId={String(listID)}>
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <h4>{title}</h4>
              {cards.map((card,index) => (
                <TrelloCard key={card.id} text={card.text} id={card.id} index={index} />
              ))}
              {provided.placeholder}
              <TrelloActionButton listID={listID} cardIndex={cards.length}/>
            </div>
          )}
        </Droppable>
      </ListContainer>
    )}
    </Draggable>
  )
};

const style = {
  container: {
    backgroundColor: "#dfe3e6",
    borderRadius:3,
    width: 300,
    padding: 8,
    marginRight:8,
    height:"100%",
  }
}

export default TrelloList;
