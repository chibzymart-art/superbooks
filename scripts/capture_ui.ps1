$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\HP\.gemini\antigravity-ide\scratch\superbooks\screenshots"

$pages = @(
    @{ name = "community"; url = "http://localhost:3000/community" },
    @{ name = "admin"; url = "http://localhost:3000/admin" },
    @{ name = "login"; url = "http://localhost:3000/auth/login" },
    @{ name = "reader_flip"; url = "http://localhost:3000/read/the-souls-of-black-folk/1?mode=flip" }
)

foreach ($page in $pages) {
    $outFile = Join-Path $outDir ($page.name + ".png")
    Write-Host "Capturing $($page.name) from $($page.url)..."
    & $chrome --headless=new --disable-gpu --window-size=1440,1080 "--screenshot=$outFile" $page.url
    Start-Sleep -Seconds 1
}

Write-Host "Done"
