Write-Host "🚀 Starting TaskManager Contract Deployment..." -ForegroundColor Green

# Compile contracts
Write-Host "📦 Compiling contracts..." -ForegroundColor Yellow
truffle compile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilation successful!" -ForegroundColor Green
    
    # Deploy to development network
    Write-Host "🚀 Deploying to development network..." -ForegroundColor Yellow
    truffle migrate --network development --reset
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        
        # Get contract address
        Write-Host "📋 Contract Address:" -ForegroundColor Cyan
        truffle console --network development --exec "TaskManager.deployed().then(instance => console.log('TaskManager deployed at:', instance.address))"
        
        # Copy ABI to frontend
        Write-Host "📋 Copying ABI to frontend..." -ForegroundColor Yellow
        Copy-Item "build/contracts/TaskManager.json" "../task-manager-frontend/src/contracts/"
        Write-Host "✅ ABI copied successfully!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
        Write-Host "📝 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Copy the contract address above" -ForegroundColor White
        Write-Host "2. Update task-manager-frontend/.env.local with the address" -ForegroundColor White
        Write-Host "3. Start your frontend application" -ForegroundColor White
        
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Compilation failed!" -ForegroundColor Red
    exit 1
}
