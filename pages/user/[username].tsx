
import axios from "../../lib/axios"
import type { NextPage } from 'next'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Timeline: NextPage = () => {
    const { username } = useRouter().query
    const [user, setUser] = useState<any>({})

    useEffect(() => {
        if (!username) return
        
        axios.get(`users/${username}`).then((res) => {
            setUser(res.data)
        }).catch(error => {
            Router.push({pathname: "/"})
            console.log("User not found")
        }) 

    }, [username])

    return (
    <div className="text-center">
      <Head>
        <title>@{username}</title>
        <meta name="description" content="Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div>
        <img width={150} height={150} alt="profile_photo" className="rounded" src={user.avatar_url}></img>
        <h1>{user.login}</h1>
        <h3>{user.bio}</h3>
        <div>
        <h3>{user.followers}</h3><p>Followers</p>
        <h3>{user.following}</h3><p>Following</p>
        </div>


        </div>
    </div>
  )
}

export default Timeline
