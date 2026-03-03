@echo off
cls
echo.
echo ========================================
echo   REPARATION TAILWIND CSS
echo ========================================
echo.

echo [1/5] Arret des serveurs...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo ✓ Serveurs arretes
echo.

echo [2/5] Suppression du cache Next.js...
if exist .next (
    rmdir /s /q .next
    echo ✓ Cache .next supprime
) else (
    echo ✓ Pas de cache
)
echo.

echo [3/5] Suppression du cache node_modules...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ Cache node_modules supprime
) else (
    echo ✓ Pas de cache node_modules
)
echo.

echo [4/5] Reinstallation des dependances...
call npm install
echo.

echo [5/5] Demarrage du serveur...
echo.
echo ========================================
echo   TAILWIND CSS REPARE!
echo ========================================
echo.
echo Allez sur: http://localhost:3000/doc
echo Puis appuyez sur: Ctrl + Shift + R
echo.
echo ========================================
echo.

npm run dev
