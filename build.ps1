# Define file path
$apiFilePath = "src/api.ts"

# Backup original file
$backupFilePath = "$apiFilePath.bak"
Copy-Item -Path $apiFilePath -Destination $backupFilePath -Force

try {
    # Read the content of the file
    $content = Get-Content -Path $apiFilePath

    # Step 1: Modify axios.post URL
    $content = $content -replace "http://127.0.0.1:8000", ""

    # Step 2: Modify axios.get URL
    # $content = $content -replace "axios\.get\(`http://127.0.0.1:8000/label_info", "axios.get(`/label_info"

    # Save modified content back to the file
    $content | Set-Content -Path $apiFilePath

    # Step 3: Execute yarn build
    Write-Output "Running yarn build..."
    $buildResult = & yarn build

    if ($LASTEXITCODE -eq 0) {
        Write-Output "Build succeeded."

        # Step 4: Revert changes by restoring the original file
        Copy-Item -Path $backupFilePath -Destination $apiFilePath -Force
        Write-Output "Changes reverted successfully."
    } else {
        Write-Output "Build failed. Not reverting changes."
    }
} catch {
    Write-Error "An error occurred: $_"
    Write-Error "Reverting to the original file."
    Copy-Item -Path $backupFilePath -Destination $apiFilePath -Force
} finally {
    # Cleanup: Remove backup file
    Remove-Item -Path $backupFilePath -Force
}
