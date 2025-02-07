import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, TextField } from '@material-ui/core'
import React, { useReducer, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateHomePageByPrepand, updateUserTag } from '../actions/index'
import { serverTimeStamp } from '../firebase'
import useFireStore from '../hooks/useFireStore'


function AddVocabulary({ isAddVocabularyOpen, handleColseVocabulary, setShowSuccessMessage }) {

    const formRef = useRef()

    const dispatchRedux = useDispatch()

    // 1.Default Value 2.Reducer 3.useReducerHook.
    let errorDefaultValue = {
        word: false,
        tag: false,
        meaning: false,
        meaningLength: 0,
        example: false,
        exampleLength: 0,
    }
    function reducer(state = errorDefaultValue, action) {
        switch (action.type) {
            case 'ERROR_WORD':
                return {
                    ...state,
                    word: true
                }
            case 'ERROR_TAG':
                return {
                    ...state,
                    tag: true
                }
            case 'ERROR_MEANING':
                return {
                    ...state,
                    meaning: true
                }
            case 'ERROR_EXAMPLE':
                return {
                    ...state,
                    example: true
                }
            case 'UPDATE_MEANING_LENGTH':
                return {
                    ...state,
                    meaningLength: action.payLoad
                }
            case 'UPDATE_EXAMPLE_LENGTH':
                return {
                    ...state,
                    exampleLength: action.payLoad
                }
            case 'RESET_ERROR':
                return {
                    ...errorDefaultValue,
                    meaningLength: state.meaningLength,
                    exampleLength: state.exampleLength
                }

            default:
                return state

        }
    }
    const [errorState, dispatch] = useReducer(reducer, errorDefaultValue)

    //Redux state
    const user = useSelector(store => store.user)

    // Custom Hook
    const { addVocabulary, updateUserTagInFireStore, updateUserTagInFireStorePrivate, getPublicNotesAfterListener } = useFireStore()

    //handle Reset ErrorState
    const handleOnChange = () => dispatch({ type: 'RESET_ERROR' })

    // add's user Tag List
    const addTagToUserTagList = (tag, privacyType) => {
        if (privacyType === 'public') {
            if (user.tags) {
                if (!user.tags.includes(tag)) {
                    user.tags.unshift(tag)
                    dispatchRedux(updateUserTag(user.tags)) // update in frontEnd
                    updateUserTagInFireStore(user.uid, user.tags) //update in BE
                        .catch(err => console.log(err))
                }
            } else {
                user.tags = [tag]
                dispatchRedux(updateUserTag({ tags: user.tags })) //Update in FE
                updateUserTagInFireStore(user.uid, user.tags) //Update in BE
            }
        } else if (privacyType === 'private') {

            if (user.privateTags) {
                console.log('dooin it')
                if (!user.privateTags.includes(tag)) {
                    user.privateTags.unshift(tag)
                    dispatchRedux(updateUserTag({ privateTags: user.privateTags })) // update in frontEnd
                    updateUserTagInFireStorePrivate(user.uid, user.privateTags) //update in BE
                        .catch(err => console.log(err))
                }
            } else {
                user.privateTags = [tag]
                dispatchRedux(updateUserTag(user.privateTags)) //Update in FE
                updateUserTagInFireStorePrivate(user.uid, user.privateTags) //Update in BE
            }
        }

    }

    // handleFormSubmit 95-98.validate data, 100-110.add data to fire store,102-105 add to local reduxStore if its public data.
    const handleSubmit = (e) => {
        e.preventDefault();
        let privacy = formRef.current.privacy.checked ? formRef.current.privacy.value : 'private'
        const data = {
            word: formRef.current.word.value.trim(),
            tag: formRef.current.tag.value.trim(),
            meaning: formRef.current.meaning.value.trim().replaceAll('\n\n\n\n\n\n\n\n\n', ''),
            example: formRef.current.example.value.trim().replaceAll('\n\n\n\n\n\n\n\n\n', ''),
            createdAt: serverTimeStamp(),
            uid: user.uid,
            createrName: user.name,
            createrPhotoURL: user.photoURL,
            privacyType: privacy
        }

        if (data.word === '') return dispatch({ type: 'ERROR_WORD' })
        if (data.tag === '') return dispatch({ type: 'ERROR_TAG' })
        if (data.meaning === '') return dispatch({ type: 'ERROR_MEANING' })
        if (data.example === '') return dispatch({ type: 'ERROR_EXAMPLE' })

        addVocabulary(data)
            .then(() => {
                getPublicNotesAfterListener()
                    .then(docs => {
                        let dataRes = docs.docs.map(doc => (
                            {
                                id: doc.id,
                                ...doc.data()
                            }))
                        dispatchRedux(updateHomePageByPrepand(dataRes[0]))
                        handleColseVocabulary()
                        setShowSuccessMessage(true)
                    })
            })
            .catch(err => console.error(err.message))
        addTagToUserTagList(data.tag, data.privacyType)
    }

    // of meaning and example TextFiels.
    const handleLengthUpdate = (event, type) => {
        const length = event.target.value.length
        dispatch({
            type: type,
            payLoad: length
        })
    }

    return (
        <Dialog aria-labelledby="form-dialog-title"
            open={true}
            onClose={handleColseVocabulary}
            disableBackdropClick
        >
            <DialogTitle id="form-dialog-title">Add Vocabulary 📑</DialogTitle>
            <form onSubmit={handleSubmit} ref={formRef} autoComplete='off' >
                <DialogContent>
                    <DialogContentText >
                        Imporve your vocabulary by publishing in Note Gram.
                    </DialogContentText>
                    <TextField
                        error={errorState.word}
                        autoFocus
                        margin="dense"
                        name="word"
                        label="Enter The Word"
                        type="text"
                        helperText="The word"
                        fullWidth
                        onFocus={handleOnChange}
                    />
                    <TextField
                        error={errorState.tag}
                        margin="dense"
                        name="tag"
                        label="Give a Tag"
                        type="text"
                        fullWidth
                        helperText={`where you heard the word, [ office, playground, travell,..etc]`}
                        onFocus={handleOnChange}
                        list="tagSuggestion"
                        inputProps={{
                            list: "tagSuggestion"
                        }}
                    />
                    <datalist id="tagSuggestion">
                        {user.tags && user.tags.map(data => <option value={data} />)}
                    </datalist>
                    <TextField
                        error={errorState.meaning}
                        margin="dense"
                        name="meaning"
                        label="Enter the meaning of the word"
                        fullWidth
                        multiline
                        helperText={`${errorState.meaningLength} /  max of 200 characters`}
                        rowsMax='10'
                        inputProps={{ maxLength: 200 }}
                        onFocus={handleOnChange}
                        onChange={(e) => handleLengthUpdate(e, 'UPDATE_MEANING_LENGTH')}
                    />

                    <TextField
                        error={errorState.example}
                        fullWidth
                        name="example"
                        multiline
                        label="real time example"
                        helperText={`${errorState.exampleLength} /  max of 100 characters`}
                        inputProps={{ maxLength: 100 }}
                        onFocus={handleOnChange}
                        onChange={(e) => handleLengthUpdate(e, 'UPDATE_EXAMPLE_LENGTH')}
                    />
                    <FormControlLabel
                        value="public"
                        control={<Checkbox name="privacy" defaultChecked color="primary" />}
                        label="public"
                        labelPlacement="end"

                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleColseVocabulary} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Post
                    </Button>
                </DialogActions>
            </form>


        </Dialog>

    )
}

export default AddVocabulary
