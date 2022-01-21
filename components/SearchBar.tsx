import Link from "next/link"
import {FC, ReactElement, useState} from "react"

type SearchBarProps = {}

const SearchBar: FC<SearchBarProps> = ():ReactElement => {
    const [username, setUsername] = useState("")
    return <>
        <input placeholder="Type username..." onChange={
            (e) => setUsername(e.target.value)
        }></input>

        <Link href={`user/${username}`}><a>Search</a></Link>
    </>
}

export default SearchBar