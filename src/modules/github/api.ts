export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export const githubApi = {
  async fetchRecentCommits(repo: string, token: string): Promise<GitHubCommit[]> {
    if (!token || !repo) return [];
    
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error("Failed to fetch GitHub commits", err);
      throw err;
    }
  }
};
