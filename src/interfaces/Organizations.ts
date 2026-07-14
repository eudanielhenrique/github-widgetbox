import { Repositories } from './Repositories'

export interface Organizations {
    nodes: Organization[]
}

export interface Organization {
    login: string
    repositories: Repositories
}
