
import axios from "../../lib/axios"
import type { NextPage } from 'next'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from "next/image"

const TimelinePage: NextPage = () => {
    const { username } = useRouter().query
    const [user, setUser] = useState<any>({})
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        if (!username) return
        

        // Get user info
        axios.get(`users/${username}`).then((res) => {
            setUser(res.data)
        }).catch(error => {
            Router.push({pathname: "/"})
            console.log("User not found")
        }) 


        axios.get(`users/${username}/events`).then((res) => {
          setEvents(res.data)
          console.log(res.data)
        }).catch(error => {
          Router.push({pathname: "/"})
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
        { user.avatar_url &&
          <Image width={150} height={150} src={user.avatar_url} alt="profile_photo" className="rounded"/>
        }
        <h1>{user.login}</h1>
        <h3>{user.bio}</h3>
        <div>
        <h3>{user.followers}</h3><p>Followers</p>
        <h3>{user.following}</h3><p>Following</p>
        </div>


        </div>
        
        {events.map((event) => (
          <div key={event.id}>
              <Image width={50} height={50} src={event.actor.avatar_url} alt="profile_photo" className="rounded"/>
              <h3>{event.type}</h3>
              <h4>{event.repo.name}</h4>
          </div>
        ))}

    </div>
  )
}

export default TimelinePage
