import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import {Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';
import Icon from "@material-ui/core/Icon";
import {deleteCard} from "../actions";
import {deleteCardfromFirebase} from "../config/firebase";
import { connect } from "react-redux";

const CardContainer = styled.div`
    margin: 0 0 8px 0;
    position: relative;
    max-width: 100%;
    word-wrap: break-word;
  `;

const DeleteButton = styled(Icon)`
    position: absolute;
    display:none;
    right: 5px;
    bottom: 5px;
    opacity: 0.5;
    ${CardContainer}:hover & {
      display: block;
      cursor: pointer;
    }
    &:hover {
      opacity: 0.8;
    }
  `;



const TrelloCard = ({text,id,index,listID,dispatch}) => {
  //set state
  const [isEditing, setIsEditing] = useState(false);
  const [cardText, setText] = useState(text);

  const handleDeleteCard = e => {
    deleteCardfromFirebase(listID,id);
    dispatch(deleteCard(listID,id));
  };


  return (
    <Draggable draggableId={String(id)} index={index}>
    {provided =>(
      <CardContainer ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}>
          <Card>
            <DeleteButton fontSize="small" onMouseDown={handleDeleteCard}>
              delete
            </DeleteButton>
            <CardContent>
              <Typography  gutterBottom>
                {text}
              </Typography>
            </CardContent>
          </Card>
      </CardContainer>
    )}
    </Draggable>
  )
}
export default connect()(TrelloCard);
