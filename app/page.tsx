"use client";
import { useState, useEffect } from "react";
import { useQuickAuth, useMiniKit, useComposeCast } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { getTodayPoll, type Poll } from "./lib/polls";
import styles from "./page.module.css";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number;
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string;
}

interface VoteCounts {
  optionA: number;
  optionB: number;
}

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { composeCast } = useComposeCast();
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({ optionA: 0, optionB: 0 });
  const [error, setError] = useState("");

  // Get today's poll using the poll system
  const [currentPoll] = useState<Poll>(getTodayPoll());

  // Authentication for vote verification
  const { data: authData, isLoading: isAuthLoading } = useQuickAuth<AuthResponse>(
    "/api/auth",
    { method: "GET" }
  );

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady && setFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Load vote counts from API
  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const response = await fetch(`/api/votes?pollId=${currentPoll.id}`);
        if (response.ok) {
          const data = await response.json();
          setVoteCounts({
            optionA: data.optionA || 0,
            optionB: data.optionB || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching vote counts:", error);
        // Keep default values (0, 0) on error
      }
    };

    fetchVoteCounts();
  }, [currentPoll.id]);

  // Check if user has already voted
  useEffect(() => {
    const checkUserVote = async () => {
      if (!authData?.success || !authData?.user?.fid) {
        return;
      }

      try {
        const response = await fetch(
          `/api/votes/check?pollId=${currentPoll.id}&userFid=${authData.user.fid}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.hasVoted) {
            setHasVoted(true);
            setSelectedOption(data.option);
          }
        }
      } catch (error) {
        console.error("Error checking user vote:", error);
      }
    };

    if (authData?.success) {
      checkUserVote();
    }
  }, [authData, currentPoll.id]);

  const handleVote = async (option: "A" | "B") => {
    setError("");

    // Check if already voted
    if (hasVoted) {
      setError("You have already voted today!");
      return;
    }

    // Check authentication
    if (isAuthLoading) {
      setError("Please wait while we verify your identity...");
      return;
    }

    if (!authData?.success || !authData?.user?.fid) {
      setError("Please authenticate to vote");
      return;
    }

    try {
      // Save vote to API
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId: currentPoll.id,
          userFid: authData.user.fid,
          option,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError("You have already voted for this poll!");
          setHasVoted(true);
        } else {
          setError(data.error || "Failed to save vote");
        }
        return;
      }

      // Update UI
      setSelectedOption(option);
      setHasVoted(true);
      setVoteCounts(data.counts);

      console.log("Vote saved successfully:", data);
    } catch (error) {
      console.error("Error saving vote:", error);
      setError("Failed to save vote. Please try again.");
    }
  };

  const handleShare = () => {
    if (!hasVoted || !selectedOption) return;

    const userChoice = selectedOption === "A" ? currentPoll.optionA : currentPoll.optionB;
    const totalVotes = voteCounts.optionA + voteCounts.optionB;
    const userChoiceVotes = selectedOption === "A" ? voteCounts.optionA : voteCounts.optionB;
    const userChoicePercentage = totalVotes > 0 
      ? Math.round((userChoiceVotes / totalVotes) * 100) 
      : 0;

    const shareText = `🗳️ Just voted: ${userChoice} (${userChoicePercentage}%)\n\n${currentPoll.question}\n\nVote on today's poll! 👇`;

    composeCast({
      text: shareText,
      embeds: [typeof window !== "undefined" ? window.location.href : ""],
    });
  };

  const totalVotes = voteCounts.optionA + voteCounts.optionB;
  const optionAPercentage = totalVotes > 0 ? Math.round((voteCounts.optionA / totalVotes) * 100) : 0;
  const optionBPercentage = totalVotes > 0 ? Math.round((voteCounts.optionB / totalVotes) * 100) : 0;

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} type="button">
        ✕
      </button>

      <div className={styles.content}>
        <div className={styles.waitlistForm}>
          <h1 className={styles.title}>{minikitConfig.miniapp.name}</h1>

          <p className={styles.subtitle}>
            Hey {context?.user?.displayName || "there"}, vote on today&apos;s poll!
          </p>

          <div className={styles.pollContainer}>
            <h2 className={styles.pollQuestion}>{currentPoll.question}</h2>

            <div className={styles.voteOptions}>
              <button
                type="button"
                onClick={() => handleVote("A")}
                disabled={hasVoted}
                className={`${styles.voteButton} ${selectedOption === "A" ? styles.selected : ""} ${hasVoted ? styles.disabled : ""}`}
              >
                <span className={styles.optionText}>{currentPoll.optionA}</span>
                {hasVoted && (
                  <span className={styles.voteCount}>
                    {voteCounts.optionA} votes ({optionAPercentage}%)
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleVote("B")}
                disabled={hasVoted}
                className={`${styles.voteButton} ${selectedOption === "B" ? styles.selected : ""} ${hasVoted ? styles.disabled : ""}`}
              >
                <span className={styles.optionText}>{currentPoll.optionB}</span>
                {hasVoted && (
                  <span className={styles.voteCount}>
                    {voteCounts.optionB} votes ({optionBPercentage}%)
                  </span>
                )}
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {hasVoted && (
              <div className={styles.resultsContainer}>
                <p className={styles.thanksMessage}>Thanks for voting! 🎉</p>
                <div className={styles.resultsBar}>
                  <div
                    className={styles.resultBar}
                    style={{ width: `${optionAPercentage}%` }}
                  >
                    {optionAPercentage}%
                  </div>
                  <div
                    className={styles.resultBar}
                    style={{ width: `${optionBPercentage}%` }}
                  >
                    {optionBPercentage}%
                  </div>
                </div>
                <p className={styles.totalVotes}>Total votes: {totalVotes}</p>
                <button
                  type="button"
                  onClick={handleShare}
                  className={styles.shareButton}
                >
                  Share to Feed 📤
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
