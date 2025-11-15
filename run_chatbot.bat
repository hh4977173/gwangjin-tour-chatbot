@echo off
title 🧠 My-Bot 자동 실행기
echo.
echo ===========================================
echo      🚀 My-Bot Chatbot Auto Starter
echo ===========================================
echo.

:: 백엔드 실행
echo [1/2] 백엔드 서버(FastAPI) 실행 중...
cd backend
call .venv\Scripts\activate
start cmd /k "uvicorn app:app --reload --port 8000"
cd ..

:: 프론트엔드 실행
echo [2/2] 프론트엔드(React) 실행 중...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo ✅ 모든 서버가 실행되었습니다!
echo 브라우저에서 http://localhost:5173 열어보세요.
echo.
pause
