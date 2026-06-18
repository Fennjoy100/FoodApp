@echo off
echo ========================================
echo   Pizza Palace - Local Development Start
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak

REM Start Backend
echo.
echo Starting Backend Server...
start cmd /k "cd backend && cmd /c 'cd C:\Users\fennj\OneDrive\Desktop\NEW\backend && node server.js'"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to continue...
pause
