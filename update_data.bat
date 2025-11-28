@echo off
echo [INFO] Starting Data Update Process...

:: 1. Check for changes
git status | find "merged_all_excel.xlsx" > nul
if %errorlevel% neq 0 (
    echo [INFO] No changes detected in merged_all_excel.xlsx.
    echo [INFO] Exiting...
    pause
    exit /b
)

:: 2. Add the file
echo [INFO] Adding merged_all_excel.xlsx to git...
git add merged_all_excel.xlsx

:: 3. Commit
echo [INFO] Committing changes...
set "timestamp=%date% %time%"
git commit -m "Update data: %timestamp%"

:: 4. Push
echo [INFO] Pushing to GitHub...
git push

echo.
echo [SUCCESS] Data updated! Railway will now redeploy your application.
echo [INFO] Check deployment status at: https://railway.app/dashboard
pause
