import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "./api";

const ROUND_COLORS = [
    { border: "#1a9e75", bg: "rgba(26,158,117,0.08)", text: "#4dd6a3" },
    { border: "#5b6ee1", bg: "rgba(91,110,225,0.08)", text: "#8899ff" },
    { border: "#e15b8e", bg: "rgba(225,91,142,0.08)", text: "#ff88b3" },
    { border: "#e1a05b", bg: "rgba(225,160,91,0.08)", text: "#ffcc88" },
];

function MatchCard({ match, roundIndex, matchIndex, isAdmin, onUpdateMatch }) {
    const [score1, setScore1] = useState(match.score_1 ?? 0);
    const [score2, setScore2] = useState(match.score_2 ?? 0);
    const [saving, setSaving] = useState(false);

    const handleSetWinner = async (winnerId, winnerName, s1, s2) => {
        setSaving(true);
        try {
            await onUpdateMatch(roundIndex, matchIndex, {
                winner_id: winnerId,
                winner_name: winnerName,
                score_1: s1,
                score_2: s2,
            });
        } finally {
            setSaving(false);
        }
    };

    const isCompleted = match.status === "completed";
    const team1Win    = match.winner_id === match.team1_id;
    const team2Win    = match.winner_id === match.team2_id;

    return (
        <div style={{
            background: "#0a1a14",
            border: `1px solid ${isCompleted ? "#1a9e75" : "#1a3d30"}`,
            borderRadius: 10, padding: "10px 14px",
            minWidth: 200, position: "relative",
        }}>
            {isCompleted && (
                <div style={{
                    position: "absolute", top: -8, right: 8,
                    fontSize: 10, padding: "1px 8px", borderRadius: 999,
                    background: "rgba(26,158,117,0.2)", color: "#4dd6a3",
                    border: "1px solid rgba(26,158,117,0.3)",
                }}>Selesai</div>
            )}

            {/* Team 1 */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 8px", borderRadius: 6, marginBottom: 4,
                background: team1Win ? "rgba(26,158,117,0.15)" : "transparent",
                border: team1Win ? "1px solid rgba(26,158,117,0.3)" : "1px solid transparent",
            }}>
                <span style={{
                    fontSize: 13, fontWeight: team1Win ? 700 : 400,
                    color: team1Win ? "#4dd6a3" : match.team1_name === "BYE" ? "#555" : "#c8e6da",
                }}>
                    {team1Win && "👑 "}{match.team1_name || "TBD"}
                </span>
                {isAdmin && !isCompleted && match.team1_id && match.team2_id && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <input
                            type="number" min="0" value={score1}
                            onChange={e => setScore1(Number(e.target.value))}
                            style={{
                                width: 36, padding: "2px 4px", borderRadius: 4,
                                background: "#0d1f1a", border: "1px solid #1a3d30",
                                color: "#c8e6da", fontSize: 12, textAlign: "center",
                            }}
                        />
                        <button
                            onClick={() => handleSetWinner(match.team1_id, match.team1_name, score1, score2)}
                            disabled={saving}
                            style={{
                                fontSize: 11, padding: "2px 8px", borderRadius: 4,
                                background: "rgba(26,158,117,0.2)", color: "#4dd6a3",
                                border: "1px solid rgba(26,158,117,0.3)", cursor: "pointer",
                            }}
                        >Menang</button>
                    </div>
                )}
                {isCompleted && <span style={{ fontSize: 13, fontWeight: 700, color: "#f0faf6" }}>{match.score_1}</span>}
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: "#555", marginBottom: 4 }}>VS</div>

            {/* Team 2 */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 8px", borderRadius: 6,
                background: team2Win ? "rgba(26,158,117,0.15)" : "transparent",
                border: team2Win ? "1px solid rgba(26,158,117,0.3)" : "1px solid transparent",
            }}>
                <span style={{
                    fontSize: 13, fontWeight: team2Win ? 700 : 400,
                    color: team2Win ? "#4dd6a3" : match.team2_name === "BYE" ? "#555" : "#c8e6da",
                }}>
                    {team2Win && "👑 "}{match.team2_name || "TBD"}
                </span>
                {isAdmin && !isCompleted && match.team1_id && match.team2_id && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <input
                            type="number" min="0" value={score2}
                            onChange={e => setScore2(Number(e.target.value))}
                            style={{
                                width: 36, padding: "2px 4px", borderRadius: 4,
                                background: "#0d1f1a", border: "1px solid #1a3d30",
                                color: "#c8e6da", fontSize: 12, textAlign: "center",
                            }}
                        />
                        <button
                            onClick={() => handleSetWinner(match.team2_id, match.team2_name, score1, score2)}
                            disabled={saving}
                            style={{
                                fontSize: 11, padding: "2px 8px", borderRadius: 4,
                                background: "rgba(26,158,117,0.2)", color: "#4dd6a3",
                                border: "1px solid rgba(26,158,117,0.3)", cursor: "pointer",
                            }}
                        >Menang</button>
                    </div>
                )}
                {isCompleted && <span style={{ fontSize: 13, fontWeight: 700, color: "#f0faf6" }}>{match.score_2}</span>}
            </div>
        </div>
    );
}

export default function TournamentBracketPage() {
    const { id } = useParams();
    const [bracket, setBracket]       = useState(null);
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading]       = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError]           = useState(null);
    const [notif, setNotif]           = useState("");

    const authUser = JSON.parse(localStorage.getItem("auth_user") || "null");
    const isAdmin  = authUser?.role === "admin" || authUser?.role === "panitia";

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [tRes, bRes] = await Promise.allSettled([
                api.get(`/tournaments/${id}`),
                api.get(`/tournaments/${id}/bracket`),
            ]);
            if (tRes.status === "fulfilled") setTournament(tRes.value.data);
            if (bRes.status === "fulfilled") {
                const bracketData = bRes.value.data;
                console.log("Bracket data:", bracketData); // debug
                setBracket(bracketData);
            } else {
                setError("Bracket belum dibuat. Klik 'Generate Bracket' untuk memulai.");
            }
        } catch (e) {
            setError("Gagal memuat data.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await api.post(`/tournaments/${id}/bracket/generate`);
            setBracket(res.data);
            showNotif("✅ Bracket berhasil dibuat!");
        } catch (err) {
            showNotif("❌ " + (err.response?.data?.message || "Gagal generate bracket."));
        } finally {
            setGenerating(false);
        }
    };

    // ── Ambil bracket ID dengan aman ──────────────────────────────────────────
    const getBracketId = () => {
        if (!bracket) return null;
        // MongoDB Laravel bisa return _id sebagai string atau object
        const raw = bracket._id ?? bracket.id;
        if (!raw) return null;
        // Kalau berbentuk object {$oid: "..."} (BSON)
        if (typeof raw === "object" && raw.$oid) return raw.$oid;
        return String(raw);
    };

    const handleUpdateMatch = async (roundIndex, matchIndex, data) => {
        const bracketId = getBracketId();
        if (!bracketId) {
            showNotif("❌ Bracket ID tidak ditemukan.");
            return;
        }
        try {
            const res = await api.put(
                `/brackets/${bracketId}/match/${roundIndex}/${matchIndex}`,
                data
            );
            setBracket(res.data);
            showNotif("✅ Hasil match diperbarui!");
        } catch (err) {
            showNotif("❌ " + (err.response?.data?.message || "Gagal update match."));
        }
    };

    const showNotif = (msg) => {
        setNotif(msg);
        setTimeout(() => setNotif(""), 3000);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0a1a14", fontFamily: "sans-serif", color: "#f0faf6" }}>
            {/* Header */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "0.5px solid #1a3d30",
                background: "#0d1f1a",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link to="/tournaments" style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid #1a3d30",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#7ab89e", textDecoration: "none", fontSize: 18,
                    }}>←</Link>
                    <div>
                        <div style={{ fontSize: 11, color: "#4dd6a3", letterSpacing: 1 }}>BAGAN PERTANDINGAN</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                            {tournament?.name || "Loading..."}
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        style={{
                            padding: "8px 16px", borderRadius: 8,
                            background: generating ? "rgba(26,158,117,0.1)" : "#1a9e75",
                            color: "#fff", border: "none", cursor: "pointer",
                            fontSize: 13, fontWeight: 600,
                            opacity: generating ? 0.7 : 1,
                        }}
                    >
                        {generating ? "⏳ Generating..." : bracket ? "🔄 Reset Bracket" : "⚡ Generate Bracket"}
                    </button>
                )}
            </div>

            {/* Notif */}
            {notif && (
                <div style={{
                    position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
                    zIndex: 999, padding: "10px 20px", borderRadius: 8,
                    background: "#0d1f1a", border: "1px solid #1a3d30",
                    fontSize: 14, color: "#f0faf6",
                }}>{notif}</div>
            )}

            {/* Content */}
            <div style={{ padding: "2rem 1.5rem", overflowX: "auto" }}>
                {loading && (
                    <div style={{ textAlign: "center", padding: "4rem", color: "#7ab89e" }}>Loading...</div>
                )}

                {!loading && error && !bracket && (
                    <div style={{ textAlign: "center", padding: "4rem" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
                        <p style={{ color: "#7ab89e", marginBottom: 8 }}>{error}</p>
                        {isAdmin && (
                            <p style={{ fontSize: 13, color: "#4dd6a3" }}>
                                Pastikan ada minimal 2 tim yang sudah di-approve.
                            </p>
                        )}
                    </div>
                )}

                {!loading && bracket && (
                    <>
                        {/* Juara */}
                        {(() => {
                            const lastRound  = bracket.rounds?.[bracket.rounds.length - 1];
                            const finalMatch = lastRound?.matches?.[0];
                            if (finalMatch?.winner_name) {
                                return (
                                    <div style={{
                                        textAlign: "center", marginBottom: "2rem",
                                        padding: "1rem", borderRadius: 12,
                                        background: "rgba(26,158,117,0.1)",
                                        border: "1px solid rgba(26,158,117,0.3)",
                                    }}>
                                        <div style={{ fontSize: 32 }}>🏆</div>
                                        <div style={{ fontSize: 13, color: "#7ab89e" }}>JUARA TURNAMEN</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: "#4dd6a3" }}>
                                            {finalMatch.winner_name}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Bracket rounds */}
                        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", minWidth: "max-content" }}>
                            {bracket.rounds?.map((round, rIdx) => {
                                const color = ROUND_COLORS[rIdx % ROUND_COLORS.length];
                                return (
                                    <div key={rIdx} style={{ minWidth: 220 }}>
                                        <div style={{
                                            textAlign: "center", marginBottom: 12,
                                            padding: "4px 12px", borderRadius: 999,
                                            background: color.bg,
                                            border: `1px solid ${color.border}`,
                                            color: color.text,
                                            fontSize: 12, fontWeight: 700, letterSpacing: 1,
                                        }}>
                                            {round.label}
                                        </div>
                                        <div style={{
                                            display: "flex", flexDirection: "column", gap: 16,
                                            justifyContent: "space-around",
                                            minHeight: `${round.matches.length * 100}px`,
                                        }}>
                                            {round.matches.map((match, mIdx) => (
                                                <MatchCard
                                                    key={match.match_id || mIdx}
                                                    match={match}
                                                    roundIndex={rIdx}
                                                    matchIndex={mIdx}
                                                    isAdmin={isAdmin}
                                                    onUpdateMatch={handleUpdateMatch}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
