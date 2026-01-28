@echo off
title AleoDAO WSL Dagitim Araci (Loglu)
color 0A

echo ========================================================
echo       AleoDAO - WSL Dagitim Araci (Ubuntu) - LOGLU
echo ========================================================
echo.
echo Islem kayitlari 'deploy_log.txt' dosyasina yazilacak.
echo.

echo [DEBUG] Leo versiyonu kontrol ediliyor...
wsl bash -l -c "leo --version"
if %errorlevel% neq 0 (
    echo [HATA] Leo bulunamadi.
    pause
    exit /b
)
echo [OK] Leo tespit edildi.

:ASK_KEY
set /p PRIVATE_KEY="Lutfen Aleo Private Key'inizi yapistirin: "
if "%PRIVATE_KEY%"=="" goto ASK_KEY

echo. > deploy_log.txt
echo BASLANGIC ZAMANI: %DATE% %TIME% >> deploy_log.txt
echo ---------------------------------------------------- >> deploy_log.txt

echo.
echo [1/3] DAO Registry Dagitiliyor...
echo [LOG] DAO Registry baslatildi... >> deploy_log.txt
wsl bash -l -c "cd '/mnt/c/Users/cheo/Desktop/leo/programs/dao_registry' && leo deploy --network testnet --endpoint https://api.explorer.provable.com/v1 --private-key %PRIVATE_KEY%" 2>&1 | tee -a deploy_log.txt
echo.
echo [1/3] TAMAMLANDI - Lutfen yukaridaki ciktiyi kontrol edin.
echo.
pause

echo.
echo [2/3] Proposal Sistemi Dagitiliyor...
echo [LOG] Proposal baslatildi... >> deploy_log.txt
wsl bash -l -c "cd '/mnt/c/Users/cheo/Desktop/leo/programs/proposal' && leo deploy --network testnet --endpoint https://api.explorer.provable.com/v1 --private-key %PRIVATE_KEY%" 2>&1 | tee -a deploy_log.txt
echo.
echo [2/3] TAMAMLANDI - Lutfen yukaridaki ciktiyi kontrol edin.
echo.
pause

echo.
echo [3/3] Private Vote Sistemi Dagitiliyor...
echo [LOG] Private Vote baslatildi... >> deploy_log.txt
wsl bash -l -c "cd '/mnt/c/Users/cheo/Desktop/leo/programs/private_vote' && leo deploy --network testnet --endpoint https://api.explorer.provable.com/v1 --private-key %PRIVATE_KEY%" 2>&1 | tee -a deploy_log.txt
echo.
echo [3/3] TAMAMLANDI - Lutfen yukaridaki ciktiyi kontrol edin.
echo.
pause

echo.
echo ========================================================
echo TUM ISLEMLER BITTI. 'deploy_log.txt' dosyasini kontrol edin.
echo ========================================================
echo.
pause
