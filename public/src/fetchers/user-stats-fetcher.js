"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getGithubUserStats(token, username, includeOrgs = false) {
    const headers = {
        Authorization: `bearer ${token}`,
    };
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
    };
    const response = await (0, node_fetch_1.default)('https://api.github.com/graphql', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
    });
    return await response.json();
}
exports.default = getGithubUserStats;
//# sourceMappingURL=user-stats-fetcher.js.map