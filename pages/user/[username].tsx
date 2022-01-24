
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
import InfiniteScroll from "react-infinite-scroll-component"

const renderEvent = (event:GHEvent) => {
  switch (event.type) {
    case "CreateEvent":
      return <> created {event.payload.ref_type} <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
            </>
    case "DeleteEvent":
      return <> deleted {event.payload.ref_type} <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
             </>
    case "PublicEvent":
      return <> made <b>{event.repo.name}</b> public
             </>
    case "WatchEvent":
      return <> starred <b>{event.repo.name}</b>
            </>
    case "PushEvent":
      return <> pushed to <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
            </>
    case "ReleaseEvent":
      return <> {event.payload.action} <b> {event.payload.release.name}</b> <div dangerouslySetInnerHTML={{__html: event.payload.release.short_description_html}}></div>
            </>
    case "CommitCommentEvent":
      return <> commented on commit <p><i>{"'"}{event.payload.comment.body}{"'"}</i></p>
            </>
    case "IssueCommentEvent":
      return <> commented on {event.payload.issue.pull_request ? "pull request" : "issue"} at <b>{event.repo.name}</b>
              <p><i>{"'"}{event.payload.comment.body}{"'"}</i></p> <h3>to</h3>
              <Image src={event.payload.issue.user.avatar_url} alt="user avatar" width={70} height={70} className="rounded"></Image>
              <div>
                <b>@{event.payload.issue.user.login}</b> {event.payload.action} {event.payload.issue.pull_request ? "pull request" : "issue"}
                <h3>{event.payload.issue.title}</h3>
                <p><i>{"'"}{event.payload.issue.body}{"'"}</i></p>
              </div>
            </>
    case "ForkEvent":
      return <> forked <b>{event.repo.name}</b>
            </>
    case "IssuesEvent":
      return <> {event.payload.action} an issue at <b>{event.repo.name}</b>
              <h3>{event.payload.issue.title}</h3>
              <p><i>{"'"}{event.payload.issue.body}{"'"}</i></p>
            </>
    case "PullRequestEvent":
      return <> {event.payload.action == "closed" ? (event.payload.pull_request.merged ? "merged": "closed"): event.payload.action} a pull request at <b>{event.repo.name}</b>
              <h3>{event.payload.pull_request.title}</h3>
              <p><i>{"'"}{event.payload.pull_request.body}{"'"}</i></p>
            </>
    case "PullRequestReviewCommentEvent":
      return <> commented on pull request at <b>{event.repo.name}</b>
              <p><i>{"'"}{event.payload.comment.body}{"'"}</i></p> <h3>to</h3>
              <Image src={event.payload.pull_request.user.avatar_url} alt="user avatar" width={70} height={70} className="rounded"></Image>
              <div>
                <b>@{event.payload.pull_request.user.login}</b> {event.payload.action} pull request
                <h3>{event.payload.pull_request.title}</h3>
                <p><i>{"'"}{event.payload.pull_request.body}{"'"}</i></p>
              </div>
            </>
    case "MemberEvent":
      return <> {event.payload.action} <b>@{event.payload.member.login}</b> at <b>{event.repo.name}</b>
            </>
    case "GollumEvent":
    case "PullRequestReviewEvent":
    case "SponsorshipEvent":
      return <>
      <h3>{event.type}</h3>
      <h4>{event.repo.name}</h4>

      </>
   
  }
}


const TimelinePage: NextPage = () => {
    const { username, received } = useRouter().query
    const [user, setUser] = useState<GHUser>({} as GHUser)
    const [events, setEvents] = useState<GHEvent[]>([])
    const [hasMore, setHasmore] = useState(true)
    const [page, setPage] = useState(0)

    
    const getMoreEvents = () => {
      const eventStr = received == "true" ? "received_events" : "events" // :/

      axios.get(`users/${username}/${eventStr}?page=${page}`).then((res) => {
        if (res.data.length == 0) setHasmore(false)
        setEvents((events) => [...events, ...res.data])
        console.log(res.data)
        setPage(page + 1)
      }).catch(error => {
        Router.push({pathname: "/"})
      })
    }

      useEffect(() => {
        if (!username) return
        

        // Get user info
        axios.get(`users/${username}`).then((res) => {
          setUser(res.data)
        }).catch(error => {
            Router.push({pathname: "/"})
            console.log("User not found")
        }) 


        getMoreEvents()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username])

    return (
    <div className="text-center">
      <Head>
        <title>@{username}</title>
        <meta name="description" content="Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div style={{marginTop: 30}}>
        { user.avatar_url &&
          <Image width={150} height={150} src={user.avatar_url} alt="profile_photo" className="rounded"/>
        }
        <h2>@{user.login}</h2>

        <h4>{user.bio}</h4>
        <p>has <b>{user.public_repos}</b> public repos</p>

        <div className="flex">
        <div style={{margin: 10}}><h3>{user.followers}</h3><p>Followers</p></div>
        <div style={{margin: 10}}><h3>{user.following}</h3><p>Following</p></div>
        </div>


        </div>
        

      <Timeline>
        <Events>
        <InfiniteScroll dataLength={events.length} endMessage={<h3>Done!</h3>} hasMore={hasMore} next={getMoreEvents} loader={<h3>Loading...</h3>}>

        {events.map((event) => (
          <Event key={event.id} date={prettyDate(event.created_at)}>
          <div>
          <div className="flex">
          <Image src={event.actor.avatar_url} alt="actor avatar" className="rounded" width={70} height={70}></Image>
          {event.org?.avatar_url  && <Image src={event.org.avatar_url} alt="actor avatar" className="rounded" width={70} height={70}></Image>}
          </div>
          <p>
          <b>@{event.actor.login}</b>
          {renderEvent(event)}
          </p>
          </div>
          </Event>
        ))}
        </InfiniteScroll>
        </Events>
      </Timeline>

    </div>
  )
}

export default TimelinePage
