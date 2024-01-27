import React, { useEffect, useState } from 'react'
import ReaderView from './ReaderView/ReaderView'
import styles from './Reader.module.scss'

import Bookmark from '@resources/feathericons/bookmark.svg'
import List from '@resources/feathericons/list.svg'
import Search from '@resources/feathericons/search.svg'
import Font from '@resources/iconmonstr/text-3.svg'
import ArrowLeft from '@resources/feathericons/arrow-left.svg'
import ArrowRight from '@resources/feathericons/arrow-right.svg'

import { Rendition } from 'epubjs-myh'
import Sidebar from './SideBar/SideBar'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { ToggleSidebar } from '@store/slices/bookStateSlice'
const Home = () =>{

    const menuOpen = useAppSelector((state) => state.bookState[0]?.options?.menuToggled)
    const renditionInstance = useAppSelector((state) => state.bookState[0]?.instance)
    const dispatch = useAppDispatch()

    return (
        <div className={styles.readerFlex}>

            <div className={`${styles.readerTitleBar}  ${!menuOpen && styles.optionsToggled}`}>
                <div className={`${styles.menuButtonContainer}`}>
                    <List onClick={()=>{dispatch(ToggleSidebar(0))}}/>
                    <Bookmark/>
                </div>
                <div>
                    {renditionInstance?.book?.packaging?.metadata?.title}
                </div>
                <div className={`${styles.menuButtonContainer}`}>
                    <Search/>
                    <Font/>
                </div>
            </div>
            <ReaderView

            />

            <div className={`${styles.readerFooterBar}  ${!menuOpen && styles.optionsToggled}`}>
                <div onClick={()=>renditionInstance?.prev()} className={`${styles.menuButtonContainer}`}>
                    <ArrowLeft/>
                </div>
                <div onClick={()=>renditionInstance?.next()} className={`${styles.menuButtonContainer}`}>
                    <ArrowRight/>
                </div>

            </div>



            <Sidebar/>


        </div>
    )
}

export default Home

