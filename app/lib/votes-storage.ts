/**
 * Shared in-memory storage for votes
 * In production, replace with a real database (PostgreSQL, MongoDB, etc.)
 */

export interface Vote {
  pollId: string;
  userFid: number;
  option: "A" | "B";
  timestamp: number;
}

// In-memory storage (will reset on server restart)
// TODO: Replace with database
export const votesStorage: Vote[] = [];

/**
 * Get vote counts for a specific poll
 */
export function getVoteCounts(pollId: string): { optionA: number; optionB: number; total: number } {
  const pollVotes = votesStorage.filter((vote) => vote.pollId === pollId);
  const optionA = pollVotes.filter((vote) => vote.option === "A").length;
  const optionB = pollVotes.filter((vote) => vote.option === "B").length;
  
  return {
    optionA,
    optionB,
    total: optionA + optionB,
  };
}

/**
 * Check if user has already voted for a poll
 */
export function hasUserVoted(pollId: string, userFid: number): Vote | null {
  return votesStorage.find(
    (vote) => vote.pollId === pollId && vote.userFid === userFid
  ) || null;
}

/**
 * Save a vote
 */
export function saveVote(vote: Vote): void {
  votesStorage.push(vote);
}

