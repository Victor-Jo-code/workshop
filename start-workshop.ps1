$ErrorActionPreference = 'Stop'
$workshopRoot = $PSScriptRoot
$workshopUrl = 'http://localhost:8080'
$workshopRunning = $false
try {
    $workshopResponse = Invoke-WebRequest -Uri $workshopUrl -UseBasicParsing -TimeoutSec 2
    $workshopRunning = $workshopResponse.Content.Contains('WORKSHOP GUIDE')
    if (-not $workshopRunning) { throw 'Port 8080 is already in use by another application.' }
} catch {
    if ($_.Exception.Message -like '*already in use*') { throw }
}
if (-not $workshopRunning) {
    $workshopPython = (Get-Command python -ErrorAction Stop).Source
    $workshopPublic = Join-Path $workshopRoot 'public'
    Start-Process -FilePath $workshopPython -ArgumentList @('-m', 'http.server', '8080', '--bind', '127.0.0.1', '--directory', ('"' + $workshopPublic + '"')) -WorkingDirectory $workshopRoot -WindowStyle Hidden
    Start-Sleep -Seconds 1
}
Start-Process $workshopUrl
