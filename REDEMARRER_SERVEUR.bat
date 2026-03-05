@echo off
echo ========================================
echo   REDEMARRAGE DU SERVEUR NEXT.JS
echo ========================================
echo.

echo [1/3] Arret du serveur en cours...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Nettoyage du cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/3] Demarrage du serveur...
echo.
echo Le serveur va demarrer avec les nouvelles variables d'environnement
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
npm run dev

pause
