@echo off
cls
echo.
echo ========================================
echo   INSTALLATION FIREBASE
echo ========================================
echo.

echo [1/2] Installation de Firebase...
call npm install firebase
echo.

echo [2/2] Installation de Zustand...
call npm install zustand
echo.

echo ========================================
echo   INSTALLATION TERMINEE!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Creez un projet Firebase
echo 2. Copiez .env.local.example en .env.local
echo 3. Collez vos cles Firebase
echo 4. Lancez: npm run dev
echo.
echo Consultez FIREBASE_SETUP_GUIDE.md pour plus de details
echo.
pause
