import { SITE } from "@/lib/site";

export interface GithubStats {
  repos: number;
  followers: number;
  stars: number;
}

/**
 * Public GitHub numbers for the About section. Cached for an hour and
 * silently skipped (returns null) if GitHub is unreachable or rate-limited.
 */
export async function getGithubStats(): Promise<GithubStats | null> {
  try {
    const headers = { Accept: "application/vnd.github+json" };
    const next = { revalidate: 3600 };
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${SITE.githubUser}`, { headers, next }),
      fetch(`https://api.github.com/users/${SITE.githubUser}/repos?per_page=100&type=owner`, { headers, next }),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;
    const user = (await userRes.json()) as { public_repos: number; followers: number };
    const repos = (await reposRes.json()) as { stargazers_count: number; fork: boolean }[];
    return {
      repos: user.public_repos,
      followers: user.followers,
      stars: repos.filter((r) => !r.fork).reduce((sum, r) => sum + r.stargazers_count, 0),
    };
  } catch {
    return null;
  }
}
