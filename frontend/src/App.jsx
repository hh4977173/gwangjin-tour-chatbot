import { useState } from "react";

export default function App() {
  // ✅ 비밀번호 관련 상태
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");

  // ✅ 채팅 관련 상태
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔐 비밀번호 확인 함수
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "HTM") {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("비밀번호가 올바르지 않아요. 다시 확인해 주세요.");
    }
  };

  // 📨 메시지 전송 함수
const send = async () => {
  if (!input.trim()) return;

  // 1) 지금 입력값 따로 저장
  const userInput = input;

  // 2) 보내자마자 입력창 비우기
  setInput("");

  // 3) 채팅 로그에 사용자 메시지 추가
  const next = [...messages, { role: "user", content: userInput }];
  setMessages(next);

  try {
    const r = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 비밀 토큰 쓰면 여기 헤더 추가
        // "X-ACCESS-TOKEN": "gwangjin-secret-2025",
      },
      body: JSON.stringify({ messages: next }),
    });
    const data = await r.json();

    // 4) 모델 응답 추가
    setMessages([...next, { role: "assistant", content: data.content }]);
  } catch (err) {
    setMessages([
      ...next,
      {
        role: "assistant",
        content:
          "서버에 연결할 수 없어요. 백엔드(8000번 포트)가 켜져 있는지 확인해 주세요.",
      },
    ]);
  }
};


  const primary = "#1e8157"; // 광진구/한강 느낌 초록
  const primaryDark = "#0c4b34";

  // 🔐 아직 비밀번호 통과 전이면, 로그인 페이지를 먼저 보여줌
  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          margin: 0,
          padding: "24px 12px",
          background:
            "radial-gradient(circle at top left, #2bb5c0 0, #05060a 55%, #020309 100%)",
          color: "#f5f5f5",
          fontFamily:
            '"Pretendard", "Noto Sans KR", -apple-system, system-ui, sans-serif',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "rgba(7,10,18,0.95)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            padding: "24px 22px 20px",
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            광진구 관광 도우미 챗봇 입장
          </h1>
          <p
            style={{
              fontSize: 13,
              opacity: 0.8,
              margin: "0 0 18px",
              lineHeight: 1.5,
            }}
          >
            이 서비스는 초대받은 사용자만 이용할 수 있어요.
            <br />
            입장 비밀번호를 입력하면 챗봇 화면으로 이동합니다.
          </p>

          <form onSubmit={handleLogin}>
            <label
              htmlFor="pw"
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              입장 비밀번호
            </label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              style={{
                width: "100%",
                padding: "9px 11px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.22)",
                backgroundColor: "rgba(5,12,24,0.96)",
                color: "#f5f5f5",
                fontSize: 13,
                outline: "none",
                marginBottom: 8,
              }}
            />
            {pwError && (
              <div
                style={{
                  fontSize: 12,
                  color: "#ff8a80",
                  marginBottom: 10,
                }}
              >
                {pwError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 999,
                border: "none",
                background: `linear-gradient(135deg, ${primary}, ${primaryDark})`,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(0,0,0,0.6)",
                marginTop: 4,
              }}
            >
              입장하기
            </button>
          </form>

          <div
            style={{
              fontSize: 11,
              opacity: 0.65,
              marginTop: 14,
              lineHeight: 1.5,
            }}
          >
            ※ 다른 사람과 URL이 공유되더라도 비밀번호를 모르면 사용할 수
            없습니다.
          </div>
        </div>
      </div>
    );
  }

  // 🔽 여기부터는 "비밀번호 통과 후" 기존 챗봇 UI
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "24px 12px",
        background:
          "radial-gradient(circle at top left, #2bb5c0 0, #05060a 55%, #020309 100%)",
        color: "#f5f5f5",
        fontFamily:
          '"Pretendard", "Noto Sans KR", -apple-system, system-ui, sans-serif',
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: "rgba(7,10,18,0.92)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* 상단 헤더 */}
        <header
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background:
              "linear-gradient(120deg, rgba(30,129,87,0.96), rgba(43,181,192,0.9))",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "999px",
              backgroundColor: "rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🏞️
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.03em",
              }}
            >
              광진구 관광 도우미 챗봇
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.9,
                marginTop: 2,
              }}
            >
              건대·아차산·한강공원 코스, 맛집, 카페, 산책로까지 뭐든 물어보세요.
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 999,
              backgroundColor: "rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,255,255,0.28)",
            }}
          >
            Gwangjin-gu Guide
          </span>
        </header>

        {/* 메인 내용 */}
        <main style={{ padding: "18px 20px 20px" }}>
          {/* 안내 문구 */}
          <section
            style={{
              marginBottom: 16,
              padding: "10px 12px",
              borderRadius: 12,
              background:
                "linear-gradient(120deg, rgba(12,75,52,0.9), rgba(5,17,28,0.95))",
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 13,
              display: "flex",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 18 }}>🧭</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                이렇게 물어보면 좋아요
              </div>
              <div style={{ opacity: 0.9 }}>
                예){" "}
                <span style={{ color: "#b9f6ca" }}>
                  “건대입구역 기준 오후 반나절 코스 추천해줘”
                </span>
                ,{" "}
                <span style={{ color: "#b2ebf2" }}>
                  “아차산 초보자 등산 후 근처 저녁식사 코스 짜줘”
                </span>
              </div>
            </div>
          </section>

          {/* 채팅 카드 */}
          <section
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              background:
                "radial-gradient(circle at top, rgba(255,255,255,0.05), rgba(7,10,18,0.98))",
              padding: 14,
            }}
          >
            <h4
              style={{
                margin: "0 0 10px",
                fontSize: 14,
                fontWeight: 600,
                color: "#e0f2f1",
              }}
            >
              대화
              <span style={{ fontSize: 11, marginLeft: 8, opacity: 0.75 }}>
                (코스·맛집·대중교통 무엇이든 물어보세요)
              </span>
            </h4>

            <div
              style={{
                minHeight: 210,
                maxHeight: 360,
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                marginBottom: 10,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                backgroundColor: "rgba(3,8,18,0.9)",
                padding: 10,
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.7,
                  }}
                >
                  아직 대화가 없어요. 아래 입력창에{" "}
                  <b>“광진구 야경 예쁜 코스 추천해줘”</b>처럼 질문을
                  입력해보세요.
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {m.role === "assistant" && (
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 999,
                        backgroundColor: "#0b3b2a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        marginRight: 6,
                        flexShrink: 0,
                      }}
                    >
                      🌉
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "6px 10px",
                      borderRadius:
                        m.role === "user"
                          ? "12px 12px 3px 12px"
                          : "12px 12px 12px 3px",
                      backgroundColor:
                        m.role === "user" ? primary : "rgba(20,32,48,0.95)",
                      color: "#f5f5f5",
                      fontSize: 13,
                      lineHeight: 1.45,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 줄 */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="예) 내일 오후에 친구랑 건대에서 3시간 코스 추천해줘"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(5,12,24,0.95)",
                  color: "#f5f5f5",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                onClick={send}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "none",
                  background: `linear-gradient(135deg, ${primary}, ${primaryDark})`,
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
                  whiteSpace: "nowrap",
                }}
              >
                보내기
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
