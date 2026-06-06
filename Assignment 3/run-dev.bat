@echo off

REM --- start backend ---
cd backend
call venv\Scripts\activate

start "Backend" cmd /k python server.py

cd ..

REM --- start frontend server ---
start "Frontend" cmd /k python -m http.server 5500 --directory frontend

REM --- open browser ---
timeout /t 2 >nul
start http://localhost:5500/index.html