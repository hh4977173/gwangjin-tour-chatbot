import { useState } from "react";

//
//  🔥 1) 다국어 UI 텍스트 테이블 (tipNote 제거)
//
const TEXT = {
  ko: {
    langName: "한국어",
    welcomeTitle: "사용 언어를 선택해 주세요",
    welcomeSub: "광진구 관광 도우미 챗봇이 사용할 언어를 설정합니다.",
    btnKorean: "🇰🇷 한국어로 사용할래요",
    btnEnglish: "🇺🇸 Use in English",
    btnJapanese: "🇯🇵 日本語で使う",
    btnChinese: "🇨🇳 中文（简体）",
    headerTitle: "광진구 관광 도우미 챗봇",
    headerSub: "건대·아차산·한강공원 코스, 맛집, 카페, 산책로까지 뭐든 물어보세요.",
    exampleTitle: "이렇게 물어보면 좋아요",
    example1: "건대입구역 기준 오후 반나절 코스 추천해줘",
    example2: "아차산 초보자 등산 후 근처 저녁식사 코스 짜줘",
    chatTitle: "대화",
    chatSub: "(코스·맛집·대중교통 무엇이든 물어보세요)",
    emptyChat:
      "아직 대화가 없어요. 아래 입력창에 “광진구 야경 예쁜 코스 추천해줘”처럼 질문을 입력해보세요.",
    inputPlaceholder: "예) 내일 오후에 친구랑 건대에서 3시간 코스 추천해줘",
    sendBtn: "보내기",
  },

  en: {
    langName: "English",
    welcomeTitle: "Choose your language",
    welcomeSub: "Select the language for the Gwangjin-gu Travel Guide Chatbot.",
    btnKorean: "🇰🇷 Use in Korean",
    btnEnglish: "🇺🇸 Use in English",
    btnJapanese: "🇯🇵 Use in Japanese",
    btnChinese: "🇨🇳 Use in Chinese",
    headerTitle: "Gwangjin-gu Travel Guide Chatbot",
    headerSub:
      "Ask anything about courses, cafes, restaurants, parks, or transportation around Konkuk Univ & Achasan.",
    exampleTitle: "Try asking like this",
    example1: "Recommend a half-day course from Konkuk Univ. Station",
    example2: "Beginner Achasan hiking + dinner course recommendation",
    chatTitle: "Chat",
    chatSub: "(Ask anything about courses, food, or transportation)",
    emptyChat:
      "No messages yet. Try asking “Recommend a nightview course in Gwangjin-gu”.",
    inputPlaceholder:
      "e.g. Recommend a 3-hour course around Konkuk Univ.",
    sendBtn: "Send",
  },

  ja: {
    langName: "日本語",
    welcomeTitle: "使用する言語を選択してください",
    welcomeSub: "広津区観光ガイドチャットボットの使用言語を設定します。",
    btnKorean: "🇰🇷 韓国語で使う",
    btnEnglish: "🇺🇸 英語で使う",
    btnJapanese: "🇯🇵 日本語で使う",
    btnChinese: "🇨🇳 中国語で使う",
    headerTitle: "広津区 観光ガイド チャットボット",
    headerSub:
      "建大・峨嵯山・漢江公園のコースやグルメ・カフェなど、何でも聞いてください。",
    exampleTitle: "こんな質問がおすすめです",
    example1: "建大入口駅から半日コースをおすすめして",
    example2: "峨嵯山初心者向け登山＋夕食コースを提案して",
    chatTitle: "会話",
    chatSub: "(コース・グルメ・交通など何でもどうぞ)",
    emptyChat:
      "まだメッセージがありません。「広津区で夜景がきれいなコースを教えて」など質問してみてください。",
    inputPlaceholder: "例）建大入口で3時間コースをおすすめして",
    sendBtn: "送信",
  },

  zh: {
    langName: "中文",
    welcomeTitle: "请选择使用语言",
    welcomeSub: "设置广津区旅游向导聊天机器人的使用语言。",
    btnKorean: "🇰🇷 使用韩语",
    btnEnglish: "🇺🇸 使用英语",
    btnJapanese: "🇯🇵 使用日语",
    btnChinese: "🇨🇳 使用中文",
    headerTitle: "广津区 旅游向导 聊天机器人",
    headerSub:
      "建大·峨嵯山·汉江公园路线、美食、咖啡厅、散步路线都可以问我。",
    exampleTitle: "你可以这样提问",
    example1: "推荐从建大入口站出发的半日行程",
    example2: "峨嵯山新手爬山 + 晚餐路线推荐",
    chatTitle: "聊天",
    chatSub: "(路线、美食、交通都可以问哦)",
    emptyChat:
      "还没有开始聊天哦，可以问例如“推荐广津区夜景路线”。",
    inputPlaceholder: "例如：推荐建大入口站附近的 3 小时行程",
    sendBtn: "发送",
  },
};

//
//  🔥 버튼/공통 스타일 정의
//
const btnPrimaryStyle = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "none",
  background:
    "linear-gradient(135deg, rgba(30,129,87,0.95), rgba(43,181,192,0.9))",
  color: "white",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondaryStyle = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.3)",
  backgroundColor: "rgba(3,8,18,0.9)",
  color: "white",
  fontSize: 14,
  cursor: "pointer",
};

const iconCircle = {
  width: 40,
  height: 40,
  borderRadius: "999px",
  backgroundColor: "rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
};

const langChipStyle = {
  fontSize: 11,
  padding: "4px 10px",
  borderRadius: 999,
  backgroundColor: "rgba(0,0,0,0.18)",
  border: "1px solid rgba(255,255,255,0.28)",
};

//
//  🔥 메인 컴포넌트
//
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState(null);

  const primary = "#1e8157";
  const primaryDark = "#0c4b34";

  const t = language ? TEXT[language] : TEXT["ko"];

  //
  // 🔥 메시지 보내기
  //
  const send = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    const next = [...messages, { role: "user", content: userMsg }];
    setMessages(next);

    try {
      const r = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          language: language, // 언어 전달
        }),
      });

      const data = await r.json();
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

  //
  // 🔥 1단계: 언어 선택 화면
  //
  if (!language) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px 12px",
          background:
            "radial-gradient(circle at top left, #2bb5c0 0, #05060a 55%, #020309 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "rgba(7,10,18,0.95)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "24px 20px",
          }}
        >
          <h2>{t.welcomeTitle}</h2>
          <p style={{ opacity: 0.85, marginBottom: 20 }}>{t.welcomeSub}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setLanguage("ko")} style={btnPrimaryStyle}>
              {t.btnKorean}
            </button>

            <button onClick={() => setLanguage("en")} style={btnSecondaryStyle}>
              {t.btnEnglish}
            </button>

            <button onClick={() => setLanguage("ja")} style={btnSecondaryStyle}>
              {t.btnJapanese}
            </button>

            <button onClick={() => setLanguage("zh")} style={btnSecondaryStyle}>
              {t.btnChinese}
            </button>
          </div>
        </div>
      </div>
    );
  }

  //
  // 🔥 2단계: 본 챗봇 화면
  //
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px 12px",
        background:
          "radial-gradient(circle at top left, #2bb5c0 0, #05060a 55%, #020309 100%)",
        fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: "rgba(7,10,18,0.92)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
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
          <div style={iconCircle}>🏞️</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {t.headerTitle}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>{t.headerSub}</div>
          </div>

          <span style={langChipStyle}>Language: {t.langName}</span>
        </header>

        {/* 본문 */}
        <main style={{ padding: "18px 20px 20px" }}>
          {/* 안내 */}
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
              <div style={{ fontWeight: 600 }}>{t.exampleTitle}</div>
              <div style={{ opacity: 0.9 }}>
                • {t.example1} <br />• {t.example2}
              </div>
            </div>
          </section>

          {/* 대화 창 */}
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
              {t.chatTitle}
              <span
                style={{
                  fontSize: 11,
                  marginLeft: 8,
                  opacity: 0.75,
                }}
              >
                {t.chatSub}
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
                <div style={{ fontSize: 13, opacity: 0.7 }}>
                  {t.emptyChat}
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
                        m.role === "user"
                          ? primary
                          : "rgba(20,32,48,0.95)",
                      color: "#f5f5f5",
                      fontSize: 13,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* 입력창 */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={t.inputPlaceholder}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(5,12,24,0.95)",
                  color: "#f5f5f5",
                  fontSize: 13,
                }}
              />

              <button
                onClick={send}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #1e8157, #0c4b34)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.sendBtn}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
