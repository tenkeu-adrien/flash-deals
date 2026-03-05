@echo off
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║         OUVERTURE DE LA DOCUMENTATION IMPORTANTE                 ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

echo Ouverture des fichiers importants...
echo.

start notepad FAIRE_MAINTENANT.txt
timeout /t 1 /nobreak >nul

start notepad INSTRUCTIONS_FINALES.txt
timeout /t 1 /nobreak >nul

start notepad RESUME_COMPLET_FINAL.md

echo.
echo ✅ Documentation ouverte!
echo.
echo Lisez les fichiers ouverts pour comprendre les prochaines étapes.
echo.
pause
