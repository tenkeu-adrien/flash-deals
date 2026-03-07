@echo off
echo ========================================
echo Nettoyage complet et relance
echo ========================================
echo.

echo [1/5] Arret du serveur...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/5] Suppression du cache Next.js...
if exist .next rmdir /s /q .next

echo [3/5] Suppression des fichiers PWA...
if exist public\sw.js del /q public\sw.js
if exist public\workbox-*.js del /q public\workbox-*.js

echo [4/5] Nettoyage du cache npm...
npm cache clean --force

echo [5/5] Relance du serveur...
echo.
echo ========================================
echo Serveur demarre sur http://localhost:3000
echo ========================================
echo.
npm run dev
