#!/bin/bash

echo "🚀 Starting TaskManager Contract Deployment..."

# Compile contracts
echo "📦 Compiling contracts..."
truffle compile

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
    
    # Deploy to development network
    echo "🚀 Deploying to development network..."
    truffle migrate --network development --reset
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        
        # Get contract address
        echo "📋 Contract Address:"
        truffle console --network development --exec "TaskManager.deployed().then(instance => console.log('TaskManager deployed at:', instance.address))"
        
        # Copy ABI to frontend
        echo "📋 Copying ABI to frontend..."
        cp build/contracts/TaskManager.json ../task-manager-frontend/src/contracts/
        echo "✅ ABI copied successfully!"
        
        echo ""
        echo "🎉 Deployment completed successfully!"
        echo "📝 Next steps:"
        echo "1. Copy the contract address above"
        echo "2. Update task-manager-frontend/.env.local with the address"
        echo "3. Start your frontend application"
        
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Compilation failed!"
    exit 1
fi
