@echo off
echo ===================================================
echo 💼 PMP Mastery - PM Remote Jobs Database Updater
echo ===================================================
echo.
echo Sourcing active postings from RemoteOK...
node update_jobs_db.js
echo.
echo ===================================================
echo Database refresh process finished!
echo ===================================================
echo.
pause
