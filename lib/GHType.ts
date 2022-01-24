
export type GHRepo = {
    id: number,
    name: string,
    url: string
}

export type GHActor = {
    id: number,
    login: string,
    display_login: string,
    gravatar_id: string,
    url: string,
    avatar_url: string,    
}

export type GHUser = GHActor & {
    bio: string,
    following: number,
    followers: number,
    public_repos: number
}

export type GHEvent = {
    id: string,
    type: string,
    actor: GHActor,
    org?: GHActor,
    repo: GHRepo,
    payload: any,
    public: boolean,
    created_at: string
}