import fetch from 'node-fetch'
import GithubUserRequest from '../interfaces/GithubUser'

export default async function getGithubUserStats(
    token: string | undefined,
    username: string,
    includeOrgs = false
): Promise<GithubUserRequest> {

    const headers = {
        Authorization: `bearer ${token}`,
    }

    const body = {
        query: `
        query($login: String!, $includeOrgs: Boolean!) {
            user(login: $login) {
              name
              login
              contributionsCollection {
                totalCommitContributions
                restrictedContributionsCount
                contributionCalendar {
                    totalContributions
                }
              }
              repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                totalCount
              }
              followers {
                totalCount
              }
              repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
                totalCount
                nodes {
                  stargazers {
                    totalCount
                  }
                }
              }
              organizations(first: 25) @include(if: $includeOrgs) {
                nodes {
                  login
                  repositories(first: 100, privacy: PUBLIC, orderBy: {direction: DESC, field: STARGAZERS}) {
                    totalCount
                    nodes {
                      stargazers {
                        totalCount
                      }
                    }
                  }
                }
              }
            }
          }
          `,
        variables: {
            login: username,
            includeOrgs: includeOrgs,
        },
    }

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
    })

    return await response.json()
}
