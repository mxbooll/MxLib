import React, { useState } from 'react';
import styles from './Home.module.css'

type CardProps = {
    title?: string,
    paragraph?: string
}

const Home = ({ title, paragraph }: CardProps) =>{
    const [counter, setCounter] = useState(0)

    return (
        <aside>
            <div id={styles.homeButton} onClick={()=>{console.log("test");setCounter(counter + 1)}}>
                Hello World = {counter}
            </div>

        </aside>
    )
}

export default Home

