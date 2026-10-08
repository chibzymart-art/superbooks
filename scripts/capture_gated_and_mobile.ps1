$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\HP\.gemini\antigravity-ide\scratch\superbooks\screenshots"

$items = @(
    @{ name = "gated_chapter"; url = "http://localhost:3000/read/the-prophet/2"; width = 1440; height = 1080 },
    @{ name = "mobile_home"; url = "http://localhost:3000/"; width = 390; height = 844 },
    @{ name = "mobile_reader"; url = "http://localhost:3000/read/the-souls-of-black-folk/1"; width = 390; height = 844 }
)

foreach ($item in $items) {
    $outFile = Join-Path $outDir ($item.name + ".png")
    $args = @(
        "--headless=new",
        "--disable-gpu",
        "--window-size=$($item.width),$($item.height)",
        "--screenshot=$outFile",
        $item.url
    )
    Write-Host "Capturing $($item.name)..."
    $proc = Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait
    Start-Sleep -Milliseconds 500
}

Write-Host "Finished"
Get-ChildItem $outDir
