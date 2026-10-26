@echo off
powershell.exe -NoProfile -File "%~dp0start-workshop.ps1"
if errorlevel 1 pause
