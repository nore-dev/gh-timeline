
import axios from "../../lib/axios"
import type { NextPage } from 'next'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from "next/image"
import {
  Timeline,
  Events,
  Event
} from '@merc/react-timeline';
import prettyDate from "../../lib/prettydate"
import {GHEvent, GHUser} from "../../lib/GHType"

const renderEvent = (event:GHEvent) => {
  switch (event.type) {
    case "CreateEvent":
    case "DeleteEvent":
    case "ForkEvent":
    case "GollumEvent":
    case "IssueCommentEvent":
    case "IssuesEvent":
    case "MemberEvent":
    case "PullRequestEvent":
    case "PullRequestReviewEvent":
    case "PullRequestReviewCommentEvent":
    case "ReleaseEvent":
    case "SponsorshipEvent":
    case "CommitCommentEvent":
    case "WatchEvent":
      return  <Event date={prettyDate(event.created_at)} key={event.id}>
        <div>
        <Image src={event.actor.avatar_url} alt="pp" width={50} height={50} className="rounded"></Image>
        <h3>{event.type}</h3>
        <h4>{event.repo.name}</h4>
        </div>
      </Event>
   
  }
}

const TimelinePage: NextPage = () => {
    const { username } = useRouter().query
    const [user, setUser] = useState<GHUser>({} as GHUser)
    const [events, setEvents] = useState<GHEvent[]>([])

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
        

      <Timeline>
        <Events >
        {events.map((event) => (
          renderEvent(event)
        ))}
        </Events>
      </Timeline>

    </div>
  )
}

export default TimelinePage
