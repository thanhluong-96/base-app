import { NextRequest, NextResponse } from "next/server";
import { hasUserVoted } from "../../../lib/votes-storage";

/**
 * GET /api/votes/check?pollId=xxx&userFid=xxx
 * Check if user has already voted for a poll
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pollId = searchParams.get("pollId");
  const userFidParam = searchParams.get("userFid");

  if (!pollId || !userFidParam) {
    return NextResponse.json(
      { error: "pollId and userFid are required" },
      { status: 400 }
    );
  }

  const userFid = parseInt(userFidParam, 10);
  if (isNaN(userFid)) {
    return NextResponse.json(
      { error: "userFid must be a number" },
      { status: 400 }
    );
  }

  // Check if user has voted
  const existingVote = hasUserVoted(pollId, userFid);

  if (existingVote) {
    return NextResponse.json({
      hasVoted: true,
      option: existingVote.option,
      timestamp: existingVote.timestamp,
    });
  }

  return NextResponse.json({
    hasVoted: false,
  });
}

