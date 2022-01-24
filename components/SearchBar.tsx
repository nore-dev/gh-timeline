import Link from "next/link"
import {FC, ReactElement, useState} from "react"

type SearchBarProps = {}

const SearchBar: FC<SearchBarProps> = ():ReactElement => {
    const [username, setUsername] = useState("")
    const [received, setReceived] = useState(false)
    return <div style={{fontSize: "large"}}>
        <input className="get-user" placeholder="Type username..." onChange={
            (e) => setUsername(e.target.value)
        }></input>

        <Link href={`/user/${username}?received=${received}`} passHref><a className="get-timeline">Get Timeline</a></Link>
        <br></br>
        <label htmlFor="received">Get received events</label>
        <input type="checkbox" id="received" onChange={(e) => setReceived(!received)} checked={received}></input>
    </div>
}

export default SearchBar