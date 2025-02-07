import React, { useState } from 'react'
import { Tooltip, IconButton, Typography } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Snackbar } from '@material-ui/core'
import NavList from './NavList'
import '../../css/Nav.css'

import { useSelector } from 'react-redux'
import useFireStore from '../../hooks/useFireStore'

import AddVocabularyModal from '../AddVocabularyModal'





function Nav() {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [isAddVocabularyOpen, setIsAddVocabularyOpen] = useState(false)

    const user = useSelector(store => store.user)
    const { logOut } = useFireStore()


    const handleToggleSideNav = () => setDrawerOpen(prev => !prev)

    const handleLogOut = () => {
        // console.log('logging out the user')
        logOut()
    }

    const handleToggleAddVocabulary = () => {
        setDrawerOpen(false)
        setIsAddVocabularyOpen(prev => !prev)
    }
    return (
        <div className="nav">
            {/* Left Nav */}
            <div className="nav__left">
                {/* Profile */}
                <Tooltip title="Menu" arrow onClick={handleToggleSideNav}>
                    <IconButton>
                        <MenuIcon style={{ color: 'black' }} />
                    </IconButton>
                </Tooltip>

                <Typography variant="h6" className="nav__logoText">
                    <span style={{ color: "#4285F4" }}>L</span>
                    <span style={{ color: "#DB4437" }}>i</span>
                    <span style={{ color: "#4285F4" }}>n</span>
                    <span style={{ color: "#F4B400" }}>g</span>
                    <span style={{ color: "#4285F4" }}>u</span>
                    <span style={{ color: "#DB4437" }}>i</span>

                    <span className="nav__logoText2">Book</span>
                </Typography>
            </div>

            {/* Middle Nav */}
            <div className="nav__middle">
                <input type="text" className="nav__searchInput" placeholder="Search for the words" />
                <SearchIcon />
            </div>


            {/* Right side Nav */}
            <div className="nav__right">
                <NavList handleLogOut={handleLogOut} user={user} handleToggleAddVocabulary={handleToggleAddVocabulary} />
            </div>

            {/* Drawer Container. */}

            <SwipeableDrawer
                open={drawerOpen}
                onClose={handleToggleSideNav}
                onOpen={() => setDrawerOpen(true)}
            >
                <div className="nav__drawer">
                    <NavList handleLogOut={handleLogOut} user={user} column={true} handleToggleAddVocabulary={handleToggleAddVocabulary} handleToggleSideNav={handleToggleSideNav} />
                </div>

            </SwipeableDrawer>

            {/* Add Vocabulary Modal. */}
            {
                isAddVocabularyOpen && <AddVocabularyModal isAddVocabularyOpen={isAddVocabularyOpen} handleColseVocabulary={handleToggleAddVocabulary} setShowSuccessMessage={setShowSuccessMessage} />
            }
            {/* Show Success Message. if(vocabulary-added-firestore🔥)  */}
            {
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={showSuccessMessage}
                    autoHideDuration={2500}
                    onClose={() => setShowSuccessMessage(false)}
                    message='Note Added SuccessFully'
                />
            }
        </div>
    )
}

export default Nav


