@echo off
echo Starting development servers...

:: Start backend server
start cmd /k "cd backend && npm run dev"

:: Start frontend server
start cmd /k "cd frontend && npm run dev"

echo Development servers started!
echo Backend running at: http://localhost:5000
echo Frontend running at: http://localhost:3000 