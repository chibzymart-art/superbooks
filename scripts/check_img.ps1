$file = "C:\Users\HP\.gemini\antigravity-ide\scratch\superbooks\screenshots\mobile_reader.png"
$bytes = [System.IO.File]::ReadAllBytes($file)
$w = [System.BitConverter]::ToInt32($bytes[19..16], 0)
$h = [System.BitConverter]::ToInt32($bytes[23..20], 0)
Write-Host "Width: $w Height: $h"
