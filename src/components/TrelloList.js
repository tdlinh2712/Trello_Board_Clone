import React, { useState } from 'react';
import TrelloCard from './TrelloCard';
import TrelloActionButton from './TrelloActionButton';
import {Droppable,Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';
import {connect} from 'react-redux';
import Icon from "@material-ui/core/Icon";
import {removeListFromFirebase,changeListTitleInFirebase} from "../config/firebase";
import {editTitle} from "../actions"
const ListContainer = styled.div`
  background-color: #dfe3e6;
  border-radius:3px;
  width: 300px;
  padding: 8px;
  margin-right:8px;
  height:100%;
  `;

  const DeleteButton = styled(Icon)`
    cursor: pointer;
    transition: opacity 0.3s ease-in-out;
    opacity: 0.4;
    &:hover {
      opacity: 0.8;
    }
  `;
  const TitleContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;
  const ListTitle = styled.h4`
    transition: background 0.3s ease-in;
    ${TitleContainer}:hover & {
      background: #ccc;
    }
  `;

  const StyledInput = styled.input`
    width: 100%;
    border: none;
    outline-color: blue;
    border-radius: 3px;
    margin-bottom: 3px;
    padding: 5px;
`;

const TrelloList = ({title, cards, listID, index,dispatch}) => {
  //set state
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(title);

  const handleDeleteList = () => {
    console.log(listID);
    removeListFromFirebase(listID);
  };

  const renderEditInput = () => {
    return (
      <form onSubmit={handleFinishEditing}>
        <StyledInput
          type="text"
          value={listTitle}
          onChange={handleChange}
          autoFocus
          onFocus={handleFocus}
          onBlur={handleFinishEditing}
        />
      </form>
    );
  };

  const handleFocus = e => {
    e.target.select();
  };

  const handleChange = e => {
    e.preventDefault();
    setListTitle(e.target.value);
  };

  const handleFinishEditing = e => {
    setIsEditing(false);
    changeListTitleInFirebase(listID, listTitle);
    dispatch(editTitle(listID, listTitle));
  };

  return (
    <Draggable draggableId={String(listID)} index={index}>
    {provided => (
      <ListContainer {...provided.draggableProps} ref={provided.innerRef}
      {...provided.dragHandleProps}>
        <Droppable droppableId={String(listID)}>
          {provided => (
            <div>
              <div>
                {isEditing ? (
                    renderEditInput()
                ) : (
                <TitleContainer onClick={() => setIsEditing(true)}>
                  <ListTitle>{title}</ListTitle>
                  <DeleteButton onClick={handleDeleteList}>
                            delete
                  </DeleteButton>
                </TitleContainer>
                )}
              </div>
              <div {...provided.droppableProps} ref={provided.innerRef}>
              {cards.map((card,index) => (
                <TrelloCard key={card.id} text={card.text} id={card.id} index={index} listID={listID} />
              ))}
              {provided.placeholder}
              <TrelloActionButton listID={listID} cardIndex={cards.length}/>
            </div>
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

export default connect()(TrelloList);
