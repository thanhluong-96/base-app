import { NextRequest, NextResponse } from "next/server";
import { getVoteCounts, hasUserVoted, saveVote, type Vote } from "../../lib/votes-storage";

/**
 * GET /api/votes?pollId=xxx
 * Get vote counts for a specific poll
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pollId = searchParams.get("pollId");

  if (!pollId) {
    return NextResponse.json(
      { error: "pollId is required" },
      { status: 400 }
    );
  }

  const counts = getVoteCounts(pollId);

  return NextResponse.json({
    pollId,
    ...counts,
  });
}

/**
 * POST /api/votes
 * Save a vote
 * Body: { pollId: string, userFid: number, option: "A" | "B" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, userFid, option } = body;

    // Validation
    if (!pollId || !userFid || !option) {
      return NextResponse.json(
        { error: "pollId, userFid, and option are required" },
        { status: 400 }
      );
    }

    if (option !== "A" && option !== "B") {
      return NextResponse.json(
        { error: "option must be 'A' or 'B'" },
        { status: 400 }
      );
    }

    // Check if user already voted for this poll
    const existingVote = hasUserVoted(pollId, userFid);

    if (existingVote) {
      return NextResponse.json(
        { error: "User has already voted for this poll" },
        { status: 409 }
      );
    }

    // Save vote
    const vote: Vote = {
      pollId,
      userFid,
      option,
      timestamp: Date.now(),
    };

    saveVote(vote);

    // Return updated counts
    const counts = getVoteCounts(pollId);

    return NextResponse.json({
      success: true,
      vote,
      counts,
    });
  } catch (error) {
    console.error("Error saving vote:", error);
    return NextResponse.json(
      { error: "Failed to save vote" },
      { status: 500 }
    );
  }
}

