# Script Setup va Deploy Sepolia Testnet
# Chay script nay de setup moi truong va deploy contract

Write-Host "Setup va Deploy Sepolia Testnet" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Kiem tra Node.js
Write-Host "Kiem tra Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js chua duoc cai dat!" -ForegroundColor Red
    Write-Host "Vui long cai dat Node.js tu: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Kiem tra npm
Write-Host "Kiem tra npm..." -ForegroundColor Blue
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm chua duoc cai dat!" -ForegroundColor Red
    exit 1
}

# Kiem tra Truffle
Write-Host "Kiem tra Truffle..." -ForegroundColor Blue
try {
    $truffleVersion = truffle version
    Write-Host "Truffle da duoc cai dat" -ForegroundColor Green
} catch {
    Write-Host "Truffle chua duoc cai dat, dang cai dat..." -ForegroundColor Yellow
    npm install -g truffle
}

# Cai dat dependencies
Write-Host "Cai dat dependencies..." -ForegroundColor Blue
npm install

# Kiem tra file .env
Write-Host "Kiem tra file .env..." -ForegroundColor Blue
if (-not (Test-Path ".env")) {
    Write-Host "Khong tim thay file .env!" -ForegroundColor Red
    Write-Host "Tao file .env moi..." -ForegroundColor Yellow
    
    # Tao file .env mau
    @"
# Blockchain Deployment Configuration
# Thay the cac gia tri duoi day bang thong tin thuc te cua ban

# 12 tu khoa mnemonic cua vi (BAO MAT - KHONG CHIA SE!)
# Lay tu MetaMask: Settings -> Security & Privacy -> Reveal Seed Words
MNEMONIC=your_twelve_word_mnemonic_phrase_here

# Infura Project ID (lay tu https://infura.io)
# Dashboard -> Project -> Settings -> Keys -> PROJECT ID
PROJECT_ID=f329147ecd0349008e4d62d89f25186b

# Gas settings cho Sepolia (TOI UU CHO CHI PHI)
GAS_LIMIT=1500000        # 1.5M gas
GAS_PRICE=10000000000    # 10 gwei

# Network configuration
NETWORK_NAME=sepolia
CHAIN_ID=11155111
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "Da tao file .env mau" -ForegroundColor Green
    Write-Host "Vui long cap nhat MNEMONIC va PROJECT_ID trong file .env" -ForegroundColor Yellow
    Write-Host "Sau do chay lai script nay de deploy" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "File .env da ton tai" -ForegroundColor Green
}

# Kiem tra noi dung file .env
Write-Host "Kiem tra noi dung file .env..." -ForegroundColor Blue
$envContent = Get-Content ".env"
$hasMnemonic = $envContent -match "MNEMONIC="
$hasProjectId = $envContent -match "PROJECT_ID="

if (-not $hasMnemonic -or -not $hasProjectId) {
    Write-Host "File .env thieu thong tin can thiet!" -ForegroundColor Red
    Write-Host "Vui long cap nhat MNEMONIC va PROJECT_ID" -ForegroundColor Yellow
    exit 1
}

# Kiem tra xem co phai gia tri mau khong
$mnemonic = $envContent | Where-Object { $_ -match "MNEMONIC=" }
$projectId = $envContent | Where-Object { $_ -match "PROJECT_ID=" }

if ($mnemonic -match "your_twelve_word_mnemonic_phrase_here" -or $projectId -match "your_project_id_here") {
    Write-Host "Vui long cap nhat MNEMONIC va PROJECT_ID trong file .env!" -ForegroundColor Red
    Write-Host "Huong dan:" -ForegroundColor Yellow
    Write-Host "   - MNEMONIC: Lay tu MetaMask (12 tu khoa)" -ForegroundColor Cyan
    Write-Host "   - PROJECT_ID: Lay tu Infura dashboard" -ForegroundColor Cyan
    exit 1
}

Write-Host "File .env da duoc cau hinh dung" -ForegroundColor Green

# Compile contracts
Write-Host "Compile contracts..." -ForegroundColor Blue
npm run compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "Loi compile!" -ForegroundColor Red
    exit 1
}

Write-Host "Compile thanh cong!" -ForegroundColor Green

# Hoi xac nhan truoc khi deploy
Write-Host "Ban co chac chan muon deploy len Sepolia?" -ForegroundColor Yellow
Write-Host "   - Se ton Sepolia ETH de tra phi gas" -ForegroundColor Cyan
Write-Host "   - Dam bao vi co du Sepolia ETH" -ForegroundColor Cyan
$confirm = Read-Host "Nhap 'yes' de xac nhan: "

if ($confirm -ne "yes") {
    Write-Host "Huy deploy" -ForegroundColor Red
    Write-Host "Ban co the chay lai script nay sau khi san sang" -ForegroundColor Yellow
    exit 0
}

# Deploy len Sepolia
Write-Host "Bat dau deploy..." -ForegroundColor Green
npm run deploy:sepolia

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy thanh cong!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "Buoc tiep theo:" -ForegroundColor Yellow
    Write-Host "1. Copy dia chi contract tu output" -ForegroundColor Cyan
    Write-Host "2. Cap nhat vao frontend .env.local:" -ForegroundColor Cyan
    Write-Host "   NEXT_PUBLIC_TASK_MANAGER_ADDRESS=0x..." -ForegroundColor Cyan
    Write-Host "   NEXT_PUBLIC_CONTRACT_ADDRESS=0x..." -ForegroundColor Cyan
    Write-Host "3. Khoi dong frontend va test ung dung" -ForegroundColor Cyan
} else {
    Write-Host "Loi deploy!" -ForegroundColor Red
    Write-Host "Kiem tra:" -ForegroundColor Yellow
    Write-Host "   - So du Sepolia ETH" -ForegroundColor Cyan
    Write-Host "   - Ket noi internet" -ForegroundColor Cyan
    Write-Host "   - Cau hinh .env" -ForegroundColor Cyan
    Write-Host "   - Gas settings trong truffle-config.js" -ForegroundColor Cyan
}
