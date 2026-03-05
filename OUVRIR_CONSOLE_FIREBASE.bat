@echo off
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║            OUVERTURE DE LA CONSOLE FIREBASE                       ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

echo Ouverture de la console Firebase pour le projet: wego-97624
echo.

echo Pages qui vont s'ouvrir:
echo   1. Console Firebase (projet wego-97624)
echo   2. Authentication
echo   3. Firestore Database
echo   4. Storage
echo.

echo Appuyez sur une touche pour ouvrir...
pause >nul

echo.
echo Ouverture de la console Firebase...
start https://console.firebase.google.com/project/wego-97624

timeout /t 2 /nobreak >nul

echo Ouverture de Authentication...
start https://console.firebase.google.com/project/wego-97624/authentication/users

timeout /t 2 /nobreak >nul

echo Ouverture de Firestore...
start https://console.firebase.google.com/project/wego-97624/firestore

timeout /t 2 /nobreak >nul

echo Ouverture de Storage...
start https://console.firebase.google.com/project/wego-97624/storage

echo.
echo ✅ Console Firebase ouverte!
echo.
echo Suivez les instructions dans: ACTIVER_FIREBASE_MAINTENANT.txt
echo.
pause
