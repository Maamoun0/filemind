$filePath = "c:\Users\Maamoun\Downloads\antygravity\easy tool 1\06 - سياسة تعارض المصالح.pdf"
$url = "https://filemind-backend-api-production-b423.up.railway.app/api/tools/upload"

Write-Host "File exists: $(Test-Path $filePath)"

$boundary = [System.Guid]::NewGuid().ToString()
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileContent = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes)

$body = "--$boundary`r`n"
$body += "Content-Disposition: form-data; name=`"file`"; filename=`"test.pdf`"`r`n"
$body += "Content-Type: application/pdf`r`n`r`n"
$body += $fileContent + "`r`n"
$body += "--$boundary`r`n"
$body += "Content-Disposition: form-data; name=`"toolType`"`r`n`r`n"
$body += "pdf-to-word`r`n"
$body += "--$boundary--`r`n"

$bytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bytes
    $response | ConvertTo-Json
} catch {
    Write-Host "Upload failed: $($_.Exception.Message)"
}
