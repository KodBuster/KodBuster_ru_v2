@echo off
title KodBuster FOMO NEXT - Interactive preview
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-preview.ps1"
echo.
echo Local preview stopped. Press any key to close.
pause >nul
