import React, { createRef, ReactPropTypes, RefObject, useEffect, useRef, useState } from 'react'; // we need this to make JSX compile
import styles from './ReaderView.module.scss'
import epubjs, { Book, Rendition } from 'epubjs-myh'
import bookImport from '@resources/placeholder/courage.epub'
import View, { ViewSettings } from 'epubjs-myh/types/managers/view';
import redrawAnnotations from './functions/redrawAnnotations';

import { readerInstanceVariables } from "./ReaderView.d";
import highlightText from './functions/highlightText';
import mouseEvents from './functions/mouseEvents'


import { connect, ConnectedProps } from 'react-redux'



import store, {RootState} from '@store/store'
import {AddRendition, RemoveRendition, ToggleMenu, SetLoadState, LOADSTATE} from '@store/slices/bookStateSlice'
import DialogPopup from './DialogPopup/DialogPopupV2';
const mapState = (state: RootState) => {
    if(Object.keys(state.bookState).includes("0")){
        return {
            LoadState: state.bookState[0].loadState,
        }
    }else{
        return {LoadState: LOADSTATE.INITIAL}
    }

}

const connector = connect(mapState, {AddRendition, ToggleMenu, SetLoadState, RemoveRendition})

type PropsFromRedux = ConnectedProps<typeof connector>


// https://stackoverflow.com/questions/59072200/useselector-destructuring-vs-multiple-calls

class Reader extends React.Component<PropsFromRedux>{
    private renderWindow = createRef<HTMLDivElement>()
    private book!:Book;
    private rendition!: Rendition;
    private UID!:string;
    private instanceVariables:readerInstanceVariables = {
        timer: null,
        mouseUp: true
    }

    constructor(props:PropsFromRedux){
        super(props)

        // This is used to ensure that in the case multiple renditions are on the page, there will not be conflicts
        this.UID = Math.random().toString()
    }

    componentDidMount(){
        const book = epubjs(bookImport)
        this.rendition = book.renderTo(this.renderWindow.current?.id || "",
            {
                width: "100%",
                height: "100%",
                spread: "always"
            });
        this.rendition.themes.default({
            body: { "padding-top": "10px !important" },
        })

        console.log(book)

        // store.dispatch(AddRendition(this.rendition))

        this.rendition.book.loaded.spine.then(async (x)=>{
            this.props.AddRendition({instance:this.rendition, UID:0})
        })

        book.ready.then(async ()=>{
            this.props.SetLoadState({view:0, state:LOADSTATE.LOADING_LOCATIONS})

            // This code will handle the edge case where a book is still loading but the user leaves the page, unmounting the component.
            // We use the standard subscribe here since react-redux will not pass the state updates once unmounted.
            let cancel_Load = false
            const unsubscribe = store.subscribe(()=>{
                const load_state = store.getState().bookState["0"].loadState
                if(load_state == LOADSTATE.CANCELED){
                    cancel_Load = true
                    // unsubscribe immediately
                    unsubscribe()
                    // Remove rendition from state immediately to prevent duplicate removals
                    this.props.RemoveRendition(0)
                }
            })
            await book.locations.generate(1000)
            unsubscribe()

            // This will destroy the rendition only once the generations have been generated.
            // This prevents the application from crashing
            if(cancel_Load){
                this.rendition.destroy();
                return
            }


            this.props.SetLoadState({view:0, state:LOADSTATE.COMPLETE})

        })




        // .then(
        //   (value) => {
        //     console.log(value); // Success!
        //   },
        //   (reason) => {
        //     console.error(reason); // Error!
        //   },







        // let readerInstanceVariables = require('./ReaderViewTypes.ts').readerInstanceVariables



        mouseEvents(this.rendition, this.instanceVariables, ()=> this.props.ToggleMenu(0))
        // highlightText(this.rendition, instanceVariables)
        redrawAnnotations(this.rendition)



        const displayed = this.rendition.display();
    }

    componentWillUnmount(){
        // This handles the edgecase where the locations are loading, but the user exits the page.
        if(this.props.LoadState == LOADSTATE.LOADING_LOCATIONS){
            this.props.SetLoadState({view: 0, state:LOADSTATE.CANCELED})
            return
        }
        this.props.RemoveRendition(0)
        this.rendition.destroy();
    }
    render(): React.ReactNode {
        return(
            <>

                <div className={styles.epubContainer} id={"BookArea" + this.UID} ref={this.renderWindow}/>
                <DialogPopup resetMouse={()=>this.instanceVariables.mouseUp = false}/>
            </>
        )
    }

}

// https://stackoverflow.com/questions/66277647/how-to-use-redux-toolkit-createslice-with-react-class-components
export default connector(Reader)

