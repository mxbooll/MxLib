import React, { useState } from 'react'; // we need this to make JSX compile
import styles from './Home.module.css'
import { setDetails } from "../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { increment } from "../store/slices/counterSlice";

type CardProps = {
    title?: string,
    paragraph?: string
}

const Home = ({ title, paragraph }: CardProps) =>{
    const profile = useAppSelector((state) => state.profile)
    const dispatch = useAppDispatch()
    console.log("High level rerender")
    return (
        <aside>
            {JSON.stringify(profile)}
            {/* Hello World = {counter} */}

            <div>
                name: <input value={profile.name} onChange={(e) => {
                dispatch(setDetails({
                    name: e.target.value,
                    age: profile.age
                }))}}></input>
                Age: <input type="number" value={profile.age} onChange={(e) => {
                dispatch(setDetails({
                    name: profile.name,
                    age:Number.parseInt(e.target.value)
                }))
            }}></input>
            </div>

            <ChildComponent/>

        </aside>
    )
}

const ChildComponent = () =>{
    const count = useAppSelector((state) => state.counter.value)
    const [counter, setCounter] = useState(0)
    const dispatch = useAppDispatch()
    console.log("Child Render")
    return (
        <div id={styles.homeButton} onClick={()=>{console.log("test");setCounter(counter + 1); dispatch(increment())}}>
            <span>{count} + {counter}</span>
        </div>
    )
}
export default Home

