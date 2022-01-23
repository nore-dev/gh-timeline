import {FC, ReactElement, } from "react"

import {Event} from "@merc/react-timeline"
import { GHEvent } from "../lib/GHType"
import Image from "next/image"
import prettyDate from "../lib/prettydate"

type CDEventProps = {
    event: GHEvent
}

const CDEvent = ({event}: CDEventProps):ReactElement => {
    return <Event date={prettyDate(event.created_at)}>
        <div>
        <Image src={event.actor.avatar_url} alt="actor avatar" className="rounded" width={70} height={70}></Image>
        <p><b>@{event.actor.login}</b> 
            {event.type == "DeleteEvent" && " deleted "}
            {event.type == "CreateEvent" && " created "}
            {event.payload.ref_type} <b>{event.payload.ref}</b> at <h4>{event.repo.name}</h4>
        </p>
        </div>
    </Event>
}

export default CDEvent