# LOCAL ONLY - KodBuster preview. Pure PowerShell, no dependencies.
param([int]$Port = 8765, [switch]$NoBrowser)
$ErrorActionPreference = "Stop"
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "site"))
if (!(Test-Path -LiteralPath (Join-Path $root "index.html"))) {
  Write-Host "Preview files missing. Fully extract the ZIP first." -ForegroundColor Red
  exit 1
}
$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"
  ".js"="text/javascript; charset=utf-8"; ".mjs"="text/javascript; charset=utf-8"
  ".json"="application/json; charset=utf-8"; ".svg"="image/svg+xml"
  ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"
  ".webp"="image/webp"; ".avif"="image/avif"; ".gif"="image/gif"
  ".ico"="image/x-icon"; ".woff2"="font/woff2"; ".woff"="font/woff"
  ".ttf"="font/ttf"; ".txt"="text/plain; charset=utf-8"
  ".xml"="application/xml"; ".mp4"="video/mp4"; ".webm"="video/webm"
  ".wasm"="application/wasm"; ".map"="application/json; charset=utf-8"
}
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
try { $listener.Start() } catch {
  Write-Host "Port $Port is busy. Close other previews." -ForegroundColor Red
  exit 1
}
$url = "http://127.0.0.1:$Port/"
Write-Host "KodBuster FOMO NEXT - local interactive preview" -ForegroundColor Cyan
Write-Host "URL: $url (only this computer)" -ForegroundColor Green
Write-Host "Form submissions are DISABLED; press Ctrl+C to stop."
if (!$NoBrowser) { Start-Process $url }
$crlf = [string][char]13 + [string][char]10
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.ReceiveTimeout = 10000
      $client.SendTimeout = 20000
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $firstLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($firstLine)) { continue }
      while ($true) {
        $line = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($line)) { break }
      }
      $parts = $firstLine -split '\s+'
      $method = $parts[0]
      $rawPath = $parts[1]
      $status = "200 OK"
      $body = $null
      $type = "text/plain; charset=utf-8"
      if ($method -ne "GET" -and $method -ne "HEAD") {
        $status = "405 Method Not Allowed"
        $body = [System.Text.Encoding]::UTF8.GetBytes("Preview mode: submissions are disabled; contact data is not sent.")
      } else {
        try {
          $urlPath = ([System.Uri]::new("http://localhost" + $rawPath)).AbsolutePath
          $relative = [System.Uri]::UnescapeDataString($urlPath).TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar).Replace("\", [System.IO.Path]::DirectorySeparatorChar)
          if ($relative.Length -eq 0) { $candidate = $root } else { $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relative)) }
          $safe = $candidate -eq $root -or $candidate.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
          if (!$safe) { throw "Invalid path" }
          if (Test-Path -LiteralPath $candidate -PathType Container) {
            $candidate = Join-Path $candidate "index.html"
          } elseif (!(Test-Path -LiteralPath $candidate -PathType Leaf) -and !$rawPath.Contains(".")) {
            $candidate = Join-Path $candidate "index.html"
          }
          if (!(Test-Path -LiteralPath $candidate -PathType Leaf)) {
            $status = "404 Not Found"
            $candidate = Join-Path $root "404.html"
          }
          if (Test-Path -LiteralPath $candidate -PathType Leaf) {
            $body = [System.IO.File]::ReadAllBytes($candidate)
            $ext = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
            if ($mime.ContainsKey($ext)) { $type = $mime[$ext] }
            else { $type = "application/octet-stream" }
          } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
          }
        } catch {
          $status = "403 Forbidden"
          $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
        }
      }
      if ($null -eq $body) { $body = [byte[]]@() }
      $header = "HTTP/1.1 $status" + $crlf +
        "Content-Type: $type" + $crlf +
        "Content-Length: $($body.Length)" + $crlf +
        "Cache-Control: no-store" + $crlf +
        "X-Content-Type-Options: nosniff" + $crlf +
        "Connection: close" + $crlf + $crlf
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      if ($method -ne "HEAD" -and $body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
      $stream.Flush()
    } catch {
      Write-Host ("Request error: " + $_.Exception.Message) -ForegroundColor DarkGray
    } finally {
      if ($null -ne $client) { $client.Close() }
    }
  }
} finally {
  $listener.Stop()
}
