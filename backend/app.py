from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import httpx

# -------------------
# 1) .env 파일 불러오기
# -------------------
load_dotenv()

# 2) 환경변수 읽기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
USE_OLLAMA = os.getenv("USE_OLLAMA", "false").lower() == "true"
MODEL = os.getenv("MODEL", "llama3.1:8b")  # 기본값은 Ollama 모델로 둠

# -------------------
# 3) FastAPI + CORS 설정
# -------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용은 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------
# 데이터 모델 정의
# -------------------
class Message(BaseModel):
    role: str
    content: str

class ChatIn(BaseModel):
    messages: list[Message]
    language: str | None = None  # 🔥 프론트에서 넘어오는 언어 코드(ko/en/ja/zh)

# -------------------
# 헬스 체크
# -------------------
@app.get("/ping")
def ping():
    return {"pong": True}

# -------------------
# OpenAI 호출 (옵션)
# -------------------
async def call_openai(messages: list[dict]) -> str:
    if not OPENAI_API_KEY:
        return (
            "⚠️ 현재 OpenAI API Key가 없습니다. "
            ".env 파일에서 OPENAI_API_KEY를 설정하거나 USE_OLLAMA=true로 변경하세요."
        )

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, headers=headers, json=payload)
            r.raise_for_status()
            data = r.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            return (
                "지금 OpenAI API 사용량 제한(429)에 걸려 있어요. "
                "조금 있다가 다시 시도해 보거나, OpenAI 대시보드에서 사용량을 확인해 주세요."
            )
        return f"OpenAI API 오류가 발생했습니다. (상태코드: {e.response.status_code})"
    except Exception as e:
        return f"OpenAI 호출 중 오류 발생: {e}"

# -------------------
# Ollama 호출
# -------------------
async def call_ollama(messages: list[dict]) -> str:
    try:
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": MODEL,
                    "messages": messages,
                    "stream": False,  # 전체 응답 한 번에 받기
                },
            )
            r.raise_for_status()
            data = r.json()
            # Ollama chat 응답: {"message": {"role": "...", "content": "..."}, ...}
            return data["message"]["content"]
    except Exception as e:
        return f"Ollama 호출 중 오류 발생: {e}"

# -------------------
# 언어별 system prompt 생성 함수
# -------------------
def build_system_prompt(language: str | None) -> dict:
    lang = (language or "ko").lower()

    # 한국어
    if lang == "ko":
        content = (
            "너는 서울 광진구 관광 도우미 챗봇이야. "
            "광진구(건대입구, 화양동, 자양동, 구의동, 광장동, 자양한강공원, 아차산 일대 등)에 대해 "
            "관광, 맛집, 카페, 산책 코스, 대중교통 정보를 안내해. "
            "단, 네가 확실하지 않은 정보(예: 최신 영업시간, 가격, 정확한 주소, 예약 가능 여부 등)는 "
            "추측해서 말하지 말고, '정확한 정보는 지도 앱이나 공식 홈페이지에서 다시 확인해 주세요.'라고 꼭 덧붙여. "
            "특히 없는 장소나 모르는 장소를 지어내지 말고 '잘 모르겠다'고 대답해. "
            "말투는 관광 도우미라는 느낌이 들 수 있도록 친절한 '해요체'를 사용해. "
            "광진구가 아닌 다른 지역의 질문이 나오면 '저는 광진구 전용 챗봇이라 다른 지역은 잘 알지 못해요.'라고 답해. "
            "질문이 '광진 학생문화체험관에선 어떤 체험이 가능해?'라면, "
            "'광진 학생문화체험관은 참여자가 진짜 학생이 된 것처럼 학교생활 프로그램을 제공해요! "
            "교복을 입고 한국어 교실 및 예절 교육·전통 놀이 체험·K-POP 수업을 듣고, "
            "식사 시간에는 급식을 먹어볼 수 있어요. 체험이 끝날 때는 정말 학교를 졸업하는 것처럼 "
            "졸업식을 해 졸업장을 받아볼 수 있어요. 관심 있으시면 예약 사이트를 알려드릴까요?'라고 답해."
        )
    # 영어
    elif lang == "en":
        content = (
            "You are a friendly local tour guide chatbot for Gwangjin-gu in Seoul. "
            "You answer in English. Help visitors with sightseeing spots, cafes, restaurants, "
            "walking courses, and public transportation around Konkuk Univ. area, Hwayang-dong, "
            "Jayang-dong, Guui-dong, Gwangjang-dong, Jayang Hangang Park, and Achasan. "
            "If you are not sure about something (like exact opening hours, prices, or reservation details), "
            "do NOT make things up. Instead, clearly say that they should double-check on a map app or the official website. "
            "If the user asks about areas outside Gwangjin-gu, say: "
            "'I am a Gwangjin-gu focused guide, so I am not very familiar with other districts.'"
        )
    # 일본어
    elif lang == "ja":
        content = (
            "あなたはソウル市広津区（クァンジング）の観光案内チャットボットです。 "
            "日本人観光客にも分かりやすい丁寧な日本語で答えてください。 "
            "建大入口駅周辺、華陽洞、紫陽洞、九宜洞、広壮洞、紫陽漢江公園、峨嵯山エリアなどについて、 "
            "観光スポット、カフェ、グルメ、散歩コース、地下鉄やバスなどの交通手段を案内します。 "
            "営業時間や料金などの最新情報に自信がないときは、推測せずに、"
            "'正確な情報は地図アプリや公式ホームページで確認してください'と必ず付け加えてください。 "
            "広津区以外の地域について聞かれた場合は、"
            "'私は広津区専門のガイドなので、他の地域についてはあまり詳しくありません'と答えてください。"
        )
    # 중국어(간체)
    elif lang == "zh":
        content = (
            "你是首尔广津区的旅游向导聊天机器人。请使用简体中文进行回答，并保持亲切、有礼貌的语气。"
            "主要为游客介绍建大入口站周边、华阳洞、紫阳洞、九宜洞、广壮洞、紫阳汉江公园、峨嵯山一带的 "
            "景点、美食、咖啡厅、散步路线以及地铁和公交等交通方式。"
            "如果你不确定某些信息（例如最新营业时间、价格、是否需要预约等），不要凭空编造，"
            "而是要说明：'准确资讯请再透过地图应用或官方网站确认'。"
            "如果用户询问的是广津区以外的地区，请回答："
            "'我是广津区专用导览机器人，对其他地区不太熟悉哦。'"
        )
    else:
        # 기본은 한국어
        content = (
            "너는 서울 광진구 관광 도우미 챗봇이야. "
            "광진구 관광, 맛집, 카페, 산책 코스, 대중교통을 한국어로 친절하게 안내해."
        )

    return {"role": "system", "content": content}

# -------------------
# /chat 엔드포인트
# -------------------
@app.post("/chat")
async def chat(inp: ChatIn):
    # 언어에 맞는 system prompt 생성
    sys = build_system_prompt(inp.language)
    msgs = [sys] + [m.model_dump() for m in inp.messages]

    # Ollama 또는 OpenAI 선택
    if USE_OLLAMA:
        content = await call_ollama(msgs)
    else:
        content = await call_openai(msgs)

    return {"content": content}
