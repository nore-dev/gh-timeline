
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
      return <>
            {" created "} {event.payload.ref_type} <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
            </>
    case "DeleteEvent":
      return <>
            {" deleted "} {event.payload.ref_type} <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
             </>
    case "PublicEvent":
      return <>
            {" made "} <b>{event.repo.name}</b> {" public"}
             </>
    case "WatchEvent":
      return <>
            {" starred "} <b>{event.repo.name}</b>
            </>
    case "PushEvent":
      return <>
            {" pushed "} to <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
            </>
    case "ReleaseEvent":
      return <> {event.payload.action} <b> {event.payload.release.name}</b> <div dangerouslySetInnerHTML={{__html: event.payload.release.short_description_html}}></div>
            </>
    case "CommitCommentEvent":
      return <> commented on commit <p>{"'"}{event.payload.comment.body}{"'"}</p>
            </>
    case "ForkEvent":
    case "GollumEvent":
    case "IssueCommentEvent":
    case "IssuesEvent":
    case "MemberEvent":
    case "PullRequestEvent":
    case "PullRequestReviewEvent":
    case "PullRequestReviewCommentEvent":
    case "SponsorshipEvent":
      return <>
      <h3>{event.type}</h3>
      <h4>{event.repo.name}</h4>

      </>
   
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


        axios.get(`users/${username}/received_events`).then((res) => {
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
        <h2>@{user.login}</h2>
        <h3>{user.display_login}</h3>

        <h3>{user.bio}</h3>
        <div>
        <h3>{user.followers}</h3><p>Followers</p>
        <h3>{user.following}</h3><p>Following</p>
        </div>


        </div>
        

      <Timeline>
        <Events>
        {events.map((event) => (
          <Event key={event.id} date={prettyDate(event.created_at)}>
          <div>
          <Image src={event.actor.avatar_url} alt="actor avatar" className="rounded" width={70} height={70}></Image>
          <p>
          <b>@{event.actor.login}</b>
          {renderEvent(event)}
          </p>
          </div>
          </Event>
        ))}
        </Events>
      </Timeline>

    </div>
  )
}

export default TimelinePage
