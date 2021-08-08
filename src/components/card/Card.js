import React from 'react'
import { CardHeader, Avatar, Divider, Tooltip } from '@material-ui/core'


import { useSelector, useDispatch } from 'react-redux';
import { updateHomePageNote } from '../../actions/index'

import SaveIcon from './Save'
import LikeIcon from './Like'
function Card({ noteData, innerRef, isSavedPage }) {

    const user = useSelector(store => store.user)
    const dispatch = useDispatch()


    return (
        <div ref={innerRef} className="home__card">
            <CardHeader className="home__cardHeader"
                avatar={
                    <Tooltip title={noteData.tag} arrow>
                        <Avatar src={`${noteData.createrPhotoURL}`} />
                    </Tooltip>
                }
                title={`${noteData.createrName}`}
                subheader={`${noteData.createdAtLocal}`}
            />


            <div className="home__cardRow">
                <p className="home__cardRow__heading one">Word</p>
                <p>{noteData.word.trim()}</p>
            </div>
            <Divider variant='middle' />
            <div className="home__cardRow">
                <p className="home__cardRow__heading two">Meaning</p>
                <pre >{noteData.meaning.trim()}</pre>
            </div>
            <Divider variant='middle' />

            <div className="home__cardRow">
                <p className="home__cardRow__heading three">Example</p>
                <pre>{noteData.example.trim().replaceAll('\n\n\n\n\n\n\n\n\n', '')}</pre>
            </div>
            <Divider />
            <div className="home__cardRow bottom" style={{ justifyContent: isSavedPage && 'flex-end' }}>
                {!isSavedPage && <LikeIcon noteData={noteData} user={user} dispatch={dispatch} updateHomePageNote={updateHomePageNote} />}
                <SaveIcon noteData={noteData} user={user} dispatch={dispatch} updateHomePageNote={updateHomePageNote} />
            </div>
        </div>
    )
}

export default Card
