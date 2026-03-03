@echo off
cls
echo.
echo ========================================
echo   FLASH DEALS - RELANCEMENT PROPRE
echo ========================================
echo.

echo [1/4] Arret des serveurs Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Serveurs arretes
) else (
    echo ✓ Aucun serveur en cours
)
timeout /t 1 >nul
echo.

echo [2/4] Suppression du cache Next.js...
if exist .next (
    rmdir /s /q .next
    echo ✓ Cache .next supprime
) else (
    echo ✓ Pas de cache a supprimer
)
echo.

echo [3/4] Suppression du cache node_modules...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ Cache node_modules supprime
) else (
    echo ✓ Pas de cache node_modules
)
echo.

echo [4/4] Demarrage du serveur...
echo.
echo ========================================
echo   SERVEUR EN COURS DE DEMARRAGE...
echo ========================================
echo.
echo Une fois demarre, allez sur:
echo   http://localhost:3000/client
echo.
echo Puis appuyez sur: Ctrl + Shift + R
echo.
echo ========================================
echo.

npm run dev
