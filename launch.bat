@echo off
title Royal Wedding Invitation - Nishant & Shweta
echo ========================================================
echo  Opening Nishant & Shweta Royal Wedding Invitation Card
echo ========================================================
echo.
echo Starting local server on http://localhost:8080/ ...
start /b powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
timeout /t 2 >nul
start http://localhost:8080/
echo.
echo Invitation opened in your browser!
echo Press any key to stop the server when you are done.
pause >nul
taskkill /f /im powershell.exe >nul 2>&1
